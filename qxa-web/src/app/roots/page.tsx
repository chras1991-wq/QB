import { RootCard } from "@/components/root-card";
import { loadAssets } from "@/lib/catalog";

export default async function RootsPage() {
  const assets = await loadAssets();
  const sorted = [...assets].sort((a, b) => {
    if (a.issued === 0 && b.issued > 0) return -1;
    if (b.issued === 0 && a.issued > 0) return 1;
    return b.issued / b.maxSerials - a.issued / a.maxSerials;
  });

  return (
    <div className="page py-12">
      <h1 className="font-display text-4xl">Genesis roots</h1>
      <p className="mt-3 max-w-xl font-hand text-xl text-[var(--ink-muted)]">
        One root per asset domain. Capacity is finite in the tree — not a global mint knob.
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {sorted.map((a) => (
          <RootCard key={a.id} asset={a} />
        ))}
      </div>
    </div>
  );
}
