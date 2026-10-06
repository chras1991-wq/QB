import Link from "next/link";
import { ProgressBar } from "@/components/progress-bar";
import { assets } from "@/lib/data";
import { formatNumber, formatPercent, policyLabel, truncateMiddle } from "@/lib/format";

export default function ExplorerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Explorer</h1>
        <p className="mt-2 text-zinc-400">Genesis roots, issuance progress, and PQ proofs.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900/80 text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Issued</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">PQ Root</th>
              <th className="px-4 py-3 font-medium">Policy</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.id} className="border-t border-zinc-800/80 hover:bg-zinc-900/40">
                <td className="px-4 py-4">
                  <div className="font-semibold">{a.symbol}</div>
                  <div className="text-xs text-zinc-500">{a.name}</div>
                </td>
                <td className="hidden px-4 py-4 md:table-cell">
                  <div className="mb-1.5 w-40">
                    <ProgressBar value={a.issued} max={a.maxSerials} />
                  </div>
                  <div className="text-xs text-zinc-400">
                    {formatNumber(a.issued)} / {formatNumber(a.maxSerials)} ({formatPercent(a.issued, a.maxSerials)})
                  </div>
                </td>
                <td className="hidden px-4 py-4 font-mono text-xs text-zinc-400 lg:table-cell">
                  {truncateMiddle(a.pqRoot, 10, 10)}
                </td>
                <td className="px-4 py-4 text-zinc-300">{policyLabel(a.policy)}</td>
                <td className="px-4 py-4 text-right">
                  <Link href={`/asset/${a.id}`} className="text-amber-400 hover:text-amber-300">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
