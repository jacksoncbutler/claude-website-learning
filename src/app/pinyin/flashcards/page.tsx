import { getPinyinItems, resolveAudioSrc } from '@/lib/content/loaders';
import { PinyinFlashcardDeck, type PinyinFlashcardItem } from '@/components/pinyin/PinyinFlashcardDeck';

export default function PinyinFlashcardsPage() {
  const items: PinyinFlashcardItem[] = getPinyinItems().map((item) => {
    const { src, available } = resolveAudioSrc(item.audioId);
    return { ...item, audioSrc: src, audioAvailable: available };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Pinyin Flashcards</h1>
        <p className="mt-1 text-neutral-500">Flip each card to check the initial, final and tone.</p>
      </div>

      <PinyinFlashcardDeck items={items} />
    </div>
  );
}
