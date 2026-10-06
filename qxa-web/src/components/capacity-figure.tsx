import { formatNumber } from "@/lib/format";

export function CapacityFigure({
  issued,
  max,
  caption = "indexes consumed",
}: {
  issued: number;
  max: number;
  caption?: string;
}) {
  return (
    <div className="flex flex-wrap items-end gap-x-8 gap-y-2">
      <div>
        <p className="font-hand text-lg text-[var(--ink-muted)]">{caption}</p>
        <p className="font-display mt-1 text-5xl leading-none tracking-tight sm:text-6xl">{formatNumber(issued)}</p>
      </div>
      <div className="pb-1">
        <svg width="48" height="24" viewBox="0 0 48 24" className="text-[var(--ink)]" aria-hidden>
          <line x1="0" y1="12" x2="48" y2="12" stroke="currentColor" strokeWidth="1.2" filter="url(#ink-roughen)" />
        </svg>
        <p className="font-data text-sm text-[var(--ink-muted)]">of {formatNumber(max)}</p>
      </div>
    </div>
  );
}
