import { getRadicals } from '@/lib/content/loaders';
import { RadicalFlashcardDeck } from '@/components/radicals/RadicalFlashcardDeck';

export default function RadicalsFlashcardsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Radical Flashcards</h1>
        <p className="mt-1 text-neutral-500">Flip each card to check the meaning and stroke count.</p>
      </div>

      <RadicalFlashcardDeck radicals={getRadicals()} />
    </div>
  );
}
