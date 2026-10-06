"use client";

import { useState } from "react";
import { launchRounds } from "@/lib/data";
import { formatNumber } from "@/lib/format";

export default function LaunchPage() {
  const round = launchRounds[0];
  const [pubkey, setPubkey] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">Block lottery</h1>
      <p className="mt-2 text-zinc-400">
        Issuer cannot pick winners. After block {formatNumber(round.revealBlock)}, score = H(blockhash || claim). Lowest scores take the next serial batch.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <p className="text-xs uppercase text-zinc-500">Randomness source</p>
          <p className="mt-2 font-mono text-lg">{round.blockHashPreview}</p>
          <p className="mt-2 text-sm text-zinc-500">
            Block {formatNumber(round.revealBlock)} (not yet mined) · {formatNumber(round.batchSize)} serials per round
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Serials at stake</dt>
              <dd className="font-mono">
                #{formatNumber(round.serialStart)} – #{formatNumber(round.serialEnd)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Claims in anchor {formatNumber(round.anchorBlock)}</dt>
              <dd>{formatNumber(round.participants)}</dd>
            </div>
          </dl>
        </div>

        <form
          className="card space-y-4 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <h2 className="font-medium">Submit claim</h2>
          <input
            value={pubkey}
            onChange={(e) => setPubkey(e.target.value)}
            placeholder="Claimant outpoint / pubkey"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm outline-none focus:border-amber-500/60"
            required
          />
          <button type="submit" className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-black">
            Commit before anchor closes
          </button>
          {submitted && (
            <p className="text-xs text-emerald-400">
              Claim recorded. If your score ranks in top {formatNumber(round.batchSize)}, issuer must XMSS-sign ISSUE for your script — or indexer rejects.
            </p>
          )}
        </form>
      </div>

      <div className="card mt-6 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900/80 text-zinc-500">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Claimant</th>
              <th className="px-4 py-3">Serial</th>
            </tr>
          </thead>
          <tbody>
            {round.leaderboard.map((row) => (
              <tr key={row.rank} className="border-t border-zinc-800">
                <td className="px-4 py-3 font-mono">{row.rank}</td>
                <td className="px-4 py-3 font-mono text-amber-300/90">{row.score}</td>
                <td className="px-4 py-3 font-mono text-xs">{row.claimant}</td>
                <td className="px-4 py-3 font-mono">#{formatNumber(row.serial)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
