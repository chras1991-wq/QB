import Link from "next/link";

const links = [
  { href: "/births", label: "Births" },
  { href: "/roots", label: "Roots" },
  { href: "/wallet", label: "Wallet" },
  { href: "/launch", label: "Lottery" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#070707]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-amber-500 text-xs font-bold text-black">
            QX
          </span>
          <span>QXA</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-zinc-100">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/launch"
          className="rounded-full bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-black transition hover:bg-amber-400"
        >
          Next block
        </Link>
      </div>
    </header>
  );
}
