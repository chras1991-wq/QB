# QXA — Post-Quantum Serialized Assets on Bitcoin

A Bitcoin-native asset issuance protocol where **every unit is created by the irreversible consumption of a real XMSS signing state**, then **ownership is carried by Bitcoin UTXOs** (with indexer-tracked serial provenance).

**Not** “Bitcoin is quantum-safe.” **Not** a balance-mint protocol like BRC-20.

| Layer | Role |
|-------|------|
| Bitcoin | Ordering, timestamp, ownership, data availability |
| XMSS (RFC 8391) | Issuance authorization |
| Indexer | PQ protocol state machine |

中文定位：**以真实后量子一次性签名状态作为发行资源、以 Bitcoin 作为所有权与结算层的新资产协议。**

## Monorepo layout

| Path | Purpose |
|------|---------|
| [qxa-spec](./qxa-spec/) | Normative V1 specification |
| [qxa-crypto](./qxa-crypto/) | AssetID, tagged hashes, XMSS issue/verify |
| [qxa-signer](./qxa-signer/) | Atomic XMSS signing state (SQLite) |
| [qxa-indexer](./qxa-indexer/) | Pure protocol transitions (+ Bitcoin RPC later) |
| [qxa-wallet-sdk](./qxa-wallet-sdk/) | Wallet-facing types |
| [qxa-web](./qxa-web/) | Explorer / UI (Signet phase) |

## Security posture

- Protocol cryptography: **RFC 8391 XMSS** via the [`xmss`](https://crates.io/crates/xmss) crate
- **NIST SP 800-208 compliance is not claimed** for this repository
- Production profile: TBD / audited

## Build & test

Requires **Rust 1.85+** (see `rust-toolchain.toml`).

```bash
cargo test --workspace
```

## Development phases

1. **Protocol** — GENESIS / ISSUE / TRANSFER / CLOSE, reorg semantics, test vectors *(in progress)*
2. **Crypto** — atomic signer, crash/reuse tests
3. **Regtest** — Bitcoin Core integration tests
4. **Signet** — public explorer + second indexer interop
5. **Mainnet** — Genesis launch

## Core invariant

One valid ISSUE ⇒ one XMSS index **permanently burned** + one serial **permanently born**, verifiable by anyone with the chain and witness data.
