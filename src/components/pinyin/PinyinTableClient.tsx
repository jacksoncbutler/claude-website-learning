'use client';

import { useEffect, useMemo, useState } from 'react';
import { TableView } from '@/components/views/TableView';
import { AudioButton } from '@/components/audio/AudioButton';
import type { PinyinSyllableItem } from '@/lib/content/types';

export interface PinyinTableItem extends PinyinSyllableItem {
  audioSrc: string;
  audioAvailable: boolean;
}

interface PinyinTableClientProps {
  items: PinyinTableItem[];
  initials: { id: string; symbol: string }[];
  finals: { id: string; symbol: string }[];
  validBases: string[];
}

/** The central tone selector's positions: a specific tone (direct play on
 * click), or "explore" — click a cell to compare every tone for that
 * syllable in a popup instead. */
type ToneMode = 1 | 2 | 3 | 4 | 'explore';

const TONE_MODE_OPTIONS: { mode: ToneMode; label: string }[] = [
  { mode: 1, label: '1st tone' },
  { mode: 2, label: '2nd tone' },
  { mode: 3, label: '3rd tone' },
  { mode: 4, label: '4th tone' },
  { mode: 'explore', label: 'Explore all tones' },
];

const TONE_LABELS: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: 'Neutral' };

export function PinyinTableClient({ items, initials, finals, validBases }: PinyinTableClientProps) {
  const [mode, setMode] = useState<ToneMode>('explore');
  const [popupBase, setPopupBase] = useState<string | null>(null);

  const validBaseSet = useMemo(() => new Set(validBases), [validBases]);
  const finalSymbolById = useMemo(() => new Map(finals.map((f) => [f.id, f.symbol])), [finals]);

  // Every tone we have for each syllable base, sorted 1 -> 5, for the popup.
  const tonesByBase = useMemo(() => {
    const map = new Map<string, PinyinTableItem[]>();
    for (const item of items) {
      const existing = map.get(item.syllableBase);
      if (existing) existing.push(item);
      else map.set(item.syllableBase, [item]);
    }
    for (const tones of map.values()) tones.sort((a, b) => a.toneNumber - b.toneNumber);
    return map;
  }, [items]);

  // What the grid actually renders: one specific tone per cell in direct-play
  // modes, or one representative item per base (preferring tone 1) in
  // explore mode, since the cell itself just opens the popup.
  const gridItems = useMemo(() => {
    if (mode === 'explore') {
      return [...tonesByBase.values()].map((tones) => tones[0]);
    }
    return items.filter((item) => item.toneNumber === mode);
  }, [items, tonesByBase, mode]);

  const popupTones = popupBase ? tonesByBase.get(popupBase) : undefined;

  useEffect(() => {
    if (!popupBase) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setPopupBase(null);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [popupBase]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tone to play">
        {TONE_MODE_OPTIONS.map((opt) => (
          <button
            key={opt.mode}
            type="button"
            role="radio"
            aria-checked={mode === opt.mode}
            onClick={() => setMode(opt.mode)}
            className={
              'rounded-full border px-3 py-1 text-sm transition-colors ' +
              (mode === opt.mode
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-brand-500')
            }
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-neutral-500">
        {mode === 'explore'
          ? 'Click a syllable to see and play every tone for it.'
          : `Showing the ${TONE_LABELS[mode].toLowerCase()} tone. Click a syllable to hear it.`}
      </p>

      <TableView<PinyinTableItem>
        mode="grid"
        items={gridItems}
        rows={initials.map((i) => i.id)}
        columns={finals.map((f) => f.id)}
        getRowKey={(item) => item.initial}
        getColKey={(item) => item.final}
        rowLabel={(row) => row}
        columnLabel={(col) => finalSymbolById.get(col) ?? col}
        isValidCombination={(row, col) => validBaseSet.has(`${row}${col}`)}
        renderCell={(cellItems, _row, _col, valid) => {
          if (!valid) {
            return (
              <span className="text-neutral-200" aria-hidden="true">
                —
              </span>
            );
          }
          const item = cellItems[0];
          if (!item) {
            return (
              <span className="text-neutral-300" aria-hidden="true">
                ·
              </span>
            );
          }
          if (mode === 'explore') {
            // Toneless base, not item.pinyin — showing a specific tone's
            // spelling here would wrongly suggest that tone is "the" answer,
            // when the button's whole point is to reveal all of them.
            return (
              <button
                type="button"
                onClick={() => setPopupBase(item.syllableBase)}
                className="font-medium text-neutral-900 hover:text-brand-600"
                aria-label={`Show all tones for ${item.syllableBase}`}
              >
                {item.syllableBase}
              </button>
            );
          }
          return (
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-medium">{item.pinyin}</span>
              <AudioButton src={item.audioSrc} available={item.audioAvailable} label={`Play ${item.pinyin}`} />
            </div>
          );
        }}
      />

      {popupBase && popupTones && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setPopupBase(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`All tones for ${popupBase}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-xl bg-white p-5 shadow-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{popupBase}</h2>
              <button
                type="button"
                onClick={() => setPopupBase(null)}
                aria-label="Close"
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {popupTones.map((tone) => (
                <li key={tone.id} className="flex items-center justify-between gap-3 rounded-lg bg-neutral-50 px-3 py-2">
                  <span className="text-sm text-neutral-500">{TONE_LABELS[tone.toneNumber]}</span>
                  <span className="flex-1 text-center text-lg font-medium">{tone.pinyin}</span>
                  <AudioButton src={tone.audioSrc} available={tone.audioAvailable} label={`Play ${tone.pinyin}`} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
