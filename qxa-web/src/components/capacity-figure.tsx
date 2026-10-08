import { formatNumber } from "@/lib/format";

export function CapacityFigure({
  issued,
  max,
  caption = "Indexes consumed",
}: {
  issued: number;
  max: number;
  caption?: string;
}) {
  return (
    <div className="flex flex-wrap items-end gap-x-10 gap-y-3">
      <div>
        <p className="kicker">{caption}</p>
        <p className="font-display mt-1 text-6xl leading-none sm:text-7xl" style={{ filter: "url(#pencil-smudge)" }}>
          {formatNumber(issued)}
        </p>
      </div>
      <div className="pb-2">
        <svg width="56" height="28" viewBox="0 0 56 28" className="text-[var(--ink)]" aria-hidden>
          <path
            d="M 0 14 Q 18 8, 28 16 T 56 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            filter="url(#ink-roughen)"
          />
        </svg>
        <p className="font-hand text-xl text-[var(--ink-muted)]">
          of <span className="font-data text-base">{formatNumber(max)}</span> slots
        </p>
      </div>
    </div>
  );
}
