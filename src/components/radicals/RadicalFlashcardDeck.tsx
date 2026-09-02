'use client';

import { FlashcardView } from '@/components/views/FlashcardView';
import type { RadicalItem } from '@/lib/content/types';

export function RadicalFlashcardDeck({ radicals }: { radicals: RadicalItem[] }) {
  return (
    <FlashcardView<RadicalItem>
      items={radicals}
      renderFront={(item) => (
        <div className="flex flex-col items-center gap-3">
          <span className="text-6xl font-semibold">{item.simplified}</span>
          <span className="text-lg text-neutral-500">{item.pinyin}</span>
        </div>
      )}
      renderBack={(item) => (
        <div className="flex flex-col items-center gap-2 text-neutral-700">
          <p className="text-lg font-medium">{item.definitions?.join(', ')}</p>
          <p>
            <span className="font-medium">Strokes:</span> {item.strokeCount}
          </p>
          {item.notes && <p className="mt-1 text-sm italic text-neutral-500">{item.notes}</p>}
        </div>
      )}
    />
  );
}
