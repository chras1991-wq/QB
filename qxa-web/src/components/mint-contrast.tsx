export function MintContrast() {
  return (
    <div className="grid gap-8 py-8 md:grid-cols-2 md:gap-12">
      <div>
        <p className="kicker">Obs. A — balance mint</p>
        <p className="font-display mt-2 text-xl leading-relaxed text-[var(--ink-muted)]">
          deploy → mint 1000 → ledger adds a scalar. Units are not born individually.
        </p>
      </div>
      <div>
        <p className="kicker">Obs. B — QXA issue</p>
        <p className="font-display mt-2 text-xl leading-relaxed">
          Sign index <em>n</em>, burn state, issue serial <em>#n</em>, attach Bitcoin output. Each event is observable.
        </p>
      </div>
    </div>
  );
}
