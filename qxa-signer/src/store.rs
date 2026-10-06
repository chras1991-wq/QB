use std::path::Path;

use bitcoin::OutPoint;
use qxa_crypto::{sign_issue, AssetId, IssueProof};
use rusqlite::{params, Connection};
use xmss::{KeyPair, SigningKey, XmssSha2_10_256};

use crate::error::SignerError;

#[derive(Clone, Debug)]
pub struct IssueRequest {
    pub asset_id: AssetId,
    pub serial: u64,
    pub recipient_script_pubkey: Vec<u8>,
    pub genesis_outpoint: OutPoint,
    pub nonce: u64,
}

/// SQLite-backed signer enforcing monotonic XMSS index usage.
pub struct XmssSigner {
    db: Connection,
    signing_key: SigningKey<XmssSha2_10_256>,
}

impl XmssSigner {
    pub fn open(
        path: impl AsRef<Path>,
        mut keypair: KeyPair<XmssSha2_10_256>,
    ) -> Result<Self, SignerError> {
        let signing_key = keypair.signing_key().clone();
        let db = Connection::open(path).map_err(|e| SignerError::Db(e.to_string()))?;
        db.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS signer_meta (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS index_events (
                serial INTEGER PRIMARY KEY,
                status TEXT NOT NULL,
                updated_at_ms INTEGER NOT NULL
            );
            ",
        )
        .map_err(|e| SignerError::Db(e.to_string()))?;
        Ok(Self { db, signing_key })
    }

    pub fn next_index(&self) -> Result<u64, SignerError> {
        let mut stmt = self
            .db
            .prepare("SELECT COALESCE(MAX(serial), -1) + 1 FROM index_events")
            .map_err(|e| SignerError::Db(e.to_string()))?;
        let next: i64 = stmt
            .query_row([], |row| row.get(0))
            .map_err(|e| SignerError::Db(e.to_string()))?;
        Ok(next as u64)
    }

    /// Reserve `serial`, persist, sign, mark signed. Reserved indices are never reused on failure.
    pub fn issue(&mut self, req: IssueRequest) -> Result<Vec<u8>, SignerError> {
        let expected = self.next_index()?;
        if req.serial != expected {
            return Err(SignerError::IndexMismatch {
                expected,
                actual: req.serial,
            });
        }

        let tx = self
            .db
            .unchecked_transaction()
            .map_err(|e| SignerError::Db(e.to_string()))?;
        tx.execute(
            "INSERT INTO index_events (serial, status, updated_at_ms) VALUES (?1, 'reserved', ?2)",
            params![req.serial, now_ms()],
        )
        .map_err(|e| SignerError::Db(e.to_string()))?;
        tx.commit().map_err(|e| SignerError::Db(e.to_string()))?;

        let proof = IssueProof {
            asset_id: req.asset_id,
            serial: req.serial,
            recipient_script_pubkey: req.recipient_script_pubkey,
            genesis_outpoint: req.genesis_outpoint,
            nonce: req.nonce,
            detached_signature: vec![],
        };

        let sig = match sign_issue(&mut self.signing_key, &proof) {
            Ok(s) => s,
            Err(e) => {
                // reserved index stays burned
                return Err(SignerError::Crypto(e.to_string()));
            }
        };

        self.db
            .execute(
                "UPDATE index_events SET status = 'signed', updated_at_ms = ?2 WHERE serial = ?1",
                params![req.serial, now_ms()],
            )
            .map_err(|e| SignerError::Db(e.to_string()))?;

        Ok(sig)
    }
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct SignerState {
    pub next_index: u64,
    pub reserved_or_signed_count: u64,
}

fn now_ms() -> i64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as i64)
        .unwrap_or(0)
}
