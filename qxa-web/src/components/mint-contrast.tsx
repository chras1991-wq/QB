export function MintContrast() {
  return (
    <div className="grid gap-10 py-6 md:grid-cols-2 md:gap-14">
      <div className="opacity-75">
        <p className="kicker">对照 A · 铭文余额</p>
        <p className="font-display mt-2 text-3xl leading-snug text-[var(--ink-muted)]">
          deploy → mint 1000 → 账本加一个数。
        </p>
      </div>
      <div>
        <p className="kicker">对照 B · QXA</p>
        <p className="font-display mt-2 text-3xl leading-snug">
          签 index <em>n</em>，划掉状态，出生 <em>#n</em>，绑到链上输出。
        </p>
      </div>
    </div>
  );
}
