import type { QuizItem } from './types';

export function normalizeAnswer(input: string): string {
  return input.trim().toLowerCase();
}

/**
 * Exact match against the item's accepted answers (already normalized),
 * after normalizing the input the same way. Deliberately not lenient about
 * tone (e.g. typing "ma" for any tone of "ma" is wrong) — the point of a
 * listening quiz is to test that the tone was heard correctly too.
 */
export function isCorrectAnswer(input: string, item: Pick<QuizItem, 'acceptedAnswers'>): boolean {
  const normalized = normalizeAnswer(input);
  if (!normalized) return false;
  return item.acceptedAnswers.includes(normalized);
}
