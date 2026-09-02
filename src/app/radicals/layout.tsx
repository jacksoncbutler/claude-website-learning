'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Same "back one level" pattern as src/app/pinyin/layout.tsx — see that
 * file's comment for why. Each module gets its own copy of this small
 * layout rather than a single shared one, since the module-root vs.
 * subpage check is specific to each module's own route prefix.
 */
export default function RadicalsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const isModuleRoot = normalizedPath === '/radicals';
  const backHref = isModuleRoot ? '/' : '/radicals';
  const backLabel = isModuleRoot ? 'Home' : 'Radicals';

  return (
    <div className="flex flex-col gap-4">
      <Link
        href={backHref}
        className="inline-flex w-fit items-center gap-1 text-sm text-neutral-500 hover:text-brand-600"
      >
        ← Back to {backLabel}
      </Link>
      {children}
    </div>
  );
}
