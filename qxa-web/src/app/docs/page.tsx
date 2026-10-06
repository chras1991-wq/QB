import Link from "next/link";

const ops = [
  { code: "GENESIS", desc: "Bind one XMSS root to one AssetID." },
  { code: "ISSUE", desc: "Consume signing state #n; birth serial #n." },
  { code: "TRANSFER", desc: "Move ownership via Bitcoin UTXO spend." },
  { code: "CLOSE", desc: "Stop further issuance." },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">Protocol</h1>
      <p className="mt-2 text-zinc-400">QXA V1 — preview site mirrors the repo spec.</p>

      <div className="card mt-8 p-5">
        <h2 className="font-medium">Operations</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {ops.map((o) => (
            <li key={o.code} className="flex gap-3">
              <span className="font-mono text-amber-400">{o.code}</span>
              <span className="text-zinc-300">{o.desc}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card mt-4 space-y-2 p-5 text-sm text-zinc-400">
        <p>Bitcoin: ordering, ownership, DA.</p>
        <p>XMSS: issuance authority only.</p>
        <p>Reorg: Bitcoin issuance may revert; XMSS index never reused.</p>
      </div>

      <Link
        href="https://github.com/chras1991-wq/QB/tree/main/qxa-spec"
        className="mt-6 inline-block text-sm text-amber-400 hover:text-amber-300"
      >
        Full spec on GitHub →
      </Link>
    </div>
  );
}
