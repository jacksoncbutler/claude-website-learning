'use client';

import { FlashcardView } from '@/components/views/FlashcardView';
import { AudioButton } from '@/components/audio/AudioButton';
import type { Hsk1AudioItem } from './types';

/** Front: the word plus a play button. Back: pinyin, meaning, part of speech. */
export function Hsk1FlashcardDeck({ words }: { words: Hsk1AudioItem[] }) {
  return (
    <FlashcardView<Hsk1AudioItem>
      items={words}
      renderFront={(item) => (
        <div className="flex flex-col items-center gap-3">
          <span className="text-6xl font-semibold">{item.simplified}</span>
          <AudioButton src={item.audioSrc} available={item.audioAvailable} label={`Play ${item.pinyin}`} />
        </div>
      )}
      renderBack={(item) => (
        <div className="flex flex-col items-center gap-2 text-neutral-700">
          <p className="text-2xl font-medium">{item.pinyin}</p>
          <p className="text-lg">{item.definitions?.join(', ')}</p>
          {item.partOfSpeech && <p className="mt-1 text-sm text-neutral-500">{item.partOfSpeech.join(', ')}</p>}
        </div>
      )}
    />
  );
}
