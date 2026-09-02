import Link from 'next/link';

export default function RadicalsLandingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Radicals</h1>
        <p className="mt-1 text-neutral-500">
          The building blocks characters are made from — the 100 most common, grouped by stroke count.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/radicals/table"
          className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-brand-500 hover:shadow-sm"
        >
          <h2 className="font-semibold">Radical Table</h2>
          <p className="mt-1 text-sm text-neutral-600">Browse all 100, grouped by stroke count.</p>
        </Link>
        <Link
          href="/radicals/flashcards"
          className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-brand-500 hover:shadow-sm"
        >
          <h2 className="font-semibold">Flashcards</h2>
          <p className="mt-1 text-sm text-neutral-600">Drill radicals one at a time.</p>
        </Link>
      </div>
    </div>
  );
}
