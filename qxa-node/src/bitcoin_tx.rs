use std::str::FromStr;

use bitcoin::absolute::LockTime;
use bitcoin::script::PushBytes;
use bitcoin::{
    Address, Amount, OutPoint, ScriptBuf, Sequence, Transaction, TxIn, TxOut, Txid, Witness,
};
use bitcoincore_rpc::{Auth, Client, RpcApi};
use qxa_crypto::IssuePacket;

pub struct RpcWallet {
    pub client: Client,
}

impl RpcWallet {
    pub fn connect(url: &str, user: &str, pass: &str) -> Result<Self, String> {
        let client = Client::new(url, Auth::UserPass(user.to_string(), pass.to_string()))
            .map_err(|e| e.to_string())?;
        Ok(Self { client })
    }

    pub fn fund_and_send_op_return(&self, payload: &[u8], label: &str) -> Result<(Txid, u32), String> {
        if payload.len() > 4000 {
            return Err("payload too large for regtest datacarrier — raise -datacarriersize".into());
        }
        let push = <&PushBytes>::try_from(payload).map_err(|_| "push bytes")?;
        let op_return = ScriptBuf::new_op_return(push);
        let change_addr = self
            .client
            .get_new_address(Some(label), None)
            .map_err(|e| e.to_string())?
            .assume_checked();
        let unspent = self
            .client
            .list_unspent(Some(0), Some(9999999), Some(&[]), Some(true), None)
            .map_err(|e| e.to_string())?;
        let utxo = unspent.first().ok_or("wallet has no UTXOs — mine blocks on regtest")?;
        let input = TxIn {
            previous_output: OutPoint {
                txid: utxo.txid,
                vout: utxo.vout,
            },
            script_sig: ScriptBuf::new(),
            sequence: Sequence::ENABLE_RBF_NO_LOCKTIME,
            witness: Witness::new(),
        };
        let op_out = TxOut {
            value: Amount::from_sat(0),
            script_pubkey: op_return,
        };
        let change_sats = utxo.amount.to_sat();
        let fee = 5000u64;
        if change_sats <= fee + 546 {
            return Err("utxo too small".into());
        }
        let change_out = TxOut {
            value: Amount::from_sat(change_sats - fee),
            script_pubkey: change_addr.script_pubkey(),
        };
        let tx = Transaction {
            version: bitcoin::transaction::Version::TWO,
            lock_time: LockTime::ZERO,
            input: vec![input],
            output: vec![op_out, change_out],
        };
        let signed = self
            .client
            .sign_raw_transaction_with_wallet(&tx, None, None)
            .map_err(|e| e.to_string())?;
        if signed.complete {
            let txid = self
                .client
                .send_raw_transaction(&signed.hex)
                .map_err(|e| e.to_string())?;
            return Ok((txid, 0));
        }
        Err("wallet failed to sign transaction".into())
    }

    pub fn send_issue_tx(
        &self,
        recipient: &Address,
        packet: &IssuePacket,
        label: &str,
    ) -> Result<Txid, String> {
        let payload = packet.to_bytes().map_err(|e| e.to_string())?;
        let push = <&PushBytes>::try_from(payload.as_slice()).map_err(|_| "push")?;
        let op_return = ScriptBuf::new_op_return(push);
        let asset_out = TxOut {
            value: Amount::from_sat(800),
            script_pubkey: recipient.script_pubkey(),
        };
        let change_addr = self
            .client
            .get_new_address(Some(label), None)
            .map_err(|e| e.to_string())?
            .assume_checked();
        let unspent = self
            .client
            .list_unspent(Some(0), Some(9999999), Some(&[]), Some(true), None)
            .map_err(|e| e.to_string())?;
        let utxo = unspent.first().ok_or("no utxo")?;
        let input = TxIn {
            previous_output: OutPoint {
                txid: utxo.txid,
                vout: utxo.vout,
            },
            script_sig: ScriptBuf::new(),
            sequence: Sequence::ENABLE_RBF_NO_LOCKTIME,
            witness: Witness::new(),
        };
        let op_out = TxOut {
            value: Amount::from_sat(0),
            script_pubkey: op_return,
        };
        let change_sats = utxo.amount.to_sat();
        let fee = 8000u64;
        let change_out = TxOut {
            value: Amount::from_sat(change_sats - fee - 800),
            script_pubkey: change_addr.script_pubkey(),
        };
        let tx = Transaction {
            version: bitcoin::transaction::Version::TWO,
            lock_time: LockTime::ZERO,
            input: vec![input],
            output: vec![asset_out, op_out, change_out],
        };
        let signed = self
            .client
            .sign_raw_transaction_with_wallet(&tx, None, None)
            .map_err(|e| e.to_string())?;
        if !signed.complete {
            return Err("sign failed".into());
        }
        self.client
            .send_raw_transaction(&signed.hex)
            .map_err(|e| e.to_string())
    }

    pub fn get_tx(&self, txid: &Txid) -> Result<Transaction, String> {
        let info = self
            .client
            .get_raw_transaction_info(txid, None)
            .map_err(|e| e.to_string())?;
        Ok(info.transaction().map_err(|e| e.to_string())?)
    }

    pub fn block_height(&self) -> Result<u32, String> {
        self.client
            .get_block_count()
            .map_err(|e| e.to_string())
            .map(|h| h as u32)
    }
}

pub fn address_from_str(s: &str, network: bitcoin::Network) -> Result<Address, String> {
    Address::from_str(s)
        .map_err(|e| e.to_string())?
        .require_network(network)
        .map_err(|e| e.to_string())
}
