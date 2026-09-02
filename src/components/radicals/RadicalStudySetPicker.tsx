'use client';

import { useMemo, useState } from 'react';
import { CheckboxFilterGroup } from '@/components/ui/CheckboxFilterGroup';
import type { RadicalAudioItem } from './types';

type StudyMode = 'filter' | 'manual';

export interface RadicalStudySetPickerProps {
  items: RadicalAudioItem[];
  /** Called with the resolved selection when the user clicks the start button. */
  onStart: (items: RadicalAudioItem[]) => void;
  /** Label for the start button, e.g. "Start flashcards". */
  startLabel?: string;
}

/**
 * "Which radicals do you want to study" picker, mirroring
 * PinyinStudySetPicker's shape (filter vs. manual search-and-pick) — the
 * filter dimension here is stroke count, radicals' natural grouping,
 * rather than pinyin's rows/columns/tones.
 */
export function RadicalStudySetPicker({ items, onStart, startLabel = 'Start' }: RadicalStudySetPickerProps) {
  const [mode, setMode] = useState<StudyMode>('filter');

  const strokeCounts = useMemo(
    () => [...new Set(items.map((item) => item.strokeCount))].sort((a, b) => a - b),
    [items],
  );
  const [selectedStrokeCounts, setSelectedStrokeCounts] = useState<Set<number>>(() => new Set(strokeCounts));

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

  function currentSelection(): RadicalAudioItem[] {
    if (mode === 'manual') {
      return items.filter((item) => manualSelectedIds.has(item.id));
    }
    return items.filter((item) => selectedStrokeCounts.has(item.strokeCount));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Study set">
        {(
          [
            ['filter', 'Stroke count'],
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
          label="Stroke count"
          options={strokeCounts.map((n) => ({ value: n, display: String(n) }))}
          selected={selectedStrokeCounts}
          onChange={setSelectedStrokeCounts}
        />
      )}

      {mode === 'manual' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={manualSearch}
              onChange={(e) => setManualSearch(e.target.value)}
              placeholder="Search radical, pinyin, or meaning..."
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
            <div className="grid grid-cols-3 gap-1 sm:grid-cols-4">
              {manualFiltered.map((item) => (
                <label key={item.id} className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" checked={manualSelectedIds.has(item.id)} onChange={() => toggleManual(item.id)} />
                  <span className="text-lg">{item.simplified}</span> {item.pinyin}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm text-neutral-500">{currentSelection().length} radical(s) in this set.</p>
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
