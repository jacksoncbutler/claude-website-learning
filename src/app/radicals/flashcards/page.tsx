import { getRadicals } from '@/lib/content/loaders';
import { RadicalFlashcardSetup } from '@/components/radicals/RadicalFlashcardSetup';

export default function RadicalsFlashcardsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Radical Flashcards</h1>
        <p className="mt-1 text-neutral-500">Choose which radicals to drill, then flip through them.</p>
      </div>

      <RadicalFlashcardSetup radicals={getRadicals()} />
    </div>
  );
}
