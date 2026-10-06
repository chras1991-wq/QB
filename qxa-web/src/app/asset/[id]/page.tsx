import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { ProgressBar } from "@/components/progress-bar";
import { assets, getAsset, getUnitsForAsset } from "@/lib/data";
import { formatNumber, formatPercent, policyLabel, truncateMiddle } from "@/lib/format";

export function generateStaticParams() {
  return assets.map((a) => ({ id: a.id }));
}

export default async function AssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = getAsset(id);
  if (!asset) notFound();

  const sampleUnits = getUnitsForAsset(id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Asset</p>
          <h1 className="text-4xl font-semibold">{asset.symbol}</h1>
          <p className="mt-1 text-zinc-400">{asset.name}</p>
        </div>
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-wide text-zinc-300">
          {asset.status}
        </span>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-medium">Issuance</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Progress</span>
              <span>
                {formatNumber(asset.issued)} / {formatNumber(asset.maxSerials)}
              </span>
            </div>
            <ProgressBar value={asset.issued} max={asset.maxSerials} />
            <p className="text-xs text-zinc-500">{formatPercent(asset.issued, asset.maxSerials)} complete</p>
          </div>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-zinc-500">Next serial</dt>
              <dd className="font-mono text-lg">#{formatNumber(asset.nextSerial)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Cryptographic capacity</dt>
              <dd>2^{asset.treeHeight} = {formatNumber(asset.maxSerials)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Genesis block</dt>
              <dd className="font-mono">{formatNumber(asset.genesisBlock)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Issuance policy</dt>
              <dd>{policyLabel(asset.policy)}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-5">
          <h2 className="font-medium">PQ proof</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-zinc-500">XMSS root</dt>
              <dd className="mt-1 break-all font-mono text-xs">{asset.pqRoot}</dd>
              <div className="mt-2">
                <CopyButton text={asset.pqRoot} />
              </div>
            </div>
            <div>
              <dt className="text-zinc-500">Asset ID</dt>
              <dd className="mt-1 font-mono text-xs">{truncateMiddle(asset.id, 16, 16)}</dd>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-300">
              Indexer: issuance signatures verified (preview data)
            </div>
          </dl>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Notable units</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {sampleUnits.length === 0 ? (
            <p className="text-sm text-zinc-500">No indexed units yet.</p>
          ) : (
            sampleUnits.map((u) => (
              <Link
                key={u.serial}
                href={`/unit/${u.assetId}/${u.serial}`}
                className="card block p-4 transition hover:border-amber-500/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold">
                    {u.symbol} #{formatNumber(u.serial)}
                  </span>
                  {u.pqVerified && (
                    <span className="text-xs text-emerald-400">PQ ✓</span>
                  )}
                </div>
                <p className="mt-2 text-xs text-zinc-500">Born block {formatNumber(u.birthBlock)}</p>
                {u.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {u.tags.map((t) => (
                      <span key={t} className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-400">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
