"use client";

import { useState } from "react";
import { SketchFrame } from "@/components/sketch-frame";

export default function CreatePage() {
  const [symbol, setSymbol] = useState("QX");
  const [height, setHeight] = useState(12);
  const [policy, setPolicy] = useState("block_lottery_v1");
  const capacity = 2 ** height;

  return (
    <div className="page max-w-xl py-12">
      <h1 className="font-display text-4xl">New genesis</h1>
      <p className="mt-3 font-hand text-xl text-[var(--ink-muted)]">Register a root and its signing budget.</p>

      <SketchFrame className="mt-8" label="parameters">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Signer + Bitcoin hookup on Signet.");
          }}
        >
          <label>
            <span className="font-hand text-lg text-[var(--ink-muted)]">symbol</span>
            <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} className="field-line" maxLength={12} />
          </label>
          <label>
            <span className="font-hand text-lg text-[var(--ink-muted)]">tree height h</span>
            <input
              type="number"
              min={10}
              max={20}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="field-line"
            />
            <p className="mt-1 font-hand text-[var(--ink-muted)]">{capacity.toLocaleString()} signable indexes</p>
          </label>
          <label>
            <span className="font-hand text-lg text-[var(--ink-muted)]">policy</span>
            <select
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
              className="field-line font-hand text-lg"
            >
              <option value="sequential">sequential issuer</option>
              <option value="block_lottery_v1">block lottery</option>
            </select>
          </label>
          <button type="submit" className="btn btn-solid w-full text-center">
            commit genesis
          </button>
        </form>
      </SketchFrame>
    </div>
  );
}
