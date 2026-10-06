use crate::error::CryptoError;
/// RFC 8391 XMSS OID prefix length in serialized keys.
const XMSS_OID_LEN: usize = 4;

/// Extract the Merkle root from a serialized XMSS public key (RFC 8391 layout).
///
/// Layout: `OID || PUB_SEED (n) || root (n)`.
pub fn xmss_public_root(vk_bytes: &[u8]) -> Result<Vec<u8>, CryptoError> {
    if vk_bytes.len() <= XMSS_OID_LEN {
        return Err(CryptoError::InvalidPublicKey);
    }
    let body = vk_bytes.len() - XMSS_OID_LEN;
    if body % 2 != 0 {
        return Err(CryptoError::InvalidPublicKey);
    }
    let n = body / 2;
    let root_start = XMSS_OID_LEN + n;
    Ok(vk_bytes[root_start..root_start + n].to_vec())
}
