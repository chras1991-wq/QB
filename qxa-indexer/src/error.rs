use thiserror::Error;

#[derive(Debug, Error)]
pub enum IndexerError {
    #[error("unknown asset")]
    UnknownAsset,
    #[error("asset closed")]
    AssetClosed,
    #[error("serial {0} already issued")]
    SerialAlreadyIssued(u64),
    #[error("expected serial {expected}, got {actual}")]
    WrongSerial { expected: u64, actual: u64 },
    #[error("issuance capacity exceeded")]
    CapacityExceeded,
    #[error("issue proof invalid")]
    InvalidIssueProof,
    #[error("range overlap")]
    RangeOverlap,
    #[error("database: {0}")]
    Db(String),
    #[error("invalid transaction: {0}")]
    InvalidTx(String),
}
