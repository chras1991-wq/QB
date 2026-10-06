/** Hand-drawn lab diagram: XMSS burn → serial → UTXO */
export function IssueSchematic() {
  return (
    <svg viewBox="0 0 520 120" className="w-full max-w-xl text-[var(--ink)]" aria-label="Issuance schematic">
      <g filter="url(#ink-roughen)" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <rect x="8" y="28" width="88" height="64" rx="2" />
        <text x="52" y="52" textAnchor="middle" className="font-hand fill-[var(--ink)] text-[11px]" stroke="none">
          XMSS
        </text>
        <text x="52" y="72" textAnchor="middle" className="font-data fill-[var(--ink-muted)] text-[9px]" stroke="none">
          idx n
        </text>

        <path d="M 108 60 H 155" markerEnd="url(#arrowhead)" />
        <text x="130" y="48" textAnchor="middle" className="font-hand fill-[var(--ink-faint)] text-[10px]" stroke="none">
          burn
        </text>

        <rect x="158" y="28" width="88" height="64" rx="2" />
        <text x="202" y="58" textAnchor="middle" className="font-hand fill-[var(--ink)] text-[11px]" stroke="none">
          Unit #n
        </text>

        <path d="M 254 60 H 301" />
        <text x="276" y="48" textAnchor="middle" className="font-hand fill-[var(--ink-faint)] text-[10px]" stroke="none">
          bind
        </text>

        <rect x="304" y="28" width="100" height="64" rx="2" />
        <text x="354" y="52" textAnchor="middle" className="font-hand fill-[var(--ink)] text-[11px]" stroke="none">
          Bitcoin
        </text>
        <text x="354" y="72" textAnchor="middle" className="font-data fill-[var(--ink-muted)] text-[9px]" stroke="none">
          UTXO
        </text>

        <path d="M 412 60 H 455" strokeDasharray="4 3" />
        <text x="478" y="64" className="font-hand fill-[var(--ink-muted)] text-[10px]" stroke="none">
          transfer
        </text>
        <text x="478" y="78" className="font-hand fill-[var(--ink-faint)] text-[9px]" stroke="none">
          (no PQ)
        </text>
      </g>
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill="var(--ink)" />
        </marker>
      </defs>
    </svg>
  );
}
