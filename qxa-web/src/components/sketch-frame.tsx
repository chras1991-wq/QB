import type { ReactNode } from "react";

/** Irregular quadrilateral — reads hand-drawn, not CSS border-radius. */
function WobblyBorder() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-[var(--ink)]"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M 2.5 4.5 L 97 3.2 L 98.5 96.8 L 3.8 97.5 Z"
        fill="var(--paper-elevated)"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
        filter="url(#ink-roughen)"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 2.5 4.5 L 97 3.2 L 98.5 96.8 L 3.8 97.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.35"
        opacity="0.25"
        transform="translate(0.4 0.6)"
        filter="url(#ink-roughen)"
      />
    </svg>
  );
}

export function SketchFrame({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <span
          className="font-hand absolute -top-4 left-5 rotate-[-1.5deg] bg-[var(--paper)] px-2 text-xl text-[var(--ink-muted)]"
          style={{ textDecoration: "underline", textDecorationStyle: "wavy", textDecorationColor: "var(--rule-strong)" }}
        >
          {label}
        </span>
      )}
      <WobblyBorder />
      <div className="relative z-[1] p-5 sm:p-7">{children}</div>
    </div>
  );
}
