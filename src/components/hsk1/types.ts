import type { LearningItem } from '@/lib/content/types';

/** An HSK1 word plus its resolved audio — same pattern as pinyin's
 * PinyinTableItem and radicals' RadicalAudioItem. */
export interface Hsk1AudioItem extends LearningItem {
  simplified: string;
  pinyin: string;
  pinyinNumeric: string;
  audioSrc: string;
  audioAvailable: boolean;
}
