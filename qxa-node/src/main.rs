mod bitcoin_tx;
mod issuer_state;

use std::net::SocketAddr;
use std::str::FromStr;
use std::sync::{Arc, Mutex};

use axum::extract::State;
use axum::routing::{get, post};
use axum::{Json, Router};
use bitcoin::Network;
use clap::{Parser, Subcommand};
use issuer_state::{
    append_asset_record, build_genesis_payload, generate_key_bundle, load_bundle, load_signing_key,
    list_asset_records, policy_from_bundle, save_bundle, DataDir, IssuedAssetRecord, IssuerKeyBundle,
};
use qxa_crypto::{IssuePacket, IssuancePolicy};
use qxa_indexer::{IndexerDb, ingest_transaction, register_genesis_tx};
use qxa_signer::{IssueRequest, XmssSigner};
use serde::Deserialize;
use tower_http::cors::CorsLayer;

use crate::bitcoin_tx::{address_from_str, RpcWallet};

#[derive(Parser)]
#[command(name = "qxa-node", about = "QXA real issuance (regtest/signet)")]
struct Cli {
    #[command(subcommand)]
    cmd: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Generate XMSS issuer keys for a symbol
    Keygen {
        symbol: String,
        #[arg(long, default_value = "sequential")]
        policy: String,
    },
    /// Broadcast GENESIS OP_RETURN and register asset in indexer
    Genesis {
        symbol: String,
        #[arg(long, default_value = "http://127.0.0.1:18443")]
        rpc: String,
        #[arg(long, env = "BITCOIN_RPC_USER", default_value = "qxa")]
        rpc_user: String,
        #[arg(long, env = "BITCOIN_RPC_PASS", default_value = "qxa")]
        rpc_pass: String,
        #[arg(long, default_value = "regtest")]
        network: String,
    },
    /// ISSUE next serial to a Bitcoin address
    Issue {
        symbol: String,
        #[arg(long)]
        to: String,
        #[arg(long, default_value = "http://127.0.0.1:18443")]
        rpc: String,
        #[arg(long, env = "BITCOIN_RPC_USER", default_value = "qxa")]
        rpc_user: String,
        #[arg(long, env = "BITCOIN_RPC_PASS", default_value = "qxa")]
        rpc_pass: String,
        #[arg(long, default_value = "regtest")]
        network: String,
    },
    /// HTTP API + read indexer state
    Serve {
        #[arg(long, default_value = "0.0.0.0:8787")]
        listen: String,
    },
}

#[derive(Clone)]
struct AppState {
    dir: DataDir,
    db: Arc<Mutex<IndexerDb>>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();
    let dir = DataDir::from_env();
    let db = IndexerDb::open(dir.indexer_db().to_str().unwrap()).map_err(|e| e.to_string())?;

