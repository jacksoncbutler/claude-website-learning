/**
 * Content-agnostic shape for a "listen and write" quiz item — deliberately
 * has no pinyin-specific fields, so this quiz engine is reusable later for
 * e.g. an HSK vocab "hear it, type the meaning" quiz. Modules map their own
 * data into this shape (see PinyinListenAndWriteSetup for the pinyin case).
 */
export interface QuizItem {
  id: string;
  audioSrc: string;
  audioAvailable: boolean;
  /** Normalized (trimmed, lowercased) accepted answers — at least one. */
  acceptedAnswers: string[];
  /** What to reveal once answered or given up on, e.g. "mā (妈)". */
  displayAnswer: string;
}

export interface QuizItemStats {
  playCount: number;
  incorrectCount: number;
}
