'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Wraps every page under /pinyin with a "back one level" link — the module
 * landing page goes back Home, and every page below that (table, flashcards,
 * listen-and-write, ...) goes back to the module landing page. This is
 * deliberately not the browser's back button (unreliable history, easy to
 * lose) and deliberately not always Home (you shouldn't have to re-navigate
 * from scratch to switch between two sibling pages).
 *
 * This is a per-module pattern, not a global one yet — Radicals/HSK modules
 * should add their own layout.tsx following the same shape when they exist.
 */
export default function PinyinLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // next.config.mjs sets trailingSlash: true (required for GitHub Pages),
  // so usePathname() returns "/pinyin/" rather than "/pinyin" — normalize
  // before comparing, or this always takes the "not module root" branch.
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const isModuleRoot = normalizedPath === '/pinyin';
  const backHref = isModuleRoot ? '/' : '/pinyin';
  const backLabel = isModuleRoot ? 'Home' : 'Pinyin';

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
