'use client';

import { useState } from 'react';
import { Hsk1FlashcardDeck } from './Hsk1FlashcardDeck';
import { Hsk1StudySetPicker } from './Hsk1StudySetPicker';
import type { Hsk1AudioItem } from './types';

export function Hsk1FlashcardSetup({ words }: { words: Hsk1AudioItem[] }) {
  const [activeItems, setActiveItems] = useState<Hsk1AudioItem[] | null>(null);

  if (activeItems) {
    return (
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setActiveItems(null)}
          className="inline-flex w-fit items-center gap-1 text-sm text-neutral-500 hover:text-brand-600"
        >
          ← Change study set
        </button>
        <Hsk1FlashcardDeck words={activeItems} />
      </div>
    );
  }

  return <Hsk1StudySetPicker items={words} startLabel="Start flashcards" onStart={setActiveItems} />;
}
