import Link from "next/link";
import { notFound } from "next/navigation";
import { BirthFeed } from "@/components/birth-feed";
import { CapacityFigure } from "@/components/capacity-figure";
import { CopyButton } from "@/components/copy-button";
import { IndexRaster } from "@/components/index-raster";
import { SketchFrame } from "@/components/sketch-frame";
import { assets, getAsset, getBirthsForAsset, getUnitsForAsset } from "@/lib/data";
import { formatNumber, policyLabel } from "@/lib/format";

export function generateStaticParams() {
  return assets.map((a) => ({ id: a.id }));
}

export default async function AssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = getAsset(id);
  if (!asset) notFound();

  const births = getBirthsForAsset(id);
  const sampleUnits = getUnitsForAsset(id);
  const left = asset.maxSerials - asset.issued;

  return (
    <div className="page py-12">
      <p className="kicker">Issuance domain</p>
      <h1 className="font-display text-4xl">{asset.symbol}</h1>
      <p className="font-hand text-xl text-[var(--ink-muted)]">{asset.name}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <SketchFrame className="lg:col-span-2" label="capacity">
          <CapacityFigure issued={asset.issued} max={asset.maxSerials} />
          <div className="mt-8 grid gap-6 sm:grid-cols-3 font-hand text-lg">
            <div>
              <span className="text-[var(--ink-muted)]">next index</span>
              <p className="font-data text-2xl text-[var(--ink)]">#{formatNumber(asset.nextSerial)}</p>
            </div>
            <div>
              <span className="text-[var(--ink-muted)]">remaining</span>
              <p className="font-data text-2xl">{formatNumber(left)}</p>
            </div>
            <div>
              <span className="text-[var(--ink-muted)]">tree h</span>
              <p className="font-data text-2xl">2^{asset.treeHeight}</p>
            </div>
          </div>
          <div className="mt-8">
            <IndexRaster issued={asset.issued} nextSerial={asset.nextSerial} maxSerials={asset.maxSerials} />
          </div>
        </SketchFrame>

        <SketchFrame label="genesis binding">
          <p className="font-hand text-[var(--ink-muted)]">XMSS root</p>
          <p className="mt-2 font-data text-[10px] leading-relaxed break-all">{asset.pqRoot}</p>
          <CopyButton text={asset.pqRoot} label="copy root" />
          <dl className="mt-6 space-y-3 font-hand text-lg">
            <div>
              <dt className="text-[var(--ink-muted)]">policy</dt>
              <dd>{policyLabel(asset.policy)}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink-muted)]">genesis block</dt>
              <dd className="font-data text-base">{formatNumber(asset.genesisBlock)}</dd>
            </div>
          </dl>
        </SketchFrame>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <SketchFrame label="recent births">
          {births.length ? <BirthFeed events={births} compact /> : (
            <p className="font-hand text-lg text-[var(--ink-muted)]">Virgin — no index consumed yet.</p>
          )}
        </SketchFrame>
        <SketchFrame label="specimen serials">
          <div className="flex flex-wrap gap-3">
            {sampleUnits.map((u) => (
              <Link
                key={u.serial}
                href={`/unit/${u.assetId}/${u.serial}`}
                className="font-data text-link text-sm"
              >
                #{formatNumber(u.serial)}
              </Link>
            ))}
          </div>
        </SketchFrame>
      </div>
    </div>
  );
}
