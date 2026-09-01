import Link from 'next/link';

export default function PinyinLandingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Pinyin</h1>
        <p className="mt-1 text-neutral-500">
          Pronunciation and tones — the sounds Mandarin syllables are built from. Pick a way to study.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/pinyin/table"
          className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-brand-500 hover:shadow-sm"
        >
          <h2 className="font-semibold">Syllable Chart</h2>
          <p className="mt-1 text-sm text-neutral-600">
            The full initial × final chart. Click a cell to hear it pronounced.
          </p>
        </Link>
        <Link
          href="/pinyin/flashcards"
          className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-brand-500 hover:shadow-sm"
        >
          <h2 className="font-semibold">Flashcards</h2>
          <p className="mt-1 text-sm text-neutral-600">Drill syllables one at a time, including tone contrasts.</p>
        </Link>
        <Link
          href="/pinyin/listen-and-write"
          className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-brand-500 hover:shadow-sm"
        >
          <h2 className="font-semibold">Listen and Write</h2>
          <p className="mt-1 text-sm text-neutral-600">Hear a syllable and type the pinyin — tracks what needs review.</p>
        </Link>
      </div>
    </div>
  );
}
