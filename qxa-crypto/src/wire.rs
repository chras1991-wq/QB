use crate::error::CryptoError;
use crate::params::ParameterSetId;
use crate::protocol::{GenesisPayload, IssuancePolicy, Operation, MAGIC, VERSION};

/// On-chain ISSUE packet (OP_RETURN / witness profile `WITNESS_FULL` for regtest).
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct IssuePacket {
    pub asset_id: [u8; 32],
    pub serial: u64,
    pub nonce: u64,
    pub recipient_script_pubkey: Vec<u8>,
    pub detached_signature: Vec<u8>,
}

impl IssuePacket {
    pub fn to_bytes(&self) -> Result<Vec<u8>, CryptoError> {
        if self.recipient_script_pubkey.len() > 520 || self.detached_signature.len() > 8192 {
            return Err(CryptoError::Serialization("issue packet too large".into()));
        }
        let mut out = Vec::new();
        out.extend_from_slice(MAGIC);
        out.push(VERSION);
        out.push(Operation::Issue as u8);
        out.extend_from_slice(&self.asset_id);
        out.extend_from_slice(&self.serial.to_be_bytes());
        out.extend_from_slice(&self.nonce.to_be_bytes());
        out.extend_from_slice(&(self.recipient_script_pubkey.len() as u16).to_be_bytes());
        out.extend_from_slice(&self.recipient_script_pubkey);
        out.extend_from_slice(&(self.detached_signature.len() as u16).to_be_bytes());
        out.extend_from_slice(&self.detached_signature);
        Ok(out)
    }

    pub fn from_bytes(data: &[u8]) -> Result<Self, CryptoError> {
        let mut i = 0;
        let mut take = |n: usize| -> Result<&[u8], CryptoError> {
            if data.len() < i + n {
                return Err(CryptoError::Serialization("truncated".into()));
            }
            let s = &data[i..i + n];
            i += n;
            Ok(s)
        };
        if take(3)? != MAGIC {
            return Err(CryptoError::Serialization("bad magic".into()));
        }
        if take(1)?[0] != VERSION {
            return Err(CryptoError::Serialization("bad version".into()));
        }
        if take(1)?[0] != Operation::Issue as u8 {
            return Err(CryptoError::Serialization("not issue".into()));
        }
        let asset_id: [u8; 32] = take(32)?.try_into().unwrap();
        let serial = u64::from_be_bytes(take(8)?.try_into().unwrap());
        let nonce = u64::from_be_bytes(take(8)?.try_into().unwrap());
        let rlen = u16::from_be_bytes(take(2)?.try_into().unwrap()) as usize;
        let recipient_script_pubkey = take(rlen)?.to_vec();
        let slen = u16::from_be_bytes(take(2)?.try_into().unwrap()) as usize;
        let detached_signature = take(slen)?.to_vec();
        Ok(Self {
            asset_id,
            serial,
            nonce,
            recipient_script_pubkey,
            detached_signature,
        })
    }
}

pub fn parse_genesis_payload(data: &[u8]) -> Result<GenesisPayload, CryptoError> {
    let mut i = 0;
    let mut take = |n: usize| -> Result<&[u8], CryptoError> {
        if data.len() < i + n {
            return Err(CryptoError::Serialization("truncated".into()));
        }
        let s = &data[i..i + n];
        i += n;
        Ok(s)
    };
    if take(3)? != MAGIC || take(1)?[0] != VERSION || take(1)?[0] != Operation::Genesis as u8 {
        return Err(CryptoError::Serialization("not genesis".into()));
    }
    let ps = u16::from_be_bytes(take(2)?.try_into().unwrap());
    let parameter_set = ParameterSetId::from_u16(ps).ok_or(CryptoError::InvalidParameterSet)?;
    let tree_height = take(1)?[0];
    let root_len = take(1)?[0] as usize;
    let xmss_public_root = take(root_len)?.to_vec();
    let sym_bytes = take(12)?;
    let symbol = sym_bytes
        .split(|&b| b == 0)
        .next()
        .map(|s| String::from_utf8_lossy(s).to_string())
        .unwrap_or_default();
    let metadata_hash: [u8; 32] = take(32)?.try_into().unwrap();
    let policy_byte = take(1)?[0];
    let issuance_policy = IssuancePolicy::from_u8(policy_byte).ok_or(CryptoError::Serialization("policy".into()))?;
    Ok(GenesisPayload {
        parameter_set,
        tree_height,
        xmss_public_root,
        symbol,
        metadata_hash,
        issuance_policy,
    })
}

pub fn try_parse_qxa_op_return(data: &[u8]) -> Result<QxaOpReturn, CryptoError> {
    if data.len() < 5 {
        return Err(CryptoError::Serialization("short".into()));
    }
    match data[4] {
        x if x == Operation::Genesis as u8 => {
            Ok(QxaOpReturn::Genesis(parse_genesis_payload(data)?))
        }
        x if x == Operation::Issue as u8 => Ok(QxaOpReturn::Issue(IssuePacket::from_bytes(data)?)),
        _ => Err(CryptoError::Serialization("unknown op".into())),
    }
}

#[derive(Clone, Debug)]
pub enum QxaOpReturn {
    Genesis(GenesisPayload),
    Issue(IssuePacket),
}
