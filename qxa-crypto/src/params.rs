use xmss::{XmssParameter, XmssSha2_10_256};

/// Registry of approved XMSS parameter sets for QXA V1.
#[repr(u16)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ParameterSetId {
    XmssSha2_10_256 = 1,
}

impl ParameterSetId {
    pub fn from_u16(v: u16) -> Option<Self> {
        match v {
            1 => Some(Self::XmssSha2_10_256),
            _ => None,
        }
    }
}

pub struct QxaParameterSet {
    pub id: ParameterSetId,
    pub tree_height: u8,
    pub max_serials: u64,
    pub name: &'static str,
}

pub const DEFAULT_PARAMETER_SET: QxaParameterSet = QxaParameterSet {
    id: ParameterSetId::XmssSha2_10_256,
    tree_height: 10,
    max_serials: 1 << 10,
    name: XmssSha2_10_256::NAME,
};

#[allow(dead_code)]
pub fn parameter_set(id: ParameterSetId) -> QxaParameterSet {
    match id {
        ParameterSetId::XmssSha2_10_256 => DEFAULT_PARAMETER_SET,
    }
}
