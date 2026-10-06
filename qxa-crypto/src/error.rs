use thiserror::Error;

#[derive(Debug, Error)]
pub enum CryptoError {
    #[error("invalid parameter set")]
    InvalidParameterSet,
    #[error("tree height mismatch")]
    TreeHeightMismatch,
    #[error("XMSS error: {0}")]
    Xmss(String),
    #[error("invalid public key")]
    InvalidPublicKey,
    #[error("issue verification failed")]
    IssueVerifyFailed,
    #[error("serialization error: {0}")]
    Serialization(String),
}
