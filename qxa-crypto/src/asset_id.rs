use bitcoin::OutPoint;
use bitcoin_hashes::Hash;
use sha2::{Digest, Sha256};

/// 32-byte asset identifier.
#[derive(Clone, Copy, PartialEq, Eq, Hash, Debug)]
pub struct AssetId(pub [u8; 32]);

impl AssetId {
    pub fn to_hex(&self) -> String {
        hex::encode(self.0)
    }
}

const DOMAIN: &[u8] = b"PQASSET/V1";

/// `AssetID = SHA256("PQASSET/V1" || genesis_outpoint || xmss_public_root)`
pub fn compute_asset_id(genesis: OutPoint, xmss_public_root: &[u8]) -> AssetId {
    let mut buf = Vec::with_capacity(DOMAIN.len() + 36 + xmss_public_root.len());
    buf.extend_from_slice(DOMAIN);
    buf.extend_from_slice(&encode_outpoint(genesis));
    buf.extend_from_slice(xmss_public_root);
    AssetId(Sha256::digest(&buf).into())
}

pub fn encode_outpoint(outpoint: OutPoint) -> [u8; 36] {
    let mut out = [0u8; 36];
    out[..32].copy_from_slice(&outpoint.txid.to_byte_array());
    out[32..].copy_from_slice(&outpoint.vout.to_le_bytes());
    out
}
