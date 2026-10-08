use bitcoin::OutPoint;
use qxa_crypto::{verify_issue, IssueProof};

use crate::asset::AssetRecord;
use crate::error::IndexerError;
use crate::reorg::ChainEvent;

pub struct IssueContext {
    pub birth_outpoint: OutPoint,
    pub recipient_matches: bool,
}

pub fn apply_issue(
    asset: &mut AssetRecord,
    proof: &IssueProof,
    ctx: &IssueContext,
    event: ChainEvent,
) -> Result<(), IndexerError> {
    if asset.status == crate::asset::AssetStatus::Closed {
        return Err(IndexerError::AssetClosed);
    }
    if proof.serial != asset.next_index {
        return Err(IndexerError::WrongSerial {
            expected: asset.next_index,
            actual: proof.serial,
        });
    }
    if asset.issued >= asset.max_serials {
        return Err(IndexerError::CapacityExceeded);
    }
    if !ctx.recipient_matches {
        return Err(IndexerError::InvalidIssueProof);
    }
    verify_issue(&asset.xmss_verifying_key, proof).map_err(|_| IndexerError::InvalidIssueProof)?;

    asset.next_index = proof.serial + 1;
    asset.issued += 1;
    let _ = event; // persisted by full indexer DB (block_height, hash, ...)
    let _ = ctx.birth_outpoint;
    Ok(())
}
