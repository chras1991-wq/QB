"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300 transition hover:border-amber-500/50 hover:text-amber-200"
    >
      {done ? "Copied" : label}
    </button>
  );
}
