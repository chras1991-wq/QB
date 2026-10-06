import Link from "next/link";
import { ProgressBar } from "@/components/progress-bar";
import { assets, launchRounds } from "@/lib/data";
import { formatNumber, formatPercent, policyLabel } from "@/lib/format";

export default function HomePage() {
  const featured = assets[0];
  const round = launchRounds[0];

  return (
    <div className="grid-glow">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-500/90">
            Post-quantum issuance · Bitcoin ownership
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Every unit has a cryptographic birth certificate.
          </h1>
          <p className="mt-5 text-lg text-zinc-400">
            Not mint amount. One XMSS state consumed → one serial born → ownership on Bitcoin UTXOs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/explorer"
              className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-amber-400"
            >
              Open Explorer
            </Link>
            <Link
              href="/docs"
              className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm text-zinc-200 hover:border-zinc-500"
            >
              Read Protocol
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500">Featured asset</p>
                <h2 className="mt-1 text-2xl font-semibold">{featured.symbol}</h2>
                <p className="text-sm text-zinc-400">{featured.name}</p>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
                PQ Verified
              </span>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Issued</span>
                <span>
                  {formatNumber(featured.issued)} / {formatNumber(featured.maxSerials)} (
                  {formatPercent(featured.issued, featured.maxSerials)})
                </span>
              </div>
              <ProgressBar value={featured.issued} max={featured.maxSerials} />
            </div>
            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-zinc-500">Next serial</dt>
                <dd className="font-mono">#{formatNumber(featured.nextSerial)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Policy</dt>
                <dd>{policyLabel(featured.policy)}</dd>
              </div>
            </dl>
            <Link href={`/asset/${featured.id}`} className="mt-6 inline-block text-sm text-amber-400 hover:text-amber-300">
              View asset →
            </Link>
          </div>

          <div className="card p-5">
            <p className="text-sm text-zinc-500">Fair launch round</p>
            <h3 className="mt-1 text-xl font-semibold">{round.symbol}</h3>
            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="text-zinc-500">BTC anchor block</dt>
                <dd className="font-mono">{formatNumber(round.anchorBlock)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Serials</dt>
                <dd className="font-mono">
                  #{formatNumber(round.serialStart)} — #{formatNumber(round.serialEnd)}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Participants</dt>
                <dd>{formatNumber(round.participants)}</dd>
              </div>
            </dl>
            <Link href="/launch" className="mt-6 block rounded-lg bg-zinc-800 py-2.5 text-center text-sm font-medium hover:bg-zinc-700">
              Enter round
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { title: "PQ = issuance", body: "XMSS signs birth. Transfer uses Bitcoin only." },
            { title: "One root = one asset", body: "Capacity is 2^h under that Genesis root, not global." },
            { title: "Serial + FT", body: "Homogeneous markets with per-unit provenance." },
          ].map((item) => (
            <div key={item.title} className="card p-5">
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
