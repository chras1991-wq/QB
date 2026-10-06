export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--ink)]/15">
      <div className="page flex flex-col gap-1 py-10 font-hand text-lg text-[var(--ink-muted)] sm:flex-row sm:justify-between">
        <p>Field notes · serialized issuance on Bitcoin</p>
        <p className="font-data text-xs">XMSS RFC 8391 · preview</p>
      </div>
    </footer>
  );
}
