import { getPinyinItems, getPinyinInitials, getPinyinFinals, resolveAudioSrc } from '@/lib/content/loaders';
import { PinyinFlashcardSetup } from '@/components/pinyin/PinyinFlashcardSetup';
import type { PinyinTableItem } from '@/components/pinyin/PinyinTableClient';

export default function PinyinFlashcardsPage() {
  const items: PinyinTableItem[] = getPinyinItems().map((item) => {
    const { src, available } = resolveAudioSrc(item.audioId);
    return { ...item, audioSrc: src, audioAvailable: available };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Pinyin Flashcards</h1>
        <p className="mt-1 text-neutral-500">Choose which syllables to drill, then flip through them.</p>
      </div>

      <PinyinFlashcardSetup items={items} initials={getPinyinInitials()} finals={getPinyinFinals()} />
    </div>
  );
}
