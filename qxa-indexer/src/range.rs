use bitcoin::OutPoint;
use qxa_crypto::AssetId;

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct SerialRange {
    pub asset_id: AssetId,
    pub start: u64,
    pub end: u64,
    pub outpoint: OutPoint,
}

impl SerialRange {
    pub fn len(&self) -> u64 {
        self.end - self.start + 1
    }

    pub fn split(&self, take: u64) -> (SerialRange, Option<SerialRange>) {
        assert!(take <= self.len());
        if take == 0 {
            return (self.clone(), None);
        }
        let left = SerialRange {
            asset_id: self.asset_id,
            start: self.start,
            end: self.start + take - 1,
            outpoint: self.outpoint,
        };
        if take == self.len() {
            return (left, None);
        }
        let right = SerialRange {
            asset_id: self.asset_id,
            start: self.start + take,
            end: self.end,
            outpoint: self.outpoint,
        };
        (left, Some(right))
    }
}

#[derive(Clone, Debug)]
pub struct RangeTransfer {
    pub from: SerialRange,
    pub to_outpoint: OutPoint,
    pub amount: u64,
}
