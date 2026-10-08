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
        <p className="font-hand text-xl text-[var(--ink-muted)]">图 1 · XMSS 索引场（抽样）</p>
        <p className="font-hand text-lg text-[var(--ink-muted)]">
          笔尖 <span className="font-data text-[var(--ink)]">{formatNumber(nextSerial)}</span>
        </p>
      </div>
      <svg
        className="mt-3 w-full border-2 border-[var(--ink)] text-[var(--ink)]"
        style={{ height: 40, filter: "url(#ink-roughen)" }}
        viewBox={`0 0 ${buckets} 10`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`${issued} indexes consumed`}
      >
        {cells.map((state, i) => (
          <rect
            key={i}
            x={i}
            y={0}
            width={1}
            height={10}
            fill={
              state === "burned"
                ? "url(#hatch)"
                : state === "head"
                  ? "var(--ink)"
                  : "var(--paper-elevated)"
            }
            stroke="var(--ink)"
            strokeWidth={0.06}
            opacity={state === "open" ? 0.2 : 1}
          />
        ))}
      </svg>
      <p className="mt-3 font-hand text-lg leading-snug text-[var(--ink-muted)]">
        斜线 = 已耗尽的签名态；黑块 = 下一刀 ISSUE。不是进度条。
      </p>
    </div>
  );
}
