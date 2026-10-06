import Link from "next/link";
import type { Asset } from "@/lib/types";
import { StateTape } from "@/components/state-tape";
import { formatNumber } from "@/lib/format";

export function RootCard({ asset }: { asset: Asset }) {
  const remaining = asset.maxSerials - asset.issued;
  const isVirgin = asset.issued === 0;

  return (
    <article className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">Genesis root</p>
          <h2 className="mt-1 text-xl font-semibold">{asset.symbol}</h2>
          <p className="text-sm text-zinc-500">{asset.name}</p>
        </div>
        {isVirgin ? (
          <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-2 py-1 text-[10px] uppercase text-violet-200">
            Virgin
          </span>
        ) : (
          <span className="text-right font-mono text-xs text-zinc-500">
            <span className="block text-zinc-400">{formatNumber(remaining)}</span>
            states left
          </span>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-zinc-800 bg-black/40 p-3 font-mono text-[10px] leading-relaxed text-zinc-500">
        {asset.pqRoot.slice(0, 32)}
        <br />
        {asset.pqRoot.slice(32)}
      </div>

      <div className="mt-4">
        <StateTape issued={asset.issued} nextSerial={asset.nextSerial} maxPreview={20} />
      </div>

      <Link
        href={`/asset/${asset.id}`}
        className="mt-5 text-center rounded-lg border border-zinc-700 py-2 text-sm hover:border-amber-500/40"
      >
        Open issuance domain
      </Link>
    </article>
  );
}
