"use client";

import { useState } from "react";

export default function CreatePage() {
  const [symbol, setSymbol] = useState("QX");
  const [height, setHeight] = useState(12);
  const [policy, setPolicy] = useState("block_lottery_v1");

  const capacity = 2 ** height;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">Create Genesis</h1>
      <p className="mt-2 text-zinc-400">Define an issuance domain bound to one XMSS root.</p>

      <form
        className="card mt-8 space-y-5 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Genesis flow connects to signer + Bitcoin in Signet phase.");
        }}
      >
        <label className="block text-sm">
          <span className="text-zinc-500">Symbol</span>
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            maxLength={12}
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-amber-500/60"
          />
        </label>

        <label className="block text-sm">
          <span className="text-zinc-500">Tree height (h)</span>
          <input
            type="number"
            min={10}
            max={20}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-amber-500/60"
          />
          <p className="mt-1 text-xs text-zinc-500">Cryptographic capacity: {capacity.toLocaleString()} issuances</p>
        </label>

        <label className="block text-sm">
          <span className="text-zinc-500">Issuance policy</span>
          <select
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-amber-500/60"
          >
            <option value="sequential">Sequential issuer</option>
            <option value="block_lottery_v1">Bitcoin block lottery</option>
          </select>
        </label>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 text-sm text-zinc-400">
          <p>PQ scheme: XMSS (RFC 8391)</p>
          <p className="mt-1">A new root always yields a new AssetID — no cross-asset inflation.</p>
        </div>

        <button type="submit" className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-black hover:bg-amber-400">
          Create Genesis
        </button>
      </form>
    </div>
  );
}
