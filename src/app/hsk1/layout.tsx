'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Same "back one level" pattern as pinyin's and radicals' layouts. */
export default function Hsk1Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const isModuleRoot = normalizedPath === '/hsk1';
  const backHref = isModuleRoot ? '/' : '/hsk1';
  const backLabel = isModuleRoot ? 'Home' : 'HSK 1';

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
