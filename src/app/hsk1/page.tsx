import Link from 'next/link';

export default function Hsk1LandingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">HSK 1</h1>
        <p className="mt-1 text-neutral-500">The first 150 words — basic communication vocabulary.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/hsk1/table"
          className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-brand-500 hover:shadow-sm"
        >
          <h2 className="font-semibold">Word Table</h2>
          <p className="mt-1 text-sm text-neutral-600">Browse all 150 words, grouped by part of speech.</p>
        </Link>
        <Link
          href="/hsk1/flashcards"
          className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-brand-500 hover:shadow-sm"
        >
          <h2 className="font-semibold">Flashcards</h2>
          <p className="mt-1 text-sm text-neutral-600">Drill words one at a time.</p>
        </Link>
      </div>
    </div>
  );
}
