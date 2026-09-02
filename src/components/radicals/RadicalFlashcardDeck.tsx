'use client';

import { FlashcardView } from '@/components/views/FlashcardView';
import type { RadicalItem } from '@/lib/content/types';

/** Front: just the radical. Back: pronunciation and meaning. */
export function RadicalFlashcardDeck({ radicals }: { radicals: RadicalItem[] }) {
  return (
    <FlashcardView<RadicalItem>
      items={radicals}
      renderFront={(item) => <span className="text-7xl font-semibold">{item.simplified}</span>}
      renderBack={(item) => (
        <div className="flex flex-col items-center gap-2 text-neutral-700">
          <p className="text-2xl font-medium">{item.pinyin}</p>
          <p className="text-lg">{item.definitions?.join(', ')}</p>
          <p className="mt-1 text-sm text-neutral-500">
            {item.strokeCount} stroke{item.strokeCount === 1 ? '' : 's'}
          </p>
          {item.notes && <p className="mt-1 text-sm italic text-neutral-500">{item.notes}</p>}
        </div>
      )}
    />
  );
}
