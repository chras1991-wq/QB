"use client";

import Link from "next/link";
import { useState } from "react";
import type { WalletPreview } from "@/lib/types";
import { SketchFrame } from "@/components/sketch-frame";
import { formatNumber } from "@/lib/format";

export function WalletLayers({ wallet, defaultOpen = false }: { wallet: WalletPreview; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <SketchFrame label="wallet strata">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-end justify-between text-left">
        <div>
          <p className="font-hand text-lg text-[var(--ink-muted)]">quoted</p>
          <p className="font-display text-4xl">{wallet.displayBalance}</p>
        </div>
        <span className="font-hand text-[var(--ink-muted)]">{open ? "fold" : "unfold serials"}</span>
      </button>
      {open && (
        <div className="mt-5 border-t border-dashed border-[var(--rule-strong)] pt-4">
          <p className="kicker">ranges</p>
          {wallet.ranges.map((r) => (
            <p key={`${r.start}-${r.end}`} className="mt-1 font-data text-sm">
              {r.symbol} [{formatNumber(r.start)}–{formatNumber(r.end)}]
            </p>
          ))}
          <p className="kicker mt-5">singles</p>
          <div className="mt-2 flex flex-wrap gap-x-4">
            {wallet.singles.map((s) => (
              <Link key={`${s.symbol}-${s.serial}`} href={`/unit/${s.assetId}/${s.serial}`} className="text-link font-data text-sm">
                {s.symbol} #{formatNumber(s.serial)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </SketchFrame>
  );
}
