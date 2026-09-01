import Link from 'next/link';
import type { ModuleDefinition } from '@/lib/content/types';

export function ModuleCard({ module: mod }: { module: ModuleDefinition }) {
  const isAvailable = mod.status === 'available';

  const inner = (
    <div
      className={
        'flex h-full flex-col gap-1 rounded-xl border p-4 transition-colors ' +
        (isAvailable
          ? 'border-neutral-200 bg-white hover:border-brand-500 hover:shadow-sm'
          : 'border-dashed border-neutral-200 bg-neutral-50')
      }
    >
      <div className="flex items-center justify-between">
        <h3 className={'font-semibold ' + (isAvailable ? 'text-neutral-900' : 'text-neutral-400')}>{mod.title}</h3>
        {!isAvailable && (
          <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-500">
            Coming soon
          </span>
        )}
      </div>
      <p className={'text-sm ' + (isAvailable ? 'text-neutral-600' : 'text-neutral-400')}>{mod.description}</p>
    </div>
  );

  if (!isAvailable) {
    return (
      <div aria-disabled="true" className="cursor-not-allowed">
        {inner}
      </div>
    );
  }

  return (
    <Link href={mod.route} className="block h-full">
      {inner}
    </Link>
  );
}
