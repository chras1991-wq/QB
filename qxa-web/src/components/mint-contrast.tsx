export function MintContrast() {
  return (
    <div className="grid gap-10 py-6 md:grid-cols-2 md:gap-14">
      <div className="opacity-75">
        <p className="kicker">Obs. A · balance mint</p>
        <p className="font-display mt-2 text-3xl leading-snug text-[var(--ink-muted)]">
          deploy → mint 1000 → ledger adds a scalar.
        </p>
      </div>
      <div>
        <p className="kicker">Obs. B · QXA</p>
        <p className="font-display mt-2 text-3xl leading-snug">
          Sign index <em>n</em>, burn state, birth <em>#n</em>, bind to chain output.
        </p>
      </div>
    </div>
  );
}
