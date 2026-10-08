import { BirthFeed } from "@/components/birth-feed";
import { SketchFrame } from "@/components/sketch-frame";
import { loadBirthEvents } from "@/lib/catalog";

export default async function BirthsPage() {
  const birthEvents = await loadBirthEvents();
  return (
    <div className="page max-w-3xl py-12">
      <h1 className="font-display text-4xl">Birth log</h1>
      <p className="mt-3 font-hand text-xl text-[var(--ink-muted)]">
        Chronological ISSUE events — index burned, serial born, output bound.
      </p>
      <SketchFrame className="mt-8" label="register">
        <BirthFeed events={birthEvents} />
      </SketchFrame>
    </div>
  );
}
