/**
 * Shared content model for every learning module (pinyin, radicals, hanzi,
 * vocab, phrases, ...). One `LearningItem` shape is reused across the whole
 * site so that new modules only need new data + a `kind`, not a new schema.
 *
 * Keep new fields OPTIONAL when extending this type — existing JSON data
 * files must keep validating without changes.
 */

/** Extend this union as new content modules are added (radicals, hanzi, ...). */
export type ItemKind = 'pinyin-syllable' | 'radical' | 'hanzi' | 'word' | 'phrase';

export interface ExampleSentence {
  hanzi: string;
  pinyin?: string;
  translation?: string;
}

export interface LearningItem {
  /** Stable, unique, human-readable id, e.g. "pinyin-ma1", "hanzi-ni3-you3". */
  id: string;
  kind: ItemKind;

  // --- Phonetics -----------------------------------------------------
  /** Pinyin with tone marks, e.g. "mā". */
  pinyin?: string;
  /** Pinyin with trailing tone number, e.g. "ma1". */
  pinyinNumeric?: string;
  /** 1-4 = the four tones, 5 = neutral tone. */
  toneNumber?: 1 | 2 | 3 | 4 | 5;

  // --- Written forms ---------------------------------------------------
  simplified?: string;
  traditional?: string;

  // --- Meaning / grammar -------------------------------------------------
  definitions?: string[];
  partOfSpeech?: string[];

  // --- Curriculum placement -----------------------------------------------
  hskLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Stroke count — used by radicals (and later hanzi) for grouping/sorting. */
  strokeCount?: number;

  // --- Composition (radicals / hanzi) --------------------------------------
  /** ids of component LearningItems this item is built from (e.g. radicals). */
  radicalComponents?: string[];
  /** ids of related items (other tones of the same syllable, synonyms, ...). */
  relatedItemIds?: string[];

  // --- Study aids ------------------------------------------------------
  exampleSentences?: ExampleSentence[];
  mnemonic?: string;
  notes?: string;
  tags?: string[];
  source?: string;

  // --- Audio (reference, not inline; see AudioAsset) -----------------------
  /** id of an AudioAsset in the audio registry; may be absent (audio TBD). */
  audioId?: string;

  // --- Bookkeeping -----------------------------------------------------
  createdAt?: string;
  updatedAt?: string;
}

/** Pinyin-specific shape layered on top of the shared LearningItem. */
export interface PinyinSyllableItem extends LearningItem {
  kind: 'pinyin-syllable';
  /** Initial consonant, '' for zero-initial syllables (e.g. "an"). */
  initial: string;
  /** Final (vowel/nasal cluster), e.g. "a", "ang", "ia". */
  final: string;
  /** Toneless syllable, e.g. "ma" — used to group tones together in a grid. */
  syllableBase: string;
  toneNumber: 1 | 2 | 3 | 4 | 5;
  pinyin: string;
  pinyinNumeric: string;
}

/** Radical-specific shape layered on top of the shared LearningItem. */
export interface RadicalItem extends LearningItem {
  kind: 'radical';
  /** Standard Kangxi radical number (1-214) — a stable, well-known ordering. */
  kangxiNumber: number;
  simplified: string;
  traditional: string;
  pinyin: string;
  pinyinNumeric: string;
  strokeCount: number;
}

/**
 * A single recorded audio file, referenced by id from one or more
 * LearningItems. Kept separate from content data so multiple items can
 * share a recording and file metadata lives in one place.
 */
export interface AudioAsset {
  id: string;
  /** Path relative to /public/audio, e.g. "pinyin/ma1.mp3". */
  file: string;
  voice?: string;
  source?: string;
  createdAt?: string;
}

export interface Proverb {
  id: string;
  hanzi: string;
  pinyin?: string;
  translation?: string;
  source?: string;
}

export type ModuleStatus = 'available' | 'coming-soon';

export interface ModuleDefinition {
  id: string;
  title: string;
  description: string;
  route: string;
  status: ModuleStatus;
}
