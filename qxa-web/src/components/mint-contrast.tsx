export function MintContrast() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 opacity-60">
        <p className="text-xs uppercase tracking-wider text-zinc-600">Inscription / balance mint</p>
        <div className="mt-3 space-y-2 font-mono text-xs text-zinc-500">
          <p>deploy → mint 1000</p>
          <p>indexer: balance += 1000</p>
        </div>
        <p className="mt-3 text-xs text-zinc-600">No per-unit birth proof. Supply is a spreadsheet cell.</p>
      </div>
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
        <p className="text-xs uppercase tracking-wider text-amber-400/90">QXA serialized issuance</p>
        <div className="mt-3 space-y-2 font-mono text-xs text-zinc-200">
          <p>XMSS.Sign(index=481) → burn state #481</p>
          <p>Unit #481 born @ block · owner UTXO</p>
        </div>
        <p className="mt-3 text-xs text-zinc-400">Each serial is a cryptographic event, not a quantity field.</p>
      </div>
    </div>
  );
}
