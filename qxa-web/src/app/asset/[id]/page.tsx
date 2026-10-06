import Link from "next/link";
import { notFound } from "next/navigation";
import { BirthFeed } from "@/components/birth-feed";
import { CopyButton } from "@/components/copy-button";
import { StateTape } from "@/components/state-tape";
import { assets, getAsset, getBirthsForAsset, getUnitsForAsset } from "@/lib/data";
import { formatNumber, policyLabel, truncateMiddle } from "@/lib/format";

export function generateStaticParams() {
  return assets.map((a) => ({ id: a.id }));
}

export default async function AssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = getAsset(id);
  if (!asset) notFound();

  const births = getBirthsForAsset(id);
  const sampleUnits = getUnitsForAsset(id);
  const burned = asset.issued;
  const left = asset.maxSerials - asset.issued;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs uppercase tracking-widest text-zinc-500">Issuance domain</p>
      <h1 className="mt-1 text-4xl font-semibold">{asset.symbol}</h1>
      <p className="text-zinc-400">{asset.name}</p>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-medium">XMSS capacity</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 py-3">
              <p className="text-2xl font-mono font-semibold text-red-300">{formatNumber(burned)}</p>
              <p className="text-[10px] uppercase text-zinc-500">states burned</p>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 py-3">
              <p className="text-2xl font-mono font-semibold text-amber-200">#{formatNumber(asset.nextSerial)}</p>
              <p className="text-[10px] uppercase text-zinc-500">next index</p>
            </div>
            <div className="rounded-lg border border-zinc-700 py-3">
              <p className="text-2xl font-mono font-semibold">{formatNumber(left)}</p>
              <p className="text-[10px] uppercase text-zinc-500">never signable after close</p>
            </div>
          </div>
          <div className="mt-6">
            <StateTape issued={asset.issued} nextSerial={asset.nextSerial} maxPreview={36} />
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-medium">Genesis binding</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-zinc-500">XMSS root</dt>
              <dd className="mt-1 break-all font-mono text-[10px]">{asset.pqRoot}</dd>
              <CopyButton text={asset.pqRoot} />
            </div>
            <div>
              <dt className="text-zinc-500">AssetID</dt>
              <dd className="font-mono text-xs">{truncateMiddle(asset.id, 14, 14)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Policy</dt>
              <dd>{policyLabel(asset.policy)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">h = {asset.treeHeight}</dt>
              <dd className="font-mono">{formatNumber(asset.maxSerials)} max serials</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-medium">Recent births</h2>
          {births.length ? (
            <BirthFeed events={births} compact />
          ) : (
            <p className="mt-3 text-sm text-violet-300">Virgin root — no XMSS state consumed yet.</p>
          )}
        </div>
        <div className="card p-5">
          <h2 className="font-medium">Collectible serials</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {sampleUnits.map((u) => (
              <Link
                key={u.serial}
                href={`/unit/${u.assetId}/${u.serial}`}
                className="rounded-lg border border-zinc-700 px-3 py-2 font-mono text-sm hover:border-amber-500/40"
              >
                #{formatNumber(u.serial)}
              </Link>
            ))}
            <Link href={`/unit/${asset.id}/0`} className="rounded-lg border border-dashed border-zinc-700 px-3 py-2 text-xs text-zinc-500">
              Lookup serial…
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
