import { getHsk1Words, resolveAudioSrc } from '@/lib/content/loaders';
import { Hsk1FlashcardSetup } from '@/components/hsk1/Hsk1FlashcardSetup';
import type { Hsk1AudioItem } from '@/components/hsk1/types';

export default function Hsk1FlashcardsPage() {
  const words: Hsk1AudioItem[] = getHsk1Words().map((item) => {
    const { src, available } = resolveAudioSrc(item.audioId);
    return { ...item, audioSrc: src, audioAvailable: available } as Hsk1AudioItem;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">HSK 1 Flashcards</h1>
        <p className="mt-1 text-neutral-500">Choose which words to drill, then flip through them.</p>
      </div>

      <Hsk1FlashcardSetup words={words} />
    </div>
  );
}
