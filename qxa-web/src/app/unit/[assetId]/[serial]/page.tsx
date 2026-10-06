import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { getAsset, getUnit, units } from "@/lib/data";
import { formatNumber, truncateMiddle } from "@/lib/format";

export function generateStaticParams() {
  return units.map((u) => ({ assetId: u.assetId, serial: String(u.serial) }));
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ assetId: string; serial: string }>;
}) {
  const { assetId, serial: serialStr } = await params;
  const serial = Number(serialStr);
  const asset = getAsset(assetId);
  if (!asset || Number.isNaN(serial)) notFound();

  const unit =
    getUnit(assetId, serial) ?? {
      assetId,
      symbol: asset.symbol,
      serial,
      xmssIndex: serial,
      birthBlock: asset.genesisBlock + serial,
      birthTxid: "0000000000000000000000000000000000000000000000000000000000000000",
      pqVerified: serial < asset.issued,
      owner: "bc1qpreview0000000000000000000000000000000000",
      tags: serial === 0 ? ["first-unit"] : serial === asset.maxSerials - 1 ? ["final-serial"] : [],
    };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="certificate-border rounded-2xl bg-zinc-950/80 p-6 sm:p-8">
        <p className="text-center text-[10px] uppercase tracking-[0.35em] text-amber-500/80">Birth certificate</p>
        <h1 className="mt-3 text-center font-mono text-4xl font-semibold tracking-tight">
          {unit.symbol} #{formatNumber(unit.serial)}
        </h1>

        <div className="mt-8 space-y-4 text-sm">
          <div className="flex justify-between border-b border-zinc-800 py-3">
            <span className="text-zinc-500">XMSS index consumed</span>
            <span className="font-mono text-red-300 line-through decoration-red-500">{unit.xmssIndex}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800 py-3">
            <span className="text-zinc-500">Serial born</span>
            <span className="font-mono">#{formatNumber(unit.serial)}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800 py-3">
            <span className="text-zinc-500">Bitcoin block</span>
            <span className="font-mono">{formatNumber(unit.birthBlock)}</span>
          </div>
          <div className="border-b border-zinc-800 py-3">
            <p className="text-zinc-500">Genesis root</p>
            <p className="mt-1 break-all font-mono text-[10px] text-zinc-400">{asset.pqRoot}</p>
          </div>
          <div className="border-b border-zinc-800 py-3">
            <p className="text-zinc-500">PQ issuance</p>
            <p className="mt-1 text-emerald-300">
              {unit.pqVerified ? "XMSS detached signature verified (ISSUE)" : "Unissued serial — no burned state"}
            </p>
          </div>
          <div className="py-3">
            <p className="text-zinc-500">Owner (Bitcoin UTXO)</p>
            <p className="mt-1 break-all font-mono text-xs">{unit.owner}</p>
            <p className="mt-1 text-xs text-zinc-600">Transfers do not touch XMSS — only this UTXO chain.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <CopyButton text={unit.birthTxid} label="Copy birth tx" />
          <Link href={`/asset/${assetId}`} className="rounded-md border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300">
            Domain
          </Link>
        </div>

        {unit.tags.length > 0 && (
          <p className="mt-6 text-center text-xs uppercase tracking-wider text-amber-400/90">{unit.tags.join(" · ")}</p>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-zinc-600">tx {truncateMiddle(unit.birthTxid, 12, 12)}</p>
    </div>
  );
}
