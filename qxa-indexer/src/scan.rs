use std::str::FromStr;

use bitcoin::blockdata::script::Instruction;
use bitcoin::opcodes::all::OP_RETURN;
use bitcoin::{OutPoint, ScriptBuf, Transaction};
use qxa_crypto::{
    compute_asset_id, verify_issue, xmss_public_root, AssetId, GenesisPayload, IssueProof,
    QxaOpReturn, try_parse_qxa_op_return,
};

use crate::db::IndexerDb;
use crate::error::IndexerError;

pub fn op_return_payload(script: &ScriptBuf) -> Option<Vec<u8>> {
    let mut it = script.instructions();
    let first = it.next();
    let second = it.next();
    match (first, second) {
        (Some(Ok(Instruction::Op(op))), Some(Ok(Instruction::PushBytes(bytes)))) if op == OP_RETURN => {
            Some(bytes.as_bytes().to_vec())
        }
        _ => None,
    }
}

pub fn register_genesis_tx(
    db: &IndexerDb,
    tx: &Transaction,
    genesis_vout: u32,
    genesis_payload: &GenesisPayload,
    verifying_key: &[u8],
    block_height: u32,
) -> Result<AssetId, IndexerError> {
    let genesis_out = OutPoint {
        txid: tx.compute_txid(),
        vout: genesis_vout,
    };
    let root = xmss_public_root(verifying_key).map_err(|_| IndexerError::InvalidIssueProof)?;
    if genesis_payload.xmss_public_root != root {
        return Err(IndexerError::InvalidTx("xmss root mismatch".into()));
    }
    let asset_id = compute_asset_id(genesis_out, &root);
    let max = 1u64 << genesis_payload.tree_height;
    db.insert_genesis(
        asset_id,
        &genesis_payload.symbol,
        genesis_out,
        verifying_key,
        &root,
        genesis_payload.tree_height,
        max,
        genesis_payload.issuance_policy,
    )?;
    db.set_meta("last_block_height", &block_height.to_string())?;
    Ok(asset_id)
}

pub fn ingest_transaction(
    db: &IndexerDb,
    tx: &Transaction,
    block_height: u32,
) -> Result<IngestReport, IndexerError> {
    let mut report = IngestReport::default();
    let txid = tx.compute_txid().to_string();

    for (vout, output) in tx.output.iter().enumerate() {
        if !output.script_pubkey.is_op_return() {
            continue;
        }
        let payload = op_return_payload(&output.script_pubkey)
            .ok_or_else(|| IndexerError::InvalidTx("bad op_return".into()))?;
        let parsed = try_parse_qxa_op_return(&payload).map_err(|e| IndexerError::InvalidTx(e.to_string()))?;
        match parsed {
            QxaOpReturn::Genesis(_) => {
                report.genesis_seen += 1;
                let _ = vout;
            }
            QxaOpReturn::Issue(packet) => {
                let asset_id_hex = hex::encode(packet.asset_id);
                let asset = db.get_asset(&asset_id_hex)?.ok_or(IndexerError::UnknownAsset)?;
                if asset.status != "open" {
                    return Err(IndexerError::AssetClosed);
                }
                if packet.serial != asset.next_index {
                    return Err(IndexerError::WrongSerial {
                        expected: asset.next_index,
                        actual: packet.serial,
                    });
                }
                if asset.issued >= asset.max_serials {
                    return Err(IndexerError::CapacityExceeded);
                }
                let genesis = parse_outpoint(&asset.genesis_txid, asset.genesis_vout)?;
                let proof = IssueProof {
                    asset_id: AssetId(packet.asset_id),
                    serial: packet.serial,
                    recipient_script_pubkey: packet.recipient_script_pubkey.clone(),
                    genesis_outpoint: genesis,
                    nonce: packet.nonce,
                    detached_signature: packet.detached_signature,
                };
                verify_issue(&asset.xmss_verifying_key, &proof).map_err(|_| IndexerError::InvalidIssueProof)?;
                let recipient_vout = find_recipient_vout(tx, &packet.recipient_script_pubkey)?;
                db.apply_birth(
                    &asset_id_hex,
                    packet.serial,
                    &txid,
                    recipient_vout,
                    block_height,
                    &packet.recipient_script_pubkey,
                )?;
                report.issues += 1;
            }
        }
    }
    Ok(report)
}

fn parse_outpoint(txid_hex: &str, vout: u32) -> Result<OutPoint, IndexerError> {
    let txid = bitcoin::Txid::from_str(txid_hex).map_err(|_| IndexerError::InvalidTx("txid".into()))?;
    Ok(OutPoint { txid, vout })
}

fn find_recipient_vout(tx: &Transaction, script: &[u8]) -> Result<u32, IndexerError> {
    for (i, out) in tx.output.iter().enumerate() {
        if out.script_pubkey.as_bytes() == script {
            return Ok(i as u32);
        }
    }
    Err(IndexerError::InvalidIssueProof)
}

#[derive(Default, Debug)]
pub struct IngestReport {
    pub issues: u32,
    pub genesis_seen: u32,
}
