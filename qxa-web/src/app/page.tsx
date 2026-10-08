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
        <p className="kicker">实验记录 · QXA</p>
        <HandTitle>
          <span className="text-5xl sm:text-6xl">每一枚，都是一次签名态的耗尽</span>
        </HandTitle>
        <p className="mt-5 text-xl text-[var(--ink-muted)]">
          不是 mint 数量。XMSS 划掉一格 index，才诞生一个带编号的单元，所有权落在 Bitcoin UTXO 上。
        </p>
        <p className="margin-note mt-4 max-w-sm">← 像纸币编号，但发行靠后量子一次性状态</p>
      </header>

      <div className="mt-12">
        <IssueSchematic />
      </div>

      <hr className="rule-sketch mt-12" />

      <div className="mt-10">
        <MintContrast />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        <SketchFrame className="lg:col-span-3" label={`${featured.symbol} 索引场`}>
          <IndexRaster
            issued={featured.issued}
            nextSerial={featured.nextSerial}
            maxSerials={featured.maxSerials}
          />
          <p className="mt-5 font-hand text-xl text-[var(--ink-muted)]">
            下一次 ISSUE 将划掉 index{" "}
            <span className="font-data text-[var(--ink)]">{formatNumber(featured.nextSerial)}</span>
            ，诞生 serial{" "}
            <span className="font-data text-[var(--ink)]">#{formatNumber(featured.nextSerial)}</span>
          </p>
          <Link href={`/asset/${featured.id}`} className="mt-4 inline-block text-link font-hand text-2xl">
            打开域笔记 →
          </Link>
        </SketchFrame>

        <div className="lg:col-span-2">
          <WalletLayers wallet={walletPreview} />
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <SketchFrame label="出生摘录">
          <div className="mb-2 flex justify-end">
            <Link href="/births" className="text-link font-hand text-xl">全部 →</Link>
          </div>
          <BirthFeed events={birthEvents.slice(0, 3)} compact />
        </SketchFrame>

        <SketchFrame label="区块抽签">
          <p className="font-hand text-xl text-[var(--ink-muted)]">
            区块 {formatNumber(round.revealBlock)} 的 hash 决定 {formatNumber(round.batchSize)} 个中签者，对应 serial{" "}
            {formatNumber(round.serialStart)}–{formatNumber(round.serialEnd)}。
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-3 font-hand text-lg">
            <div>
              <dt className="text-[var(--ink-faint)]">claim 数</dt>
              <dd className="font-data text-base">{formatNumber(round.participants)}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink-faint)]">锚定块</dt>
              <dd className="font-data text-base">{formatNumber(round.anchorBlock)}</dd>
            </div>
          </dl>
          <Link href="/launch" className="btn mt-6 inline-block">
            看分数 & 提交
          </Link>
        </SketchFrame>
      </div>
    </div>
  );
}
