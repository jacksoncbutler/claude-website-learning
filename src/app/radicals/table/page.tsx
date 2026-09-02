import { getRadicals } from '@/lib/content/loaders';
import { RadicalsTable } from '@/components/radicals/RadicalsTable';

export default function RadicalsTablePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Radical Table</h1>
        <p className="mt-1 text-neutral-500">The 100 most common radicals, grouped by stroke count.</p>
      </div>

      <RadicalsTable radicals={getRadicals()} />
    </div>
  );
}
