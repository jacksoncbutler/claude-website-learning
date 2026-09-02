'use client';

import { useMemo, useState } from 'react';
import { CheckboxFilterGroup } from '@/components/ui/CheckboxFilterGroup';
import type { Hsk1AudioItem } from './types';

type StudyMode = 'filter' | 'manual';

export interface Hsk1StudySetPickerProps {
  items: Hsk1AudioItem[];
  onStart: (items: Hsk1AudioItem[]) => void;
  startLabel?: string;
}

/**
 * "Which words do you want to study" picker, mirroring Pinyin's and
 * Radicals' shape (filter vs. manual search-and-pick) — the filter
 * dimension here is part of speech, HSK1's natural grouping.
 */
export function Hsk1StudySetPicker({ items, onStart, startLabel = 'Start' }: Hsk1StudySetPickerProps) {
  const [mode, setMode] = useState<StudyMode>('filter');

  const partsOfSpeech = useMemo(
    () => [...new Set(items.map((item) => item.partOfSpeech?.[0] ?? 'other'))].sort(),
    [items],
  );
  const [selectedPos, setSelectedPos] = useState<Set<string>>(() => new Set(partsOfSpeech));

  const [manualSearch, setManualSearch] = useState('');
  const [manualSelectedIds, setManualSelectedIds] = useState<Set<string>>(new Set());

  const manualFiltered = useMemo(() => {
    const search = manualSearch.trim().toLowerCase();
    if (!search) return items;
    return items.filter(
      (item) =>
        item.simplified.includes(search) ||
        item.pinyin.toLowerCase().includes(search) ||
        item.pinyinNumeric.toLowerCase().includes(search) ||
        item.definitions?.some((d) => d.toLowerCase().includes(search)),
    );
  }, [items, manualSearch]);

  function toggleManual(id: string) {
    setManualSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function currentSelection(): Hsk1AudioItem[] {
    if (mode === 'manual') {
      return items.filter((item) => manualSelectedIds.has(item.id));
    }
    return items.filter((item) => selectedPos.has(item.partOfSpeech?.[0] ?? 'other'));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Study set">
        {(
          [
            ['filter', 'Part of speech'],
            ['manual', 'Manual selection'],
          ] as [StudyMode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => setMode(m)}
            className={
              'rounded-full border px-3 py-1 text-sm transition-colors ' +
              (mode === m
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-brand-500')
            }
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'filter' && (
        <CheckboxFilterGroup
          label="Part of speech"
          options={partsOfSpeech.map((p) => ({ value: p, display: p }))}
          selected={selectedPos}
          onChange={setSelectedPos}
        />
      )}

      {mode === 'manual' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={manualSearch}
              onChange={(e) => setManualSearch(e.target.value)}
              placeholder="Search word, pinyin, or meaning..."
              className="w-64 rounded-md border border-neutral-300 px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => setManualSelectedIds((prev) => new Set([...prev, ...manualFiltered.map((i) => i.id)]))}
              className="text-sm text-brand-600 hover:underline"
            >
              Select all shown
            </button>
            <button type="button" onClick={() => setManualSelectedIds(new Set())} className="text-sm text-neutral-500 hover:underline">
              Clear
            </button>
            <span className="text-sm text-neutral-400">{manualSelectedIds.size} selected</span>
          </div>
          <div className="max-h-64 overflow-y-auto rounded-md border border-neutral-200 p-2">
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {manualFiltered.map((item) => (
                <label key={item.id} className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" checked={manualSelectedIds.has(item.id)} onChange={() => toggleManual(item.id)} />
                  <span>{item.simplified}</span> {item.pinyin}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm text-neutral-500">{currentSelection().length} word(s) in this set.</p>
        <button
          type="button"
          disabled={currentSelection().length === 0}
          onClick={() => onStart(currentSelection())}
          className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {startLabel}
        </button>
      </div>
    </div>
  );
}
