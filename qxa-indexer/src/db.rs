use bitcoin::OutPoint;
use qxa_crypto::{AssetId, IssuancePolicy};
use rusqlite::{params, Connection, Row};
use serde::{Deserialize, Serialize};

use crate::error::IndexerError;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct StoredAsset {
    pub asset_id: String,
    pub symbol: String,
    pub genesis_txid: String,
    pub genesis_vout: u32,
    pub xmss_verifying_key: Vec<u8>,
    pub xmss_root: Vec<u8>,
    pub tree_height: u8,
    pub max_serials: u64,
    pub next_index: u64,
    pub issued: u64,
    pub policy: String,
    pub status: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct StoredBirth {
    pub asset_id: String,
    pub serial: u64,
    pub birth_txid: String,
    pub birth_vout: u32,
    pub block_height: u32,
    pub recipient_script_hex: String,
}

pub struct IndexerDb {
    conn: Connection,
}

fn col<T: rusqlite::types::FromSql>(row: &Row, idx: usize) -> Result<T, IndexerError> {
    row.get(idx).map_err(|e| IndexerError::Db(e.to_string()))
}

impl IndexerDb {
    pub fn open(path: &str) -> Result<Self, IndexerError> {
        let conn = Connection::open(path).map_err(|e| IndexerError::Db(e.to_string()))?;
        conn.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS assets (
                asset_id TEXT PRIMARY KEY,
                symbol TEXT NOT NULL,
                genesis_txid TEXT NOT NULL,
                genesis_vout INTEGER NOT NULL,
                xmss_vk BLOB NOT NULL,
                xmss_root BLOB NOT NULL,
                tree_height INTEGER NOT NULL,
                max_serials INTEGER NOT NULL,
                next_index INTEGER NOT NULL,
                issued INTEGER NOT NULL,
                policy TEXT NOT NULL,
                status TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS births (
                asset_id TEXT NOT NULL,
                serial INTEGER NOT NULL,
                birth_txid TEXT NOT NULL,
                birth_vout INTEGER NOT NULL,
                block_height INTEGER NOT NULL,
                recipient_script BLOB NOT NULL,
                PRIMARY KEY (asset_id, serial)
            );
            CREATE TABLE IF NOT EXISTS chain_meta (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
            ",
        )
        .map_err(|e| IndexerError::Db(e.to_string()))?;
        Ok(Self { conn })
    }

    pub fn insert_genesis(
        &self,
        asset_id: AssetId,
        symbol: &str,
        genesis: OutPoint,
        vk: &[u8],
        root: &[u8],
        tree_height: u8,
        max_serials: u64,
        policy: IssuancePolicy,
    ) -> Result<(), IndexerError> {
        let policy_s = match policy {
            IssuancePolicy::SequentialIssuer => "sequential",
            IssuancePolicy::BlockLotteryV1 => "block_lottery_v1",
        };
        self.conn
            .execute(
                "INSERT OR IGNORE INTO assets (
                    asset_id, symbol, genesis_txid, genesis_vout, xmss_vk, xmss_root,
                    tree_height, max_serials, next_index, issued, policy, status
                ) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,0,0,?9,'open')",
                params![
                    asset_id.to_hex(),
                    symbol,
                    genesis.txid.to_string(),
                    genesis.vout,
                    vk,
                    root,
                    tree_height,
                    max_serials,
                    policy_s,
                ],
            )
            .map_err(|e| IndexerError::Db(e.to_string()))?;
        Ok(())
    }

    pub fn get_asset(&self, asset_id: &str) -> Result<Option<StoredAsset>, IndexerError> {
        let mut stmt = self
            .conn
            .prepare(
                "SELECT asset_id, symbol, genesis_txid, genesis_vout, xmss_vk, xmss_root,
                        tree_height, max_serials, next_index, issued, policy, status FROM assets WHERE asset_id = ?1",
            )
            .map_err(|e| IndexerError::Db(e.to_string()))?;
        let mut rows = stmt
            .query(params![asset_id])
            .map_err(|e| IndexerError::Db(e.to_string()))?;
        if let Some(row) = rows.next().map_err(|e| IndexerError::Db(e.to_string()))? {
            return Ok(Some(StoredAsset {
                asset_id: col(row, 0)?,
                symbol: col(row, 1)?,
                genesis_txid: col(row, 2)?,
                genesis_vout: col(row, 3)?,
                xmss_verifying_key: col(row, 4)?,
                xmss_root: col(row, 5)?,
                tree_height: col(row, 6)?,
                max_serials: col(row, 7)?,
                next_index: col(row, 8)?,
                issued: col(row, 9)?,
                policy: col(row, 10)?,
                status: col(row, 11)?,
            }));
        }
        Ok(None)
    }

    pub fn list_assets(&self) -> Result<Vec<StoredAsset>, IndexerError> {
        let mut stmt = self
            .conn
            .prepare(
                "SELECT asset_id, symbol, genesis_txid, genesis_vout, xmss_vk, xmss_root,
                        tree_height, max_serials, next_index, issued, policy, status FROM assets ORDER BY symbol",
            )
            .map_err(|e| IndexerError::Db(e.to_string()))?;
        let mut out = Vec::new();
        let mut rows = stmt.query([]).map_err(|e| IndexerError::Db(e.to_string()))?;
        while let Some(row) = rows.next().map_err(|e| IndexerError::Db(e.to_string()))? {
            out.push(StoredAsset {
                asset_id: col(row, 0)?,
                symbol: col(row, 1)?,
                genesis_txid: col(row, 2)?,
                genesis_vout: col(row, 3)?,
                xmss_verifying_key: col(row, 4)?,
                xmss_root: col(row, 5)?,
                tree_height: col(row, 6)?,
                max_serials: col(row, 7)?,
                next_index: col(row, 8)?,
                issued: col(row, 9)?,
                policy: col(row, 10)?,
                status: col(row, 11)?,
            });
        }
        Ok(out)
    }

    pub fn apply_birth(
        &self,
        asset_id: &str,
        serial: u64,
        birth_txid: &str,
        birth_vout: u32,
        block_height: u32,
        recipient_script: &[u8],
    ) -> Result<(), IndexerError> {
        let tx = self.conn.unchecked_transaction().map_err(|e| IndexerError::Db(e.to_string()))?;
        tx.execute(
            "INSERT OR IGNORE INTO births (asset_id, serial, birth_txid, birth_vout, block_height, recipient_script)
             VALUES (?1,?2,?3,?4,?5,?6)",
            params![asset_id, serial, birth_txid, birth_vout, block_height, recipient_script],
        )
        .map_err(|e| IndexerError::Db(e.to_string()))?;
        let updated = tx
            .execute(
                "UPDATE assets SET issued = issued + 1, next_index = ?2 + 1 WHERE asset_id = ?1 AND next_index = ?2",
                params![asset_id, serial],
            )
            .map_err(|e| IndexerError::Db(e.to_string()))?;
        if updated == 0 {
            return Err(IndexerError::WrongSerial {
                expected: serial,
                actual: serial,
            });
        }
        tx.commit().map_err(|e| IndexerError::Db(e.to_string()))?;
        Ok(())
    }

    pub fn list_births(&self, asset_id: Option<&str>) -> Result<Vec<StoredBirth>, IndexerError> {
        let (sql, id) = match asset_id {
            Some(a) => (
                "SELECT asset_id, serial, birth_txid, birth_vout, block_height, recipient_script FROM births WHERE asset_id = ?1 ORDER BY serial DESC",
                Some(a),
            ),
            None => (
                "SELECT asset_id, serial, birth_txid, birth_vout, block_height, recipient_script FROM births ORDER BY block_height DESC, serial DESC LIMIT 200",
                None,
            ),
        };
        let mut stmt = self.conn.prepare(sql).map_err(|e| IndexerError::Db(e.to_string()))?;
        let mut rows = match id {
            Some(a) => stmt.query(params![a]).map_err(|e| IndexerError::Db(e.to_string()))?,
            None => stmt.query([]).map_err(|e| IndexerError::Db(e.to_string()))?,
        };
        let mut out = Vec::new();
        while let Some(row) = rows.next().map_err(|e| IndexerError::Db(e.to_string()))? {
            let script: Vec<u8> = col(row, 5)?;
            out.push(StoredBirth {
                asset_id: col(row, 0)?,
                serial: col(row, 1)?,
                birth_txid: col(row, 2)?,
                birth_vout: col(row, 3)?,
                block_height: col(row, 4)?,
                recipient_script_hex: hex::encode(script),
            });
        }
        Ok(out)
    }

    pub fn set_meta(&self, key: &str, value: &str) -> Result<(), IndexerError> {
        self.conn
            .execute(
                "INSERT INTO chain_meta (key, value) VALUES (?1,?2) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
                params![key, value],
            )
            .map_err(|e| IndexerError::Db(e.to_string()))?;
        Ok(())
    }

    pub fn get_meta(&self, key: &str) -> Result<Option<String>, IndexerError> {
        let mut stmt = self
            .conn
            .prepare("SELECT value FROM chain_meta WHERE key = ?1")
            .map_err(|e| IndexerError::Db(e.to_string()))?;
        let mut rows = stmt.query(params![key]).map_err(|e| IndexerError::Db(e.to_string()))?;
        if let Some(row) = rows.next().map_err(|e| IndexerError::Db(e.to_string()))? {
            return Ok(Some(col(row, 0)?));
        }
        Ok(None)
    }
}
