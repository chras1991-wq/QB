# QXA Protocol Specification (V1)

Normative protocol documents for **QXA** (Post-Quantum Serialized Asset issuance on Bitcoin).

| Document | Status |
|----------|--------|
| [V1.md](./V1.md) | Draft — protocol phase |
| [test-vectors/issue_message.json](./test-vectors/issue_message.json) | Example vectors |

**Security claims**

- Protocol cryptography: RFC 8391 XMSS (WOTS+)
- Production security profile: TBD / audited
- NIST SP 800-208 compliance: **not claimed** for reference implementations in this repository

**Roles**

| Layer | Responsibility |
|-------|----------------|
| Bitcoin | Ordering, timestamp, ownership (UTXO), data availability |
| XMSS | Issuance authorization (one signature state → one unit) |
| Indexer | PQ protocol state machine |

Implementations MUST be independently verifiable: two indexers following this spec on the same chain MUST converge to identical asset state.
