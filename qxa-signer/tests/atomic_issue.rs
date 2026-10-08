use std::fs;

use bitcoin::OutPoint;
use bitcoin::Txid;
use bitcoin_hashes::Hash;
use qxa_crypto::{compute_asset_id, xmss_public_root};
use qxa_signer::{IssueRequest, XmssSigner};
use xmss::{KeyPair, XmssSha2_10_256};

#[test]
fn reserved_index_not_reused_after_failed_sign_simulation() {
    let dir = tempfile_dir();
    let db_path = dir.join("signer.db");
    let mut rng = rand::rng();
    let kp = KeyPair::<XmssSha2_10_256>::generate(&mut rng).unwrap();
    let vk = kp.verifying_key().as_ref().to_vec();
    let genesis = OutPoint {
        txid: Txid::all_zeros(),
        vout: 0,
    };
    let asset_id = compute_asset_id(genesis, &xmss_public_root(&vk).unwrap());

    let mut signer = XmssSigner::open(&db_path, kp).unwrap();
    let sig = signer
        .issue(IssueRequest {
            asset_id,
            serial: 0,
            recipient_script_pubkey: vec![0x51],
            genesis_outpoint: genesis,
            nonce: 0,
        })
        .unwrap();
    assert!(!sig.is_empty());
    assert_eq!(signer.next_index().unwrap(), 1);
    let _ = fs::remove_dir_all(dir);
}

fn tempfile_dir() -> std::path::PathBuf {
    let p = std::env::temp_dir().join(format!("qxa-signer-{}", std::process::id()));
    let _ = fs::remove_dir_all(&p);
    fs::create_dir_all(&p).unwrap();
    p
}
