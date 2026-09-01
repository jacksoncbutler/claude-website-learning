import { getProverbs } from '@/lib/content/loaders';
import { getDailyProverb } from '@/lib/proverbs/selectDailyProverb';

export function DailyProverb() {
  const proverb = getDailyProverb(getProverbs());

  return (
    <div className="rounded-xl border border-brand-100 bg-brand-50 p-5">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-700">Proverb of the Day</h2>
      <p className="text-2xl font-medium text-neutral-900">{proverb.hanzi}</p>
      {proverb.pinyin && <p className="mt-1 text-neutral-600">{proverb.pinyin}</p>}
      {proverb.translation && <p className="mt-2 text-sm text-neutral-500">{proverb.translation}</p>}
    </div>
  );
}
