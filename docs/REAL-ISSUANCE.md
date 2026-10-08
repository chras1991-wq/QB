# Real QXA issuance (regtest / signet)

## What is implemented

- **On-chain**: `OP_RETURN` carries `GENESIS` and `ISSUE` packets (`qxa-crypto::wire`).
- **Indexer**: SQLite (`IndexerDb`) validates XMSS ISSUE and records births.
- **`qxa-node` CLI**: `keygen`, `genesis`, `issue`, `serve` (HTTP read API).

This is **not mainnet**. Use **regtest** or **signet** with a funded wallet.

## Bitcoin Core (regtest)

```ini
# bitcoin.conf
regtest=1
server=1
rpcuser=qxa
rpcpassword=qxa
txindex=1
datacarriersize=10000
```

```bash
bitcoind -regtest
bitcoin-cli -regtest createwallet qxa
ADDR=$(bitcoin-cli -regtest getnewaddress)
bitcoin-cli -regtest generatetoaddress 101 "$ADDR"
```

## Issue an asset

```bash
export QXA_DATA=./.qxa
export BITCOIN_RPC_USER=qxa
export BITCOIN_RPC_PASS=qxa

cargo build -p qxa-node --release

# 1) XMSS keys
./target/release/qxa-node keygen MYCOIN

# 2) GENESIS (broadcast + indexer register)
./target/release/qxa-node genesis MYCOIN \
  --rpc http://127.0.0.1:18443

# 3) ISSUE serial #0, #1, …
./target/release/qxa-node issue MYCOIN --to bcrt1...
```

## HTTP API (read + keygen)

```bash
./target/release/qxa-node serve --listen 0.0.0.0:8787
curl http://localhost:8787/v1/assets
curl http://localhost:8787/v1/births
curl -X POST http://localhost:8787/v1/keygen -d '{"symbol":"QX"}' -H 'content-type: application/json'
```

Point the web app at the API:

```env
NEXT_PUBLIC_QXA_API_URL=http://localhost:8787
```

## Limits (V1 regtest profile)

- XMSS `XmssSha2_10_256` → **1024** serials per genesis root.
- Full detached signature in `OP_RETURN` → requires `datacarriersize` ≥ ~3KB.
- Issuance is **strictly sequential** (`0,1,2,…`).
- **TRANSFER** indexing is not wired in this milestone.
