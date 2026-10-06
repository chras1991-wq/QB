import Link from "next/link";
import { SketchFrame } from "@/components/sketch-frame";

const ops = [
  { code: "GENESIS", desc: "One XMSS root bound to one AssetID." },
  { code: "ISSUE", desc: "Burn index n; birth serial #n." },
  { code: "TRANSFER", desc: "UTXO ownership only." },
  { code: "CLOSE", desc: "Cease issuance." },
];

export default function DocsPage() {
  return (
    <div className="page max-w-2xl py-12">
      <h1 className="font-display text-4xl">Protocol notes</h1>
      <SketchFrame className="mt-8" label="operations">
        <ul className="space-y-4 font-hand text-lg">
          {ops.map((o) => (
            <li key={o.code}>
              <span className="font-data text-[var(--accent)]">{o.code}</span> — {o.desc}
            </li>
          ))}
        </ul>
      </SketchFrame>
      <p className="mt-6 font-hand text-lg text-[var(--ink-muted)]">
        Reorg may revert Bitcoin birth; XMSS index never reused.
      </p>
      <Link href="https://github.com/chras1991-wq/QB/tree/main/qxa-spec" className="mt-6 inline-block text-link font-hand text-xl">
        full spec →
      </Link>
    </div>
  );
}
