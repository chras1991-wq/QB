export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
