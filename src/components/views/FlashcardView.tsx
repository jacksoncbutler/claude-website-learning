'use client';

import { useState, type ReactNode } from 'react';
import type { LearningItem } from '@/lib/content/types';

export interface FlashcardViewProps<T extends LearningItem> {
  items: T[];
  renderFront: (item: T) => ReactNode;
  renderBack: (item: T) => ReactNode;
}

/**
 * Generic flashcard deck: flip, next/prev, shuffle, keyboard navigation.
 * Content-type-agnostic — pinyin, radicals, and HSK vocab all reuse this by
 * passing their own renderFront/renderBack.
 */
export function FlashcardView<T extends LearningItem>({ items, renderFront, renderBack }: FlashcardViewProps<T>) {
  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (items.length === 0) {
    return <p className="text-neutral-500">No cards in this deck yet.</p>;
  }

  const current = items[order[index]];

  function goTo(next: number) {
    const clamped = ((next % order.length) + order.length) % order.length;
    setIndex(clamped);
    setFlipped(false);
  }

  function toggleFlip() {
    setFlipped((f) => !f);
  }

  function shuffle() {
    const shuffled = [...order];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setOrder(shuffled);
    setIndex(0);
    setFlipped(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleFlip();
    } else if (e.key === 'ArrowRight') {
      goTo(index + 1);
    } else if (e.key === 'ArrowLeft') {
      goTo(index - 1);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-neutral-500">
        Card {index + 1} of {order.length}
      </p>

      <div
        role="button"
        tabIndex={0}
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
        className="flex min-h-[12rem] w-full max-w-sm cursor-pointer select-none flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        {flipped ? renderBack(current) : renderFront(current)}
      </div>

      <p className="text-xs text-neutral-400">Click the card or press space to flip. Arrow keys to navigate.</p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={toggleFlip}
          className="rounded-md bg-brand-500 px-3 py-1.5 text-sm text-white hover:bg-brand-600"
        >
          Flip
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
        >
          Next →
        </button>
        <button
          type="button"
          onClick={shuffle}
          className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
        >
          🔀 Shuffle
        </button>
      </div>
    </div>
  );
}
