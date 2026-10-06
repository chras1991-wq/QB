import Link from "next/link";
import type { BirthEvent } from "@/lib/types";
import { formatNumber, truncateMiddle } from "@/lib/format";

export function BirthFeed({ events, compact = false }: { events: BirthEvent[]; compact?: boolean }) {
  return (
    <ul className="divide-y divide-zinc-800/80">
      {events.map((e) => (
        <li key={e.id} className={`flex gap-3 ${compact ? "py-3" : "py-4"}`}>
          <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border border-red-500/30 bg-red-500/5 text-[10px] leading-tight text-red-300">
            <span className="text-[9px] uppercase">burn</span>
            <span className="font-mono font-semibold">{e.xmssIndex}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/unit/${e.assetId}/${e.serial}`}
                className="font-mono text-sm font-semibold text-zinc-100 hover:text-amber-300"
              >
                {e.symbol} #{formatNumber(e.serial)}
              </Link>
              <span className="text-xs text-zinc-600">born</span>
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                block {formatNumber(e.block)}
              </span>
            </div>
            {!compact && (
              <p className="mt-1 text-xs text-zinc-500">
                ISSUE verified · tx {truncateMiddle(e.txid, 8, 8)} → {e.recipient}
              </p>
            )}
          </div>
          <span className="shrink-0 text-xs text-zinc-600">{e.at}</span>
        </li>
      ))}
    </ul>
  );
}
