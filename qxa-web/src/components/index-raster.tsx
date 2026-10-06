import { formatNumber } from "@/lib/format";

export function IndexRaster({
  issued,
  nextSerial,
  maxSerials,
  buckets = 72,
}: {
  issued: number;
  nextSerial: number;
  maxSerials: number;
  buckets?: number;
}) {
  const cells = Array.from({ length: buckets }, (_, i) => {
    const start = Math.floor((i / buckets) * maxSerials);
    const end = Math.floor(((i + 1) / buckets) * maxSerials);
    const mid = (start + end) / 2;
    if (end <= issued) return "burned";
    if (mid >= nextSerial && start <= nextSerial) return "head";
    return "open";
  });

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="kicker">Fig. 1 — XMSS index field (resampled)</p>
        <p className="font-hand text-sm text-[var(--ink-muted)]">
          head <span className="font-data text-[var(--ink)]">{formatNumber(nextSerial)}</span>
        </p>
      </div>
      <svg
        className="mt-3 w-full border border-[var(--ink)] text-[var(--ink)]"
        style={{ height: 36, filter: "url(#ink-roughen)" }}
        viewBox={`0 0 ${buckets} 8`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`${issued} indexes consumed of ${maxSerials}`}
      >
        {cells.map((state, i) => (
          <rect
            key={i}
            x={i}
            y={0}
            width={1}
            height={8}
            fill={
              state === "burned"
                ? "url(#hatch)"
                : state === "head"
                  ? "var(--ink)"
                  : "var(--paper-elevated)"
            }
            stroke="var(--ink)"
            strokeWidth={0.05}
            opacity={state === "open" ? 0.25 : 1}
          />
        ))}
      </svg>
      <p className="mt-2 font-hand text-sm leading-snug text-[var(--ink-muted)]">
        Hatched cells = consumed signing states. Solid tick = next ISSUE. Not a supply bar.
      </p>
    </div>
  );
}
