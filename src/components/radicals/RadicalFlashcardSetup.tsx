'use client';

import { useState } from 'react';
import { RadicalFlashcardDeck } from './RadicalFlashcardDeck';
import { RadicalStudySetPicker } from './RadicalStudySetPicker';
import type { RadicalAudioItem } from './types';

export function RadicalFlashcardSetup({ radicals }: { radicals: RadicalAudioItem[] }) {
  const [activeItems, setActiveItems] = useState<RadicalAudioItem[] | null>(null);

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
