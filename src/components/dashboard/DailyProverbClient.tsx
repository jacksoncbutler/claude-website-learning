'use client';

import { useEffect, useState } from 'react';
import type { Proverb } from '@/lib/content/types';
import { getDailyProverb } from '@/lib/proverbs/selectDailyProverb';

/**
 * On a statically-exported site (GitHub Pages), the HTML is only as fresh
 * as the last deploy — `new Date()` evaluated on the server would freeze at
 * build time and never advance. Computing "today" on the client instead
 * means the proverb is always correct for the viewer's actual date, with no
 * rebuild required. Rendered after mount (not during SSR) to avoid a
 * server/client markup mismatch, with a brief skeleton in between.
 */
export function DailyProverbClient({ proverbs }: { proverbs: Proverb[] }) {
  const [proverb, setProverb] = useState<Proverb | null>(null);

  useEffect(() => {
    setProverb(getDailyProverb(proverbs));
  }, [proverbs]);

  return (
    <div className="rounded-xl border border-brand-100 bg-brand-50 p-5">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-700">Proverb of the Day</h2>
      {proverb ? (
        <>
          <p className="text-2xl font-medium text-neutral-900">{proverb.hanzi}</p>
          {proverb.pinyin && <p className="mt-1 text-neutral-600">{proverb.pinyin}</p>}
          {proverb.translation && <p className="mt-2 text-sm text-neutral-500">{proverb.translation}</p>}
        </>
      ) : (
        <div className="animate-pulse" aria-hidden="true">
          <div className="h-8 w-40 rounded bg-brand-100" />
          <div className="mt-2 h-4 w-56 rounded bg-brand-100" />
        </div>
      )}
    </div>
  );
}
