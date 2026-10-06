import Link from "next/link";
import { BirthFeed } from "@/components/birth-feed";
import { MintContrast } from "@/components/mint-contrast";
import { StateTape } from "@/components/state-tape";
import { WalletLayers } from "@/components/wallet-layers";
import { assets, birthEvents, launchRounds, walletPreview } from "@/lib/data";
import { formatNumber } from "@/lib/format";

export default function HomePage() {
  const featured = assets[0];
  const round = launchRounds[0];

  return (
    <div className="grid-glow">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Serials, not supply fields.
          </h1>
          <p className="mt-4 text-zinc-400">
            Each issuance burns one XMSS index and births one numbered unit. Trade like dollars, prove like banknotes.
          </p>
        </div>

        <div className="mt-10">
          <MintContrast />
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          <div className="card p-5 lg:col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Live state tape · {featured.symbol}</h2>
              <Link href={`/asset/${featured.id}`} className="text-xs text-amber-400">Domain →</Link>
            </div>
            <div className="mt-4">
              <StateTape
                issued={featured.issued}
                nextSerial={featured.nextSerial}
                highlightSerials={[0, 481, featured.nextSerial]}
              />
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              Next ISSUE will consume signing state{" "}
              <span className="font-mono text-amber-300">#{formatNumber(featured.nextSerial)}</span> and assign serial{" "}
              <span className="font-mono text-zinc-200">#{formatNumber(featured.nextSerial)}</span> to a Bitcoin output.
            </p>
          </div>

          <div className="lg:col-span-2">
            <WalletLayers wallet={walletPreview} />
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Birth ledger</h2>
              <Link href="/births" className="text-xs text-amber-400">All events →</Link>
            </div>
            <BirthFeed events={birthEvents.slice(0, 3)} compact />
          </div>

          <div className="card p-5">
            <h2 className="font-medium">Block lottery round</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Block {formatNumber(round.revealBlock)} hash ranks {formatNumber(round.batchSize)} winners for serials{" "}
              {formatNumber(round.serialStart)}–{formatNumber(round.serialEnd)}.
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-zinc-500">Claims</dt>
                <dd>{formatNumber(round.participants)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Anchor</dt>
                <dd className="font-mono">{formatNumber(round.anchorBlock)}</dd>
              </div>
            </dl>
            <Link href="/launch" className="mt-5 block rounded-lg bg-amber-500 py-2.5 text-center text-sm font-semibold text-black">
              View scores & claim
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
