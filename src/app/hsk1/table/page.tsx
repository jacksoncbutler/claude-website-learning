import { getHsk1Words, resolveAudioSrc } from '@/lib/content/loaders';
import { Hsk1Table } from '@/components/hsk1/Hsk1Table';
import type { Hsk1AudioItem } from '@/components/hsk1/types';

export default function Hsk1TablePage() {
  const words: Hsk1AudioItem[] = getHsk1Words().map((item) => {
    const { src, available } = resolveAudioSrc(item.audioId);
    return { ...item, audioSrc: src, audioAvailable: available } as Hsk1AudioItem;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">HSK 1 Word Table</h1>
        <p className="mt-1 text-neutral-500">
          The 150 HSK 1 words, grouped by part of speech. Single-syllable words play their pronunciation.
        </p>
      </div>

      <Hsk1Table words={words} />
    </div>
  );
}
