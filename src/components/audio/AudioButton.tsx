'use client';

import { useRef, useState } from 'react';

export interface AudioButtonProps {
  /** Resolved audio source, from lib/content/loaders#resolveAudioSrc. */
  src: string;
  /** Whether the file is actually present — server-checked, not guessed. */
  available: boolean;
  label?: string;
  className?: string;
}

/**
 * Plays a pronunciation clip on click. Degrades gracefully to a disabled
 * button whenever audio isn't available yet (no id, unknown id, or file
 * missing on disk) — never a broken play control. `onError` on the
 * underlying <audio> element is a second line of defense in case a file
 * that existed at request time is gone by the time it's actually fetched.
 */
export function AudioButton({ src, available, label = 'Play pronunciation', className = '' }: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [errored, setErrored] = useState(false);
  const canPlay = available && !errored;

  function handleClick() {
    if (!canPlay) return;
    audioRef.current?.play().catch(() => setErrored(true));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
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
      {canPlay && <audio ref={audioRef} src={src} preload="none" onError={() => setErrored(true)} />}
    </button>
  );
}
