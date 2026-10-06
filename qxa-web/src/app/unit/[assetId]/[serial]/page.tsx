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
    <div className="page max-w-2xl py-12">
      <article className="certificate px-6 py-8 sm:px-10 sm:py-10">
        <p className="text-center font-hand text-xl text-[var(--ink-muted)]">Specimen record</p>
        <h1 className="mt-2 text-center font-display text-4xl">
          {unit.symbol} #{formatNumber(unit.serial)}
        </h1>

        <table className="mt-10 w-full text-sm">
          <tbody className="font-hand text-lg">
            <tr className="border-b border-dashed border-[var(--rule-strong)]">
              <td className="py-3 text-[var(--ink-muted)]">XMSS index consumed</td>
              <td className="py-3 text-right font-data line-through decoration-[var(--ink)]">{unit.xmssIndex}</td>
            </tr>
            <tr className="border-b border-dashed border-[var(--rule-strong)]">
              <td className="py-3 text-[var(--ink-muted)]">Birth block</td>
              <td className="py-3 text-right font-data">{formatNumber(unit.birthBlock)}</td>
            </tr>
            <tr className="border-b border-dashed border-[var(--rule-strong)]">
              <td className="py-3 text-[var(--ink-muted)]">PQ issuance</td>
              <td className="py-3 text-right">
                {unit.pqVerified ? "verified ISSUE" : "unissued"}
              </td>
            </tr>
            <tr>
              <td className="py-3 align-top text-[var(--ink-muted)]">Owner UTXO</td>
              <td className="py-3 text-right font-data text-[11px] break-all">{unit.owner}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-6 font-data text-[10px] leading-relaxed text-[var(--ink-faint)] break-all">{asset.pqRoot}</p>

        <div className="mt-6 flex flex-wrap gap-4">
          <CopyButton text={unit.birthTxid} label="copy birth tx" />
          <Link href={`/asset/${assetId}`} className="text-link font-hand text-lg">domain</Link>
        </div>

        {unit.tags.length > 0 && (
          <p className="mt-8 text-center font-hand text-[var(--ink-muted)]">{unit.tags.join(" · ")}</p>
        )}
      </article>
      <p className="mt-4 text-center font-data text-xs text-[var(--ink-faint)]">{truncateMiddle(unit.birthTxid, 12, 12)}</p>
    </div>
  );
}
