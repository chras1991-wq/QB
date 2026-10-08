export function IssueSchematic() {
  return (
    <svg viewBox="0 0 520 130" className="w-full max-w-2xl text-[var(--ink)]" aria-label="Issuance schematic">
      <g filter="url(#ink-roughen)" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 10 32 Q 8 28, 12 26 L 90 24 Q 96 24, 94 32 L 92 88 Q 90 94, 14 92 L 10 32 Z" />
        <path d="M 160 26 Q 156 22, 164 24 L 238 22 Q 244 22, 242 30 L 240 90 Q 238 96, 162 94 L 160 26 Z" />
        <path d="M 306 24 Q 302 20, 310 22 L 396 20 Q 402 20, 400 28 L 398 88 Q 396 94, 308 92 L 306 24 Z" />

        <path d="M 98 58 Q 120 52, 152 58" markerEnd="url(#arrowhead)" />
        <path d="M 246 58 Q 268 62, 298 58" markerEnd="url(#arrowhead)" />
        <path d="M 404 58 Q 430 54, 448 58" strokeDasharray="5 4" />

        <text x="52" y="58" textAnchor="middle" fill="var(--ink)" stroke="none" style={{ fontFamily: "var(--font-caveat)", fontSize: 18 }}>
          XMSS
        </text>
        <text x="52" y="78" textAnchor="middle" fill="var(--ink-muted)" stroke="none" style={{ fontFamily: "var(--font-patrick-hand)", fontSize: 13 }}>
          idx n
        </text>
        <text x="200" y="62" textAnchor="middle" fill="var(--ink)" stroke="none" style={{ fontFamily: "var(--font-caveat)", fontSize: 17 }}>
          Unit #n
        </text>
        <text x="352" y="58" textAnchor="middle" fill="var(--ink)" stroke="none" style={{ fontFamily: "var(--font-caveat)", fontSize: 18 }}>
          Bitcoin
        </text>
        <text x="352" y="78" textAnchor="middle" fill="var(--ink-muted)" stroke="none" style={{ fontFamily: "var(--font-patrick-hand)", fontSize: 12 }}>
          UTXO
        </text>
        <text x="128" y="48" textAnchor="middle" fill="var(--ink-faint)" stroke="none" style={{ fontFamily: "var(--font-patrick-hand)", fontSize: 14 }}>
          burn
        </text>
        <text x="272" y="48" textAnchor="middle" fill="var(--ink-faint)" stroke="none" style={{ fontFamily: "var(--font-patrick-hand)", fontSize: 14 }}>
          bind
        </text>
        <text x="478" y="62" fill="var(--ink-muted)" stroke="none" style={{ fontFamily: "var(--font-patrick-hand)", fontSize: 14 }}>
          transfer
        </text>
        <text x="478" y="78" fill="var(--ink-faint)" stroke="none" style={{ fontFamily: "var(--font-patrick-hand)", fontSize: 12 }}>
          (no PQ)
        </text>
      </g>
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,1 L7,3 L0,5 Z" fill="var(--ink)" filter="url(#ink-roughen)" />
        </marker>
      </defs>
    </svg>
  );
}
