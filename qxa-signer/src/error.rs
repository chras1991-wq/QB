use thiserror::Error;

#[derive(Debug, Error)]
pub enum SignerError {
    #[error("database error: {0}")]
    Db(String),
    #[error("index mismatch: expected {expected}, got {actual}")]
    IndexMismatch { expected: u64, actual: u64 },
    #[error("index {0} permanently burned (reserved or signed)")]
    IndexBurned(u64),
    #[error("asset closed")]
    AssetClosed,
    #[error("crypto error: {0}")]
    Crypto(String),
    #[error("serialization error: {0}")]
    Serialization(String),
}
