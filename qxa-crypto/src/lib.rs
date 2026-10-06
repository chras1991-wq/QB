//! QXA V1 cryptography: AssetID, tagged hashes, XMSS issuance messages.
//!
//! XMSS is RFC 8391-compatible via the `xmss` crate. This library does **not**
//! claim NIST SP 800-208 compliance.

mod asset_id;
mod error;
mod hash;
mod issue;
mod params;
mod protocol;
mod xmss_root;

pub use asset_id::{compute_asset_id, AssetId};
pub use error::CryptoError;
pub use hash::tagged_hash;
pub use issue::{build_issue_message, sign_issue, verify_issue, IssueProof};
pub use params::{ParameterSetId, QxaParameterSet, DEFAULT_PARAMETER_SET};
pub use protocol::{
    GenesisPayload, IssuancePolicy, Operation, ProtocolCommitment, TransferPayload,
};
pub use xmss_root::xmss_public_root;
