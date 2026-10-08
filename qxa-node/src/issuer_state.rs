use std::fs;
use std::path::PathBuf;

use qxa_crypto::{GenesisPayload, IssuancePolicy, ParameterSetId, xmss_public_root};
use sha2::{Digest, Sha256};
use serde::{Deserialize, Serialize};
use xmss::{KeyPair, SigningKey, XmssSha2_10_256};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct IssuerKeyBundle {
    pub symbol: String,
    pub verifying_key_hex: String,
    pub signing_key_hex: String,
    pub xmss_root_hex: String,
    pub tree_height: u8,
    pub policy: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct IssuedAssetRecord {
    pub asset_id: String,
    pub symbol: String,
    pub genesis_txid: String,
    pub genesis_vout: u32,
    pub verifying_key_hex: String,
}

#[derive(Clone)]
pub struct DataDir {
    pub root: PathBuf,
}

impl DataDir {
    pub fn from_env() -> Self {
        let root = std::env::var("QXA_DATA")
            .map(PathBuf::from)
            .unwrap_or_else(|_| PathBuf::from(".qxa"));
        fs::create_dir_all(&root).ok();
        Self { root }
    }

    pub fn keys_dir(&self) -> PathBuf {
        let p = self.root.join("keys");
        fs::create_dir_all(&p).ok();
        p
    }

    pub fn indexer_db(&self) -> PathBuf {
        self.root.join("indexer.db")
    }

    pub fn signer_db(&self) -> PathBuf {
        self.root.join("signer.db")
    }

    pub fn assets_file(&self) -> PathBuf {
        self.root.join("assets.json")
    }
}

pub fn generate_key_bundle(symbol: &str, policy: IssuancePolicy) -> Result<IssuerKeyBundle, String> {
    let mut rng = rand::rng();
    let mut kp = KeyPair::<XmssSha2_10_256>::generate(&mut rng).map_err(|e| e.to_string())?;
    let vk_bytes = kp.verifying_key().as_ref().to_vec();
    let sk_bytes = kp.signing_key().as_ref().to_vec();
    let root = xmss_public_root(&vk_bytes).map_err(|e| e.to_string())?;
    Ok(IssuerKeyBundle {
        symbol: symbol.to_string(),
        verifying_key_hex: hex::encode(vk_bytes),
        signing_key_hex: hex::encode(sk_bytes),
        xmss_root_hex: hex::encode(root),
        tree_height: 10,
        policy: match policy {
            IssuancePolicy::SequentialIssuer => "sequential".into(),
            IssuancePolicy::BlockLotteryV1 => "block_lottery_v1".into(),
        },
    })
}

pub fn load_signing_key(bundle: &IssuerKeyBundle) -> Result<SigningKey<XmssSha2_10_256>, String> {
    let sk = hex::decode(&bundle.signing_key_hex).map_err(|e| e.to_string())?;
    SigningKey::<XmssSha2_10_256>::try_from(sk.as_slice()).map_err(|e| e.to_string())
}

pub fn build_genesis_payload(bundle: &IssuerKeyBundle, policy: IssuancePolicy) -> Result<GenesisPayload, String> {
    let metadata_hash: [u8; 32] = Sha256::digest(b"{}").into();
    Ok(GenesisPayload {
        parameter_set: ParameterSetId::XmssSha2_10_256,
        tree_height: bundle.tree_height,
        xmss_public_root: hex::decode(&bundle.xmss_root_hex).map_err(|e| e.to_string())?,
        symbol: bundle.symbol.clone(),
        metadata_hash,
        issuance_policy: policy,
    })
}

pub fn save_bundle(dir: &DataDir, bundle: &IssuerKeyBundle) -> Result<PathBuf, String> {
    let path = dir.keys_dir().join(format!("{}.json", bundle.symbol.to_lowercase()));
    fs::write(&path, serde_json::to_string_pretty(bundle).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
    Ok(path)
}

pub fn load_bundle(dir: &DataDir, symbol: &str) -> Result<IssuerKeyBundle, String> {
    let path = dir.keys_dir().join(format!("{}.json", symbol.to_lowercase()));
    let text = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&text).map_err(|e| e.to_string())
}

pub fn append_asset_record(dir: &DataDir, rec: &IssuedAssetRecord) -> Result<(), String> {
    let path = dir.assets_file();
    let mut list: Vec<IssuedAssetRecord> = if path.exists() {
        serde_json::from_str(&fs::read_to_string(&path).map_err(|e| e.to_string())?).unwrap_or_default()
    } else {
        vec![]
    };
    list.push(rec.clone());
    fs::write(path, serde_json::to_string_pretty(&list).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn list_asset_records(dir: &DataDir) -> Result<Vec<IssuedAssetRecord>, String> {
    let path = dir.assets_file();
    if !path.exists() {
        return Ok(vec![]);
    }
    serde_json::from_str(&fs::read_to_string(&path).map_err(|e| e.to_string())?).map_err(|e| e.to_string())
}

pub fn policy_from_bundle(bundle: &IssuerKeyBundle) -> IssuancePolicy {
    if bundle.policy == "block_lottery_v1" {
        IssuancePolicy::BlockLotteryV1
    } else {
        IssuancePolicy::SequentialIssuer
    }
}
