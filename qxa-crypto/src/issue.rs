use bitcoin::OutPoint;
use xmss::{DetachedSignature, SigningKey, VerifyingKey, XmssSha2_10_256};

use crate::asset_id::{encode_outpoint, AssetId};
use crate::error::CryptoError;
use crate::hash::tagged_hash;

const ISSUE_TAG: &str = "QXA/ISSUE";

#[derive(Clone, Debug)]
pub struct IssueProof {
    pub asset_id: AssetId,
    pub serial: u64,
    pub recipient_script_pubkey: Vec<u8>,
    pub genesis_outpoint: OutPoint,
    pub nonce: u64,
    pub detached_signature: Vec<u8>,
}

/// Canonical bytes hashed for XMSS (before TaggedHash).
pub fn issue_message_preimage(
    asset_id: &AssetId,
    serial: u64,
    recipient_script_pubkey: &[u8],
    genesis_outpoint: OutPoint,
    nonce: u64,
) -> Vec<u8> {
    let mut msg = Vec::new();
    msg.extend_from_slice(&asset_id.0);
    msg.extend_from_slice(&serial.to_be_bytes());
    msg.extend_from_slice(recipient_script_pubkey);
    msg.extend_from_slice(&encode_outpoint(genesis_outpoint));
    msg.extend_from_slice(&nonce.to_be_bytes());
    msg
}

pub fn build_issue_message(
    asset_id: &AssetId,
    serial: u64,
    recipient_script_pubkey: &[u8],
    genesis_outpoint: OutPoint,
    nonce: u64,
) -> [u8; 32] {
    let preimage = issue_message_preimage(
        asset_id,
        serial,
        recipient_script_pubkey,
        genesis_outpoint,
        nonce,
    );
    tagged_hash(ISSUE_TAG, &preimage)
}

/// Sign an ISSUE message. The signing key index advances exactly once (XMSS stateful semantics).
pub fn sign_issue(
    signing_key: &mut SigningKey<XmssSha2_10_256>,
    proof: &IssueProof,
) -> Result<Vec<u8>, CryptoError> {
    let message = build_issue_message(
        &proof.asset_id,
        proof.serial,
        &proof.recipient_script_pubkey,
        proof.genesis_outpoint,
        proof.nonce,
    );
    let sig = signing_key
        .sign_detached(&message)
        .map_err(|e| CryptoError::Xmss(e.to_string()))?;
    Ok(sig.as_ref().to_vec())
}

pub fn verify_issue(
    verifying_key_bytes: &[u8],
    proof: &IssueProof,
) -> Result<(), CryptoError> {
    let message = build_issue_message(
        &proof.asset_id,
        proof.serial,
        &proof.recipient_script_pubkey,
        proof.genesis_outpoint,
        proof.nonce,
    );
    let vk = VerifyingKey::<XmssSha2_10_256>::try_from(verifying_key_bytes)
        .map_err(|e| CryptoError::Xmss(e.to_string()))?;
    let sig = DetachedSignature::<XmssSha2_10_256>::try_from(proof.detached_signature.as_slice())
        .map_err(|e| CryptoError::Xmss(e.to_string()))?;
    vk.verify_detached(&sig, &message)
        .map_err(|_| CryptoError::IssueVerifyFailed)?;
    Ok(())
}
