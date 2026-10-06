"use client";

import Link from "next/link";
import { useState } from "react";
import type { WalletPreview } from "@/lib/types";
import { formatNumber } from "@/lib/format";

export function WalletLayers({ wallet, defaultOpen = false }: { wallet: WalletPreview; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-zinc-900/50"
      >
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500">Wallet surface</p>
          <p className="mt-1 text-2xl font-semibold">{wallet.displayBalance}</p>
          <p className="text-xs text-zinc-500">Homogeneous quote · heterogeneous custody</p>
        </div>
        <span className="text-sm text-amber-400">{open ? "Hide serials" : "Show serials"}</span>
      </button>
      {open && (
        <div className="border-t border-zinc-800 px-5 py-4">
          <p className="text-xs font-medium text-zinc-500">Ranges (UTXO-efficient)</p>
          {wallet.ranges.map((r) => (
            <div key={`${r.start}-${r.end}`} className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 font-mono text-sm">
              {r.symbol} [{formatNumber(r.start)}–{formatNumber(r.end)}] · {r.end - r.start + 1} units
            </div>
          ))}
          <p className="mt-4 text-xs font-medium text-zinc-500">Singles (collectible-friendly)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {wallet.singles.map((s) => (
              <Link
                key={`${s.symbol}-${s.serial}`}
                href={`/unit/${s.assetId}/${s.serial}`}
                className="rounded-full border border-zinc-700 px-3 py-1 font-mono text-xs hover:border-amber-500/50"
              >
                {s.symbol} #{formatNumber(s.serial)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
