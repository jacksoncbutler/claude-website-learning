import { getRadicals, resolveAudioSrc } from '@/lib/content/loaders';
import { RadicalFlashcardSetup } from '@/components/radicals/RadicalFlashcardSetup';
import type { RadicalAudioItem } from '@/components/radicals/types';

export default function RadicalsFlashcardsPage() {
  const radicals: RadicalAudioItem[] = getRadicals().map((item) => {
    const { src, available } = resolveAudioSrc(item.audioId);
    return { ...item, audioSrc: src, audioAvailable: available };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Radical Flashcards</h1>
        <p className="mt-1 text-neutral-500">Choose which radicals to drill, then flip through them.</p>
      </div>

      <RadicalFlashcardSetup radicals={radicals} />
    </div>
  );
}
