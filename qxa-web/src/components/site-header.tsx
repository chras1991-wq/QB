import Link from "next/link";

const links = [
  { href: "/births", label: "Births" },
  { href: "/roots", label: "Roots" },
  { href: "/wallet", label: "Wallet" },
  { href: "/launch", label: "Lottery" },
];

export function SiteHeader() {
  return (
    <header className="relative z-[2] border-b border-[var(--ink)]/15 bg-[var(--paper)]/85 backdrop-blur-sm">
      <div className="page flex h-[4.25rem] items-center justify-between">
        <Link href="/" className="font-display text-4xl font-bold tracking-tight text-[var(--ink)]">
          QXA
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-hand text-xl text-[var(--ink-muted)] hover:text-[var(--ink)]"
              style={{ transform: "rotate(-0.3deg)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/launch" className="btn btn-solid text-lg">
          Next block
        </Link>
      </div>
    </header>
  );
}
