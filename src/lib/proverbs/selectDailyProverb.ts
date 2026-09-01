import type { Proverb } from '@/lib/content/types';

/**
 * Deterministically picks "today's" proverb: the same proverb is returned
 * for every call made on the same calendar day, and it changes the next
 * day. No randomness, so reloading the dashboard never changes the pick
 * mid-day.
 *
 * Known limitation: if this site is ever statically exported, `new Date()`
 * would be evaluated once at build time rather than per-request. Not a
 * concern for `next dev`/a dynamically-rendered deployment; revisit only if
 * static export is actually chosen later.
 */
export function getDailyProverb(proverbs: Proverb[], date: Date = new Date()): Proverb {
  if (proverbs.length === 0) {
    throw new Error('getDailyProverb: proverbs list is empty');
  }
  const dayKey = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
  const index = hashString(dayKey) % proverbs.length;
  return proverbs[index];
}

/** Simple, deterministic, unsigned string hash (djb2-ish). */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(hash, 31) + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}
