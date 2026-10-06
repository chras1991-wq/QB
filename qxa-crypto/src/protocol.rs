use bitcoin::OutPoint;

use crate::error::CryptoError;
use crate::params::ParameterSetId;

pub const MAGIC: &[u8; 3] = b"QXA";
pub const VERSION: u8 = 1;

#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Operation {
    Genesis = 0x01,
    Issue = 0x02,
    Transfer = 0x03,
    Close = 0x04,
}

impl Operation {
    pub fn from_u8(v: u8) -> Option<Self> {
        match v {
            0x01 => Some(Self::Genesis),
            0x02 => Some(Self::Issue),
            0x03 => Some(Self::Transfer),
            0x04 => Some(Self::Close),
            _ => None,
        }
    }
}

#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum IssuancePolicy {
    SequentialIssuer = 0x00,
    BlockLotteryV1 = 0x01,
}

impl IssuancePolicy {
    pub fn from_u8(v: u8) -> Option<Self> {
        match v {
            0x00 => Some(Self::SequentialIssuer),
            0x01 => Some(Self::BlockLotteryV1),
            _ => None,
        }
    }
}

#[derive(Clone, Debug)]
pub struct GenesisPayload {
    pub parameter_set: ParameterSetId,
    pub tree_height: u8,
    pub xmss_public_root: Vec<u8>,
    pub symbol: String,
    pub metadata_hash: [u8; 32],
    pub issuance_policy: IssuancePolicy,
}

impl GenesisPayload {
    pub fn to_bytes(&self) -> Result<Vec<u8>, CryptoError> {
        if self.symbol.is_empty() || self.symbol.len() > 12 {
            return Err(CryptoError::Serialization("symbol length".into()));
        }
        let mut out = Vec::new();
        out.extend_from_slice(MAGIC);
        out.push(VERSION);
        out.push(Operation::Genesis as u8);
        out.extend_from_slice(&(self.parameter_set as u16).to_be_bytes());
        out.push(self.tree_height);
        out.push(self.xmss_public_root.len() as u8);
        out.extend_from_slice(&self.xmss_public_root);
        let mut sym = [0u8; 12];
        sym[..self.symbol.len()].copy_from_slice(self.symbol.as_bytes());
        out.extend_from_slice(&sym);
        out.extend_from_slice(&self.metadata_hash);
        out.push(self.issuance_policy as u8);
        Ok(out)
    }
}

#[derive(Clone, Debug)]
pub struct TransferPayload {
    pub asset_id: [u8; 32],
    pub range_start: u64,
    pub range_end: u64,
    pub destination_vout: u32,
}

impl TransferPayload {
    pub fn to_bytes(&self) -> Vec<u8> {
        let mut out = Vec::new();
        out.extend_from_slice(MAGIC);
        out.push(VERSION);
        out.push(Operation::Transfer as u8);
        out.extend_from_slice(&self.asset_id);
        out.extend_from_slice(&self.range_start.to_be_bytes());
        out.extend_from_slice(&self.range_end.to_be_bytes());
        out.extend_from_slice(&self.destination_vout.to_be_bytes());
        out
    }
}

#[derive(Clone, Debug)]
pub struct ProtocolCommitment {
    pub genesis_outpoint: OutPoint,
    pub payload_hash: [u8; 32],
}
