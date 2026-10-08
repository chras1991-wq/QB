"use client";

import { useState } from "react";

export function CopyButton({ text, label = "copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  }

  return (
    <button type="button" onClick={copy} className="font-hand text-sm text-[var(--accent)] underline decoration-wavy">
      {done ? "copied" : label}
    </button>
  );
}
