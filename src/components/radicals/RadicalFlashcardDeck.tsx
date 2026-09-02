'use client';

import { FlashcardView } from '@/components/views/FlashcardView';
import { AudioButton } from '@/components/audio/AudioButton';
import type { RadicalAudioItem } from './types';

/** Front: the radical plus a play button. Back: pronunciation and meaning. */
export function RadicalFlashcardDeck({ radicals }: { radicals: RadicalAudioItem[] }) {
  return (
    <FlashcardView<RadicalAudioItem>
      items={radicals}
      renderFront={(item) => (
        <div className="flex flex-col items-center gap-3">
          <span className="text-7xl font-semibold">{item.simplified}</span>
          <AudioButton src={item.audioSrc} available={item.audioAvailable} label={`Play ${item.pinyin}`} />
        </div>
      )}
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
