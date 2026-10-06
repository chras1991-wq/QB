import { RootCard } from "@/components/root-card";
import { assets } from "@/lib/data";

export default function RootsPage() {
  const sorted = [...assets].sort((a, b) => {
    if (a.issued === 0 && b.issued > 0) return -1;
    if (b.issued === 0 && a.issued > 0) return 1;
    return b.issued / b.maxSerials - a.issued / a.maxSerials;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">Genesis roots</h1>
      <p className="mt-2 max-w-2xl text-zinc-400">
        Each root is its own asset domain. Capacity is 2<sup>h</sup> XMSS states — not a global mint cap. A new root cannot inflate an existing asset.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((a) => (
          <RootCard key={a.id} asset={a} />
        ))}
      </div>
    </div>
  );
}
