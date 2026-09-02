'use client';

import { useState } from 'react';
import { PinyinFlashcardDeck } from './PinyinFlashcardDeck';
import { PinyinStudySetPicker } from './PinyinStudySetPicker';
import type { PinyinTableItem } from './PinyinTableClient';

interface PinyinFlashcardSetupProps {
  items: PinyinTableItem[];
  initials: { id: string; symbol: string }[];
  finals: { id: string; symbol: string }[];
}

export function PinyinFlashcardSetup({ items, initials, finals }: PinyinFlashcardSetupProps) {
  const [activeItems, setActiveItems] = useState<PinyinTableItem[] | null>(null);

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
        <PinyinFlashcardDeck items={activeItems} />
      </div>
    );
  }

  // Unlike Listen and Write, flashcards work fine without audio (the play
  // button just shows disabled), so every syllable is a valid candidate —
  // no audioAvailable filter before handing items to the picker.
  return (
    <PinyinStudySetPicker
      items={items}
      initials={initials}
      finals={finals}
      startLabel="Start flashcards"
      onStart={setActiveItems}
    />
  );
}
