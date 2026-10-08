use qxa_crypto::{AssetId, IssuancePolicy, ParameterSetId};

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum AssetStatus {
    Open,
    Closed,
}

#[derive(Clone, Debug)]
pub struct AssetRecord {
    pub asset_id: AssetId,
    pub parameter_set: ParameterSetId,
    pub max_serials: u64,
    pub next_index: u64,
    pub issued: u64,
    pub policy: IssuancePolicy,
    pub status: AssetStatus,
    pub xmss_verifying_key: Vec<u8>,
}

impl AssetRecord {
    pub fn new_genesis(
        asset_id: AssetId,
        parameter_set: ParameterSetId,
        max_serials: u64,
        policy: IssuancePolicy,
        xmss_verifying_key: Vec<u8>,
    ) -> Self {
        Self {
            asset_id,
            parameter_set,
            max_serials,
            next_index: 0,
            issued: 0,
            policy,
            status: AssetStatus::Open,
            xmss_verifying_key,
        }
    }
}
