import Link from "next/link";
import { BirthFeed } from "@/components/birth-feed";
import { IndexRaster } from "@/components/index-raster";
import { IssueSchematic } from "@/components/issue-schematic";
import { MintContrast } from "@/components/mint-contrast";
import { SketchFrame } from "@/components/sketch-frame";
import { WalletLayers } from "@/components/wallet-layers";
import { assets, birthEvents, launchRounds, walletPreview } from "@/lib/data";
import { formatNumber } from "@/lib/format";

export default function HomePage() {
  const featured = assets[0];
  const round = launchRounds[0];

  return (
    <div className="page pb-20 pt-12 sm:pt-16">
      <header className="max-w-2xl">
        <p className="kicker">Laboratory note · QXA</p>
        <h1 className="font-display mt-2 text-4xl leading-tight sm:text-5xl">
          Serialized assets from exhausted signing states.
        </h1>
        <p className="mt-4 text-[var(--ink-muted)]">
          Each issuance is an experiment: one XMSS index in, one numbered unit out, ownership on a UTXO.
        </p>
      </header>

      <div className="mt-10">
        <IssueSchematic />
      </div>

      <hr className="rule-sketch mt-10" />

      <div className="mt-8">
        <MintContrast />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <SketchFrame className="lg:col-span-3" label={`${featured.symbol} field`}>
          <IndexRaster
            issued={featured.issued}
            nextSerial={featured.nextSerial}
            maxSerials={featured.maxSerials}
          />
          <p className="mt-4 font-hand text-lg text-[var(--ink-muted)]">
            Next ISSUE consumes index{" "}
            <span className="font-data text-[var(--ink)]">{formatNumber(featured.nextSerial)}</span> → serial{" "}
            <span className="font-data text-[var(--ink)]">#{formatNumber(featured.nextSerial)}</span>
          </p>
          <Link href={`/asset/${featured.id}`} className="mt-3 inline-block text-link font-hand text-lg">
            domain sheet →
          </Link>
        </SketchFrame>

        <div className="lg:col-span-2">
          <WalletLayers wallet={walletPreview} />
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <SketchFrame label="birth log (excerpt)">
          <div className="mb-3 flex justify-end">
            <Link href="/births" className="text-link font-hand text-lg">full log →</Link>
          </div>
          <BirthFeed events={birthEvents.slice(0, 3)} compact />
        </SketchFrame>

        <SketchFrame label="block lottery">
          <p className="font-hand text-lg text-[var(--ink-muted)]">
            Block {formatNumber(round.revealBlock)} hash orders {formatNumber(round.batchSize)} claimants for serials{" "}
            {formatNumber(round.serialStart)}–{formatNumber(round.serialEnd)}.
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 font-data text-sm">
            <div>
              <dt className="font-hand text-[var(--ink-muted)]">claims</dt>
              <dd>{formatNumber(round.participants)}</dd>
            </div>
            <div>
              <dt className="font-hand text-[var(--ink-muted)]">anchor</dt>
              <dd>{formatNumber(round.anchorBlock)}</dd>
            </div>
          </dl>
          <Link href="/launch" className="btn mt-6 inline-block">
            scores & claim
          </Link>
        </SketchFrame>
      </div>
    </div>
  );
}
