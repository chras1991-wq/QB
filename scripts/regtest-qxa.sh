#!/usr/bin/env bash
# Real QXA issuance on Bitcoin regtest (requires local bitcoind).
set -euo pipefail

RPC_URL="${BITCOIN_RPC_URL:-http://127.0.0.1:18443}"
RPC_USER="${BITCOIN_RPC_USER:-qxa}"
RPC_PASS="${BITCOIN_RPC_PASS:-qxa}"
export QXA_DATA="${QXA_DATA:-$(pwd)/.qxa}"
export PATH="/usr/local/cargo/bin:$PATH"

SYMBOL="${1:-QX}"

echo "==> keygen $SYMBOL"
cargo run -p qxa-node -- keygen "$SYMBOL"

echo "==> genesis on chain"
cargo run -p qxa-node -- genesis "$SYMBOL" --rpc "$RPC_URL" --rpc-user "$RPC_USER" --rpc-pass "$RPC_PASS"

ADDR=$(bitcoin-cli -rpcconnect=127.0.0.1 -rpcport=18443 -rpcuser="$RPC_USER" -rpcpassword="$RPC_PASS" getnewaddress)
echo "==> issue serial #0 -> $ADDR"
cargo run -p qxa-node -- issue "$SYMBOL" --to "$ADDR" --rpc "$RPC_URL" --rpc-user "$RPC_USER" --rpc-pass "$RPC_PASS"

echo "==> indexer state"
cargo run -p qxa-node -- serve --listen 127.0.0.1:0 &
sleep 1
curl -s "http://127.0.0.1:8787/v1/assets" || true
