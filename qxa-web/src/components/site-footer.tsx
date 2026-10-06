export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800/80 py-10 text-sm text-zinc-500">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>QXA — Cryptographically Serialized Assets on Bitcoin</p>
        <p className="text-xs text-zinc-600">
          RFC 8391 XMSS issuance · NIST SP 800-208 not claimed · Signet preview
        </p>
      </div>
    </footer>
  );
}
