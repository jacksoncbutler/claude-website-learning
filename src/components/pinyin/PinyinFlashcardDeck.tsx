'use client';

import { FlashcardView } from '@/components/views/FlashcardView';
import { AudioButton } from '@/components/audio/AudioButton';
import type { PinyinSyllableItem } from '@/lib/content/types';

/**
 * `FlashcardView` is a Client Component and its render-prop functions
 * (renderFront/renderBack) can't be passed to it from a Server Component —
 * function props can't cross the server/client boundary. So the server page
 * resolves audio into plain, serializable data and hands it to this small
 * client wrapper, which owns the render-prop closures instead.
 */
export interface PinyinFlashcardItem extends PinyinSyllableItem {
  audioSrc: string;
  audioAvailable: boolean;
}

export function PinyinFlashcardDeck({ items }: { items: PinyinFlashcardItem[] }) {
  return (
    <FlashcardView<PinyinFlashcardItem>
      items={items}
      renderFront={(item) => (
        <div className="flex flex-col items-center gap-3">
          <span className="text-5xl font-semibold">{item.pinyin}</span>
          {item.simplified && <span className="text-3xl">{item.simplified}</span>}
          <AudioButton src={item.audioSrc} available={item.audioAvailable} label={`Play ${item.pinyin}`} />
        </div>
      )}
      renderBack={(item) => (
        <div className="flex flex-col items-center gap-2 text-neutral-700">
          <p>
            <span className="font-medium">Initial:</span> {item.initial || '(none)'}
          </p>
          <p>
            <span className="font-medium">Final:</span> {item.final}
          </p>
          <p>
            <span className="font-medium">Tone:</span> {item.toneNumber === 5 ? 'Neutral' : item.toneNumber}
          </p>
          {item.definitions && item.definitions.length > 0 && (
            <p className="mt-1 italic text-neutral-500">{item.definitions.join('; ')}</p>
          )}
        </div>
      )}
    />
  );
}
