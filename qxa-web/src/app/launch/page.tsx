"use client";

import { useState } from "react";
import { SketchFrame } from "@/components/sketch-frame";
import { launchRounds } from "@/lib/data";
import { formatNumber } from "@/lib/format";

export default function LaunchPage() {
  const round = launchRounds[0];
  const [pubkey, setPubkey] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="page max-w-4xl py-12">
      <h1 className="font-display text-4xl">Block lottery</h1>
      <p className="mt-3 font-hand text-xl text-[var(--ink-muted)]">
        Randomness from block {formatNumber(round.revealBlock)}. Issuer cannot pick winners; invalid ISSUE is rejected.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <SketchFrame label="randomness source">
          <p className="font-data text-sm">{round.blockHashPreview}</p>
          <p className="mt-3 font-hand text-lg text-[var(--ink-muted)]">
            {formatNumber(round.batchSize)} serials · #{formatNumber(round.serialStart)}–{formatNumber(round.serialEnd)}
          </p>
          <dl className="mt-4 font-hand text-lg">
            <div className="flex justify-between border-b border-dashed border-[var(--rule)] py-2">
              <dt className="text-[var(--ink-muted)]">claims</dt>
              <dd className="font-data text-base">{formatNumber(round.participants)}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-[var(--ink-muted)]">anchor</dt>
              <dd className="font-data text-base">{formatNumber(round.anchorBlock)}</dd>
            </div>
          </dl>
        </SketchFrame>

        <SketchFrame label="claim slip">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <label className="font-hand text-lg text-[var(--ink-muted)]">claimant</label>
            <input
              value={pubkey}
              onChange={(e) => setPubkey(e.target.value)}
              className="field-line mt-1"
              placeholder="outpoint / pubkey"
              required
            />
            <button type="submit" className="btn btn-solid mt-6 w-full text-center">
              commit
            </button>
            {submitted && (
              <p className="mt-4 font-hand text-[var(--accent)]">Recorded — await block hash sort.</p>
            )}
          </form>
        </SketchFrame>
      </div>

      <SketchFrame className="mt-8" label="score table">
        <table className="data-table">
          <thead>
            <tr>
              <th>rank</th>
              <th>score</th>
              <th>claimant</th>
              <th>serial</th>
            </tr>
          </thead>
          <tbody className="font-data">
            {round.leaderboard.map((row) => (
              <tr key={row.rank}>
                <td>{row.rank}</td>
                <td>{row.score}</td>
                <td>{row.claimant}</td>
                <td>#{formatNumber(row.serial)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SketchFrame>
    </div>
  );
}
