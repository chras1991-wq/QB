import Link from "next/link";
import { SketchFrame } from "@/components/sketch-frame";
import { WalletLayers } from "@/components/wallet-layers";
import { walletPreview } from "@/lib/data";
import { formatNumber } from "@/lib/format";

export default function WalletPage() {
  return (
    <div className="page max-w-2xl py-12">
      <h1 className="font-display text-4xl">Custody strata</h1>
      <p className="mt-3 font-hand text-xl text-[var(--ink-muted)]">
        Markets see a balance; custody is ranges and numbered specimens underneath.
      </p>
      <div className="mt-8">
        <WalletLayers wallet={walletPreview} defaultOpen />
      </div>
      <SketchFrame className="mt-8" label="transfer note">
        <p className="font-hand text-lg text-[var(--ink-muted)]">
          Split range [100–199]: send 40 → peer [100–139], change [140–199]. Or move single{" "}
          <Link href={`/unit/${walletPreview.singles[2].assetId}/${walletPreview.singles[2].serial}`} className="text-link">
            #{formatNumber(481)}
          </Link>{" "}
          — Bitcoin spend only, no new PQ signature.
        </p>
      </SketchFrame>
    </div>
  );
}
