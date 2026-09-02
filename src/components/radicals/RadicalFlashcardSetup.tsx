'use client';

import { useState } from 'react';
import { RadicalFlashcardDeck } from './RadicalFlashcardDeck';
import { RadicalStudySetPicker } from './RadicalStudySetPicker';
import type { RadicalItem } from '@/lib/content/types';

export function RadicalFlashcardSetup({ radicals }: { radicals: RadicalItem[] }) {
  const [activeItems, setActiveItems] = useState<RadicalItem[] | null>(null);

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
        <RadicalFlashcardDeck radicals={activeItems} />
      </div>
    );
  }

  return <RadicalStudySetPicker items={radicals} startLabel="Start flashcards" onStart={setActiveItems} />;
}
