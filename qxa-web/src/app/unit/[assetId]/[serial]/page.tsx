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
      birthBlock: asset.genesisBlock + serial,
      birthTxid: "0000000000000000000000000000000000000000000000000000000000000000",
      pqVerified: serial < asset.issued,
      owner: "bc1qpreview0000000000000000000000000000000000",
      tags: serial === 0 ? ["first-unit"] : serial === asset.maxSerials - 1 ? ["final-serial"] : [],
    };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm text-zinc-500">{asset.symbol} unit</p>
      <h1 className="mt-1 font-mono text-4xl font-semibold">#{formatNumber(unit.serial)}</h1>

      <div className="mt-8 space-y-4">
        <div className="card p-5">
          <h2 className="text-sm font-medium text-zinc-400">Birth</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Block</dt>
              <dd className="font-mono">{formatNumber(unit.birthBlock)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Transaction</dt>
              <dd className="mt-1 break-all font-mono text-xs">{unit.birthTxid}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-medium text-zinc-400">PQ issuance</h2>
          <p className="mt-2 text-sm text-zinc-300">
            {unit.pqVerified ? "XMSS signature verified against genesis root." : "Not yet issued."}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <CopyButton text={asset.pqRoot} label="Copy root" />
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-medium text-zinc-400">Current owner</h2>
          <p className="mt-2 break-all font-mono text-xs">{unit.owner}</p>
          <p className="mt-2 text-xs text-zinc-500">{truncateMiddle(unit.owner, 12, 12)}</p>
        </div>
      </div>
    </div>
  );
}
