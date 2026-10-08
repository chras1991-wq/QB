import Link from "next/link";
import { BirthFeed } from "@/components/birth-feed";
import { HandTitle } from "@/components/hand-title";
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
    <div className="page pb-20 pt-10 sm:pt-14">
      <header className="max-w-2xl">
        <p className="kicker">Lab note · QXA</p>
        <HandTitle>
          <span className="text-5xl sm:text-6xl">Every unit is one signing state spent</span>
        </HandTitle>
        <p className="mt-5 text-xl text-[var(--ink-muted)]">
          Not a mint amount. XMSS burns index <em>n</em>, serial <em>#n</em> is born, ownership sits on a Bitcoin UTXO.
        </p>
        <p className="margin-note mt-4 max-w-sm">← Like numbered bills, issued from one-shot PQ state</p>
      </header>

      <div className="mt-12">
        <IssueSchematic />
      </div>

      <hr className="rule-sketch mt-12" />

      <div className="mt-10">
        <MintContrast />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        <SketchFrame className="lg:col-span-3" label={`${featured.symbol} index field`}>
          <IndexRaster
            issued={featured.issued}
            nextSerial={featured.nextSerial}
            maxSerials={featured.maxSerials}
          />
          <p className="mt-5 font-hand text-xl text-[var(--ink-muted)]">
            Next ISSUE burns index{" "}
            <span className="font-data text-[var(--ink)]">{formatNumber(featured.nextSerial)}</span>
            and births serial{" "}
            <span className="font-data text-[var(--ink)]">#{formatNumber(featured.nextSerial)}</span>
          </p>
          <Link href={`/asset/${featured.id}`} className="mt-4 inline-block text-link font-hand text-2xl">
            Open domain notes →
          </Link>
        </SketchFrame>

        <div className="lg:col-span-2">
          <WalletLayers wallet={walletPreview} />
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <SketchFrame label="Birth excerpt">
          <div className="mb-2 flex justify-end">
            <Link href="/births" className="text-link font-hand text-xl">Full log →</Link>
          </div>
          <BirthFeed events={birthEvents.slice(0, 3)} compact />
        </SketchFrame>

        <SketchFrame label="Block lottery">
          <p className="font-hand text-xl text-[var(--ink-muted)]">
            Block {formatNumber(round.revealBlock)} hash ranks {formatNumber(round.batchSize)} winners for serials{" "}
            {formatNumber(round.serialStart)}–{formatNumber(round.serialEnd)}.
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-3 font-hand text-lg">
            <div>
              <dt className="text-[var(--ink-faint)]">Claims</dt>
              <dd className="font-data text-base">{formatNumber(round.participants)}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink-faint)]">Anchor block</dt>
              <dd className="font-data text-base">{formatNumber(round.anchorBlock)}</dd>
            </div>
          </dl>
          <Link href="/launch" className="btn mt-6 inline-block">
            Scores & claim
          </Link>
        </SketchFrame>
      </div>
    </div>
  );
}
