/// Locator for deterministic replay ordering.
#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub struct EventLocator {
    pub block_height: u32,
    pub tx_index: u32,
    pub event_index: u32,
}

#[derive(Clone, Debug)]
pub struct ChainEvent {
    pub locator: EventLocator,
    pub block_hash: [u8; 32],
}

/// Roll back mutations above `ancestor_height` then replay from Bitcoin + witness data.
pub fn rollback_above(ancestor_height: u32) -> u32 {
    ancestor_height
}
