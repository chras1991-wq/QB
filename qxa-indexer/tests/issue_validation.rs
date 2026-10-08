use bitcoin::OutPoint;
use bitcoin::Txid;
use qxa_crypto::{
    compute_asset_id, sign_issue, xmss_public_root, IssueProof, IssuancePolicy,
    ParameterSetId,
};
use bitcoin_hashes::Hash;
use qxa_indexer::{apply_issue, AssetRecord, ChainEvent, EventLocator, IssueContext};
use xmss::{KeyPair, XmssSha2_10_256};

#[test]
fn sequential_issue_updates_asset() {
    let mut rng = rand::rng();
    let mut kp = KeyPair::<XmssSha2_10_256>::generate(&mut rng).unwrap();
    let vk = kp.verifying_key().as_ref().to_vec();
    let genesis = OutPoint {
        txid: Txid::all_zeros(),
        vout: 0,
    };
    let root = xmss_public_root(&vk).unwrap();
    let asset_id = compute_asset_id(genesis, &root);

    let mut asset = AssetRecord::new_genesis(
        asset_id,
        ParameterSetId::XmssSha2_10_256,
        1024,
        IssuancePolicy::SequentialIssuer,
        vk,
    );

    let recipient = vec![0x51, 0x20];
    let proof = {
        let mut p = IssueProof {
            asset_id,
            serial: 0,
            recipient_script_pubkey: recipient.clone(),
            genesis_outpoint: genesis,
            nonce: 0,
            detached_signature: vec![],
        };
        p.detached_signature = sign_issue(kp.signing_key(), &p).unwrap();
        p
    };

    apply_issue(
        &mut asset,
        &proof,
        &IssueContext {
            birth_outpoint: genesis,
            recipient_matches: true,
        },
        ChainEvent {
            locator: EventLocator {
                block_height: 1,
                tx_index: 0,
                event_index: 0,
            },
            block_hash: [0u8; 32],
        },
    )
    .unwrap();

    assert_eq!(asset.issued, 1);
    assert_eq!(asset.next_index, 1);
}
