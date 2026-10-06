import { formatNumber } from "@/lib/format";

type SlotState = "born" | "next" | "future" | "virgin";

export function StateTape({
  issued,
  nextSerial,
  maxPreview = 48,
  highlightSerials = [],
}: {
  issued: number;
  nextSerial: number;
  maxPreview?: number;
  highlightSerials?: number[];
}) {
  const slots = Math.min(maxPreview, Math.max(issued + 4, 24));
  const start = Math.max(0, nextSerial - Math.floor(slots / 2));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>XMSS signing states (consumed → serial born)</span>
        <span className="font-mono text-amber-400/90">head #{formatNumber(nextSerial)}</span>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {Array.from({ length: slots }).map((_, i) => {
          const serial = start + i;
          const highlight = highlightSerials.includes(serial);
          let state: SlotState = "future";
          if (serial < issued) state = "born";
          else if (serial === nextSerial) state = "next";
          else if (issued === 0 && serial === 0) state = "virgin";

          const base =
            "relative h-9 min-w-9 shrink-0 rounded-md border text-center text-[10px] font-mono leading-9";
          const styles = {
            born: "border-zinc-700 bg-zinc-900 text-zinc-500 line-through decoration-red-500/70",
            next: "border-amber-500 bg-amber-500/15 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.25)]",
            future: "border-zinc-800 bg-zinc-950 text-zinc-600",
            virgin: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
          }[state];

          return (
            <div
              key={serial}
              title={`Serial #${serial}${state === "born" ? " · XMSS state burned" : state === "next" ? " · next ISSUE" : ""}`}
              className={`${base} ${styles} ${highlight ? "ring-1 ring-amber-400" : ""}`}
            >
              {serial}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-zinc-600">
        Strikethrough = WOTS+ leaf permanently used. Amber = next signature index. No “mint 1000”.
      </p>
    </div>
  );
}
