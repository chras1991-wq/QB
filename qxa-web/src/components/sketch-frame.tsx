import type { ReactNode } from "react";

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
        <span className="font-hand absolute -top-3 left-4 bg-[var(--paper)] px-2 text-sm text-[var(--ink-muted)]">
          {label}
        </span>
      )}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-[var(--ink)]"
        preserveAspectRatio="none"
        aria-hidden
      >
        <rect
          x="1.5%"
          y="1.5%"
          width="97%"
          height="97%"
          fill="var(--paper-elevated)"
          stroke="currentColor"
          strokeWidth="1.4"
          rx="2"
          ry="2"
          filter="url(#ink-roughen)"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative z-[1] p-5 sm:p-6">{children}</div>
    </div>
  );
}