    match cli.cmd {
        Commands::Keygen { symbol, policy } => {
            let pol = if policy == "lottery" {
                IssuancePolicy::BlockLotteryV1
            } else {
                IssuancePolicy::SequentialIssuer
            };
            let bundle = generate_key_bundle(&symbol, pol)?;
            let path = save_bundle(&dir, &bundle)?;
            println!("{}", serde_json::to_string_pretty(&bundle)?);
            eprintln!("saved {}", path.display());
        }
        Commands::Genesis {
            symbol,
            rpc,
            rpc_user,
            rpc_pass,
            network,
        } => {
            let net = network_from(&network);
            let bundle = load_bundle(&dir, &symbol)?;
            let payload = build_genesis_payload(&bundle, policy_from_bundle(&bundle))?;
            let bytes = payload.to_bytes().map_err(|e| e.to_string())?;
            let wallet = RpcWallet::connect(&rpc, &rpc_user, &rpc_pass)?;
            let (txid, vout) = wallet.fund_and_send_op_return(&bytes, "qxa-genesis")?;
            let tx = wallet.get_tx(&txid)?;
            let vk = hex::decode(&bundle.verifying_key_hex).map_err(|e| e.to_string())?;
            let height = wallet.block_height()?;
            let asset_id = register_genesis_tx(&db, &tx, vout, &payload, &vk, height)?;
            append_asset_record(
                &dir,
                &IssuedAssetRecord {
                    asset_id: asset_id.to_hex(),
                    symbol: symbol.clone(),
                    genesis_txid: txid.to_string(),
                    genesis_vout: vout,
                    verifying_key_hex: bundle.verifying_key_hex.clone(),
                },
            )?;
            println!(
                "{}",
                serde_json::json!({
                    "asset_id": asset_id.to_hex(),
                    "genesis_txid": txid.to_string(),
                    "genesis_vout": vout,
                    "network": net.to_string(),
                })
            );
        }
        Commands::Issue {
            symbol,
            to,
            rpc,
            rpc_user,
            rpc_pass,
            network,
        } => {
            let net = network_from(&network);
            let bundle = load_bundle(&dir, &symbol)?;
            let assets = list_asset_records(&dir)?;
            let asset = assets
                .iter()
                .find(|a| a.symbol.eq_ignore_ascii_case(&symbol))
                .ok_or("asset not found — run genesis first")?;
            let stored = db
                .get_asset(&asset.asset_id)?
                .ok_or("asset missing in indexer")?;
            let sk = load_signing_key(&bundle)?;
            let mut signer = XmssSigner::open(dir.signer_db(), sk)?;
            let serial = signer.next_index()?;
            let addr = address_from_str(&to, net)?;
            let script = addr.script_pubkey();
            let genesis = bitcoin::OutPoint {
                txid: bitcoin::Txid::from_str(&asset.genesis_txid).map_err(|e| e.to_string())?,
                vout: asset.genesis_vout,
            };
            let asset_id = qxa_crypto::AssetId(
                hex::decode(&asset.asset_id)
                    .map_err(|e| e.to_string())?
                    .try_into()
                    .map_err(|_| "asset id len")?,
            );
            let sig = signer.issue(IssueRequest {
                asset_id,
                serial,
                recipient_script_pubkey: script.as_bytes().to_vec(),
                genesis_outpoint: genesis,
                nonce: 0,
            })?;
            let packet = IssuePacket {
                asset_id: asset_id.0,
                serial,
                nonce: 0,
                recipient_script_pubkey: script.as_bytes().to_vec(),
                detached_signature: sig,
            };
            let wallet = RpcWallet::connect(&rpc, &rpc_user, &rpc_pass)?;
            let txid = wallet.send_issue_tx(&addr, &packet, "qxa-issue")?;
            let tx = wallet.get_tx(&txid)?;
            let height = wallet.block_height()?;
            ingest_transaction(&db, &tx, height)?;
            println!(
                "{}",
                serde_json::json!({
                    "serial": serial,
                    "issue_txid": txid.to_string(),
                    "recipient": to,
                    "issued": stored.issued + 1,
                })
            );
        }
        Commands::Serve { listen } => {
            let state = AppState {
                dir,
                db: Arc::new(Mutex::new(db)),
            };
            let app = Router::new()
                .route("/v1/assets", get(list_assets))
                .route("/v1/births", get(list_births))
                .route("/v1/keygen", post(api_keygen))
                .route("/health", get(|| async { "ok" }))
                .with_state(state)
                .layer(CorsLayer::permissive());
            let addr: SocketAddr = listen.parse()?;
            let listener = tokio::net::TcpListener::bind(addr).await?;
            eprintln!("qxa-node listening on http://{}", addr);
            axum::serve(listener, app).await?;
        }
    }
    Ok(())
}

fn network_from(s: &str) -> Network {
    match s {
        "mainnet" => Network::Bitcoin,
        "testnet" => Network::Testnet,
        "signet" => Network::Signet,
        _ => Network::Regtest,
    }
}

async fn list_assets(State(state): State<AppState>) -> Json<Vec<qxa_indexer::StoredAsset>> {
    let db = state.db.lock().expect("indexer db");
    Json(db.list_assets().unwrap_or_default())
}

async fn list_births(State(state): State<AppState>) -> Json<Vec<qxa_indexer::StoredBirth>> {
    let db = state.db.lock().expect("indexer db");
    Json(db.list_births(None).unwrap_or_default())
}

#[derive(Deserialize)]
struct KeygenBody {
    symbol: String,
    policy: Option<String>,
}

async fn api_keygen(State(state): State<AppState>, Json(body): Json<KeygenBody>) -> Json<IssuerKeyBundle> {
    let pol = if body.policy.as_deref() == Some("lottery") {
        IssuancePolicy::BlockLotteryV1
    } else {
        IssuancePolicy::SequentialIssuer
    };
    let bundle = generate_key_bundle(&body.symbol, pol).expect("keygen");
    save_bundle(&state.dir, &bundle).expect("save");
    Json(bundle)
}
