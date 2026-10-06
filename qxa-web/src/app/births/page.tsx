import { BirthFeed } from "@/components/birth-feed";
import { birthEvents } from "@/lib/data";

export default function BirthsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">Birth ledger</h1>
      <p className="mt-2 text-zinc-400">
        Chronological ISSUE events: XMSS index burned → serial born → Bitcoin UTXO owner. No batch mint rows.
      </p>
      <div className="card mt-8 px-5">
        <BirthFeed events={birthEvents} />
      </div>
    </div>
  );
}
