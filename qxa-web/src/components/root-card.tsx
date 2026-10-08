import Link from "next/link";
import type { Asset } from "@/lib/types";
import { CapacityFigure } from "@/components/capacity-figure";
import { IndexRaster } from "@/components/index-raster";
import { SketchFrame } from "@/components/sketch-frame";
import { formatNumber } from "@/lib/format";

export function RootCard({ asset }: { asset: Asset }) {
  const isVirgin = asset.issued === 0;

  return (
    <SketchFrame label={isVirgin ? "virgin root" : asset.symbol}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl">{asset.symbol}</h2>
          <p className="font-hand text-lg text-[var(--ink-muted)]">{asset.name}</p>
        </div>
      </div>

      <div className="mt-6">
        <CapacityFigure issued={asset.issued} max={asset.maxSerials} />
      </div>

      <p className="mt-4 font-data text-[10px] leading-relaxed text-[var(--ink-faint)] break-all">{asset.pqRoot}</p>

      <div className="mt-6">
        <IndexRaster issued={asset.issued} nextSerial={asset.nextSerial} maxSerials={asset.maxSerials} buckets={56} />
      </div>

      <Link href={`/asset/${asset.id}`} className="mt-5 inline-block text-link font-hand text-lg">
        open domain →
      </Link>
      {!isVirgin && (
        <p className="mt-2 font-hand text-sm text-[var(--ink-muted)]">
          {formatNumber(asset.maxSerials - asset.issued)} signable states remain
        </p>
      )}
    </SketchFrame>
  );
}
