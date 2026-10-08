import type { ReactNode } from "react";

export function HandTitle({ children, as = "h1" }: { children: ReactNode; as?: "h1" | "h2" }) {
  const Tag = as;
  return (
    <div className="relative inline-block max-w-full">
      <Tag className="font-display text-[var(--ink)] leading-tight tracking-tight">{children}</Tag>
      <svg
        className="mt-1 w-full text-[var(--ink)]"
        viewBox="0 0 200 8"
        preserveAspectRatio="none"
        aria-hidden
        style={{ height: 6 }}
      >
        <path
          d="M 2 5 Q 40 2, 90 6 T 198 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          filter="url(#ink-roughen)"
        />
      </svg>
    </div>
  );
}
