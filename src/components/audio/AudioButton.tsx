'use client';

import { useState } from 'react';

export interface AudioButtonProps {
  /** Resolved audio source, from lib/content/loaders#resolveAudioSrc. */
  src: string;
  /** Whether the file is actually present — server-checked, not guessed. */
  available: boolean;
  label?: string;
  className?: string;
  /** Called each time playback is actually triggered (not on disabled clicks). Optional — e.g. the Listen and Write quiz uses this to count replays. */
  onPlay?: () => void;
}

/**
 * Plays a pronunciation clip on click. Degrades gracefully to a disabled
 * button whenever audio isn't available yet (no id, unknown id, or file
 * missing on disk) — never a broken play control.
 *
 * Deliberately does NOT keep a persistent <audio> element mounted per
 * button. This table/flashcard/quiz UI can render hundreds of these at
 * once (e.g. a full tone-view of the pinyin chart), and mounting hundreds
 * of real <audio> elements simultaneously is exactly the kind of thing
 * mobile Safari forcibly reloads the tab over once it hits its concurrent
 * media-element limit — which is what happened here once most syllables
 * had real audio and thus a rendered <audio> in every cell. Instead, a
 * fresh Audio() is created only at the moment of playback and left to be
 * garbage-collected afterwards, so the DOM never accumulates them.
 */
export function AudioButton({ src, available, label = 'Play pronunciation', className = '', onPlay }: AudioButtonProps) {
  const [errored, setErrored] = useState(false);
  const canPlay = available && !errored;

  function handleClick(e: React.MouseEvent) {
    // Stop the click from bubbling — this button is often nested inside a
    // larger clickable area (e.g. a flashcard's flip toggle), and without
    // this, that parent handler fires on the same click, re-rendering (and
    // interrupting playback) before the sound plays.
    e.stopPropagation();
    if (!canPlay) return;
    onPlay?.();
    new Audio(src).play().catch(() => setErrored(true));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={(e) => e.stopPropagation()}
      disabled={!canPlay}
      aria-label={label}
      title={canPlay ? label : 'Audio not available yet'}
      className={
        `inline-flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors ` +
        (canPlay
          ? 'bg-brand-100 text-brand-700 hover:bg-brand-500 hover:text-white cursor-pointer'
          : 'bg-neutral-100 text-neutral-300 cursor-not-allowed') +
        ` ${className}`
      }
    >
      <span aria-hidden="true">{canPlay ? '🔊' : '🔇'}</span>
    </button>
  );
}
