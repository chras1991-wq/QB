import Link from "next/link";
import type { BirthEvent } from "@/lib/types";
import { formatNumber, truncateMiddle } from "@/lib/format";

export function BirthFeed({ events, compact = false }: { events: BirthEvent[]; compact?: boolean }) {
  return (
    <ol className="divide-y divide-[var(--rule)]">
      {events.map((e) => (
        <li key={e.id} className="grid gap-2 py-4 sm:grid-cols-[5rem_1fr_auto]">
          {!compact && (
            <div className="font-hand text-sm text-[var(--ink-muted)]">
              burn
              <span className="ml-1 font-data text-[var(--ink)]">{formatNumber(e.xmssIndex)}</span>
            </div>
          )}
          <div>
            <Link href={`/unit/${e.assetId}/${e.serial}`} className="text-link font-display text-xl">
              {e.symbol} #{formatNumber(e.serial)}
            </Link>
            {!compact && (
              <p className="mt-1 font-data text-[11px] text-[var(--ink-muted)]">
                blk {formatNumber(e.block)} · {truncateMiddle(e.txid, 6, 6)}
              </p>
            )}
          </div>
          <time className="font-hand text-sm text-[var(--ink-faint)]">{e.at}</time>
        </li>
      ))}
    </ol>
  );
}
