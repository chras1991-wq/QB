use qxa_crypto::{IssuePacket, try_parse_qxa_op_return};

#[test]
fn issue_packet_roundtrip() {
    let p = IssuePacket {
        asset_id: [7u8; 32],
        serial: 3,
        nonce: 0,
        recipient_script_pubkey: vec![0x51, 0x20],
        detached_signature: vec![1, 2, 3, 4],
    };
    let bytes = p.to_bytes().unwrap();
    let parsed = try_parse_qxa_op_return(&bytes).unwrap();
    assert!(matches!(parsed, qxa_crypto::QxaOpReturn::Issue(_)));
}
