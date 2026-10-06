import Link from "next/link";

const links = [
  { href: "/births", label: "Births" },
  { href: "/roots", label: "Roots" },
  { href: "/wallet", label: "Wallet" },
  { href: "/launch", label: "Lottery" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--ink)]/20 bg-[var(--paper)]/90 backdrop-blur-sm">
      <div className="page flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-2xl text-[var(--ink)]">
          QXA
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="font-hand text-lg text-[var(--ink-muted)] hover:text-[var(--ink)]">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/launch" className="btn btn-solid">
          next block
        </Link>
      </div>
    </header>
  );
}
