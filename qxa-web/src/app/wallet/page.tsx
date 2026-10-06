import Link from "next/link";
import { WalletLayers } from "@/components/wallet-layers";
import { walletPreview } from "@/lib/data";
import { formatNumber } from "@/lib/format";

export default function WalletPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">Custody layers</h1>
      <p className="mt-2 text-zinc-400">
        Markets price {walletPreview.displayBalance.split(" ")[1]} homogeneously. Your wallet holds ranges and singles underneath.
      </p>

      <div className="mt-8">
        <WalletLayers wallet={walletPreview} defaultOpen />
      </div>

      <section className="card mt-6 p-5">
        <h2 className="text-sm font-medium text-zinc-400">Transfer preview</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Send 40 units from range [100–199] → Bob gets [100–139], change [140–199]. Or peel{" "}
          <Link href={`/unit/${walletPreview.singles[2].assetId}/${walletPreview.singles[2].serial}`} className="text-amber-400">
            QX #{formatNumber(481)}
          </Link>{" "}
          as a collectible single. No PQ signature — Bitcoin spend only.
        </p>
      </section>
    </div>
  );
}
