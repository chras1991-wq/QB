"use client";

import { useState } from "react";
import { launchRounds } from "@/lib/data";
import { formatNumber } from "@/lib/format";

export default function LaunchPage() {
  const round = launchRounds[0];
  const [pubkey, setPubkey] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">Fair Launch</h1>
      <p className="mt-2 text-zinc-400">BLOCK_LOTTERY_V1 — winner from block N+1 hash.</p>

      <div className="card mt-8 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{round.symbol} round</h2>
          <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs text-amber-300">{round.status}</span>
        </div>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500">Anchor block</dt>
            <dd className="font-mono">{formatNumber(round.anchorBlock)}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Serial batch</dt>
            <dd className="font-mono">
              #{formatNumber(round.serialStart)} — #{formatNumber(round.serialEnd)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Participants</dt>
            <dd>{formatNumber(round.participants)}</dd>
          </div>
        </dl>
      </div>

      <form
        className="card mt-6 space-y-4 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <h3 className="font-medium">Submit claim</h3>
        <label className="block text-sm">
          <span className="text-zinc-500">Bitcoin pubkey / script</span>
          <input
            value={pubkey}
            onChange={(e) => setPubkey(e.target.value)}
            placeholder="02… or bc1…"
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm outline-none focus:border-amber-500/60"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-black hover:bg-amber-400"
        >
          Commit claim
        </button>
        {submitted && (
          <p className="text-sm text-emerald-400">
            Claim queued for preview UI. Indexer resolves winner after block {formatNumber(round.anchorBlock + 1)}.
          </p>
        )}
      </form>
    </div>
  );
}
