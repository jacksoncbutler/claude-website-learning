import type { RadicalItem } from '@/lib/content/types';

/** A radical plus its resolved audio — the shape shared by the table,
 * flashcard, and study-set-picker components (same pattern as pinyin's
 * PinyinTableItem). */
export interface RadicalAudioItem extends RadicalItem {
  audioSrc: string;
  audioAvailable: boolean;
}
