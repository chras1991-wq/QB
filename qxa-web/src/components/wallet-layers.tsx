"use client";

import Link from "next/link";
import { useState } from "react";
import type { WalletPreview } from "@/lib/types";
import { SketchFrame } from "@/components/sketch-frame";
import { formatNumber } from "@/lib/format";

export function WalletLayers({ wallet, defaultOpen = false }: { wallet: WalletPreview; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <SketchFrame label="Wallet strata">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-end justify-between text-left">
        <div>
          <p className="font-hand text-xl text-[var(--ink-muted)]">Quoted</p>
          <p className="font-display text-5xl">{wallet.displayBalance}</p>
        </div>
        <span className="font-hand text-xl text-[var(--pencil)]">{open ? "Fold" : "Unfold serials"}</span>
      </button>
      {open && (
        <div className="mt-5 border-t border-dashed border-[var(--rule-strong)] pt-4">
          <p className="kicker">Ranges</p>
          {wallet.ranges.map((r) => (
            <p key={`${r.start}-${r.end}`} className="mt-1 font-hand text-lg">
              {r.symbol} [{formatNumber(r.start)}–{formatNumber(r.end)}]
            </p>
          ))}
          <p className="kicker mt-5">Singles</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {wallet.singles.map((s) => (
              <Link key={`${s.symbol}-${s.serial}`} href={`/unit/${s.assetId}/${s.serial}`} className="text-link font-hand text-xl">
                {s.symbol} #{formatNumber(s.serial)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </SketchFrame>
  );
}
