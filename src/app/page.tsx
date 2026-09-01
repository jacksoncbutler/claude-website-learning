import { ModuleCard } from '@/components/dashboard/ModuleCard';
import { DailyProverb } from '@/components/dashboard/DailyProverb';
import { getModules } from '@/lib/content/loaders';

export default function DashboardPage() {
  const modules = getModules();

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <p className="mt-1 text-neutral-500">Pick up where you left off, or explore a module below.</p>
      </section>

      <DailyProverb />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Your learning path</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {modules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}
        </div>
      </section>
    </div>
  );
}
