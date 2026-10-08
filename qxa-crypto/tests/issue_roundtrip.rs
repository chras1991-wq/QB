use bitcoin::OutPoint;
use bitcoin::Txid;
use bitcoin_hashes::Hash;
use qxa_crypto::{
    build_issue_message, compute_asset_id, sign_issue, verify_issue, xmss_public_root, IssueProof,
};
use xmss::{KeyPair, XmssSha2_10_256};

#[test]
fn genesis_asset_id_and_sequential_issue() {
    let mut rng = rand::rng();
    let mut kp = KeyPair::<XmssSha2_10_256>::generate(&mut rng).unwrap();
    let vk = kp.verifying_key().as_ref().to_vec();

    let genesis = OutPoint {
        txid: Txid::all_zeros(),
        vout: 0,
    };
    let root = xmss_public_root(&vk).unwrap();
    let asset_id = compute_asset_id(genesis, &root);

    let recipient = vec![0x51, 0x20]; // minimal script prefix for tests
    let nonce = 0u64;

    for serial in 0u64..3 {
        let mut proof = IssueProof {
            asset_id,
            serial,
            recipient_script_pubkey: recipient.clone(),
            genesis_outpoint: genesis,
            nonce,
            detached_signature: vec![],
        };
        let sig = sign_issue(kp.signing_key(), &proof).unwrap();
        proof.detached_signature = sig;
        verify_issue(&vk, &proof).unwrap();

        let msg = build_issue_message(&asset_id, serial, &recipient, genesis, nonce);
        assert_eq!(msg.len(), 32);
    }
}
