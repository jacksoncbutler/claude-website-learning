'use client';

import { useMemo, useState } from 'react';
import type { PinyinTableItem } from './PinyinTableClient';

type StudyMode = 'filter' | 'manual';

const ALL_TONES = [1, 2, 3, 4, 5] as const;
const TONE_LABELS: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: 'Neutral' };

export interface PinyinStudySetPickerProps {
  items: PinyinTableItem[];
  initials: { id: string; symbol: string }[];
  finals: { id: string; symbol: string }[];
  /** Called with the resolved selection when the user clicks the start button. */
  onStart: (items: PinyinTableItem[]) => void;
  /** Label for the start button, e.g. "Start quiz" vs "Start flashcards". */
  startLabel?: string;
}

/** A row of "select all / select none" plus a checkbox grid, reused for
 * initials, finals, and tones — the three independent filters that combine
 * (intersect) to define the study set. */
function CheckboxFilterGroup<T extends string | number>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: T; display: string }[];
  selected: Set<T>;
  onChange: (next: Set<T>) => void;
}) {
  function toggle(value: T) {
    const next = new Set(selected);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <button type="button" onClick={() => onChange(new Set(options.map((o) => o.value)))} className="text-xs text-brand-600 hover:underline">
          All
        </button>
        <button type="button" onClick={() => onChange(new Set())} className="text-xs text-neutral-500 hover:underline">
          None
        </button>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 rounded-md border border-neutral-200 p-2">
        {options.map((opt) => (
          <label key={String(opt.value)} className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={selected.has(opt.value)} onChange={() => toggle(opt.value)} />
            {opt.display}
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * Reusable "which syllables do you want to study" picker: multi-select
 * rows/columns/tones (intersecting) or a manual search-and-pick list.
 * Content-neutral about what happens next — the caller decides via
 * `onStart` (e.g. Listen and Write starts a quiz, flashcards starts a
 * deck), so this same picker serves both without duplication.
 */
export function PinyinStudySetPicker({ items, initials, finals, onStart, startLabel = 'Start' }: PinyinStudySetPickerProps) {
  const [mode, setMode] = useState<StudyMode>('filter');

  const [selectedInitials, setSelectedInitials] = useState<Set<string>>(() => new Set(initials.map((i) => i.id)));
  const [selectedFinals, setSelectedFinals] = useState<Set<string>>(() => new Set(finals.map((f) => f.id)));
  const [selectedTones, setSelectedTones] = useState<Set<number>>(() => new Set(ALL_TONES));

  const [manualSearch, setManualSearch] = useState('');
  const [manualSelectedIds, setManualSelectedIds] = useState<Set<string>>(new Set());

  const manualFiltered = useMemo(() => {
    const search = manualSearch.trim().toLowerCase();
    if (!search) return items;
    // Match on the numeric form too — typing tone marks (bā vs ba) isn't
    // practical, so plain "ba1" (or even just "ba") needs to find it.
    return items.filter(
      (item) => item.pinyin.toLowerCase().includes(search) || item.pinyinNumeric.toLowerCase().includes(search),
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

  function currentSelection(): PinyinTableItem[] {
    if (mode === 'manual') {
      return items.filter((item) => manualSelectedIds.has(item.id));
    }
    return items.filter(
      (item) =>
        selectedInitials.has(item.initial) && selectedFinals.has(item.final) && selectedTones.has(item.toneNumber),
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Study set">
        {(
          [
            ['filter', 'Rows, columns and tones'],
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
        <div className="flex flex-col gap-4">
          <CheckboxFilterGroup
            label="Rows (initials)"
            options={initials.map((i) => ({ value: i.id, display: i.symbol }))}
            selected={selectedInitials}
            onChange={setSelectedInitials}
          />
          <CheckboxFilterGroup
            label="Columns (finals)"
            options={finals.map((f) => ({ value: f.id, display: f.symbol }))}
            selected={selectedFinals}
            onChange={setSelectedFinals}
          />
          <CheckboxFilterGroup
            label="Tones"
            options={ALL_TONES.map((t) => ({ value: t, display: TONE_LABELS[t] }))}
            selected={selectedTones}
            onChange={setSelectedTones}
          />
        </div>
      )}

      {mode === 'manual' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={manualSearch}
              onChange={(e) => setManualSearch(e.target.value)}
              placeholder="Search pinyin..."
              className="w-48 rounded-md border border-neutral-300 px-2 py-1 text-sm"
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
                  <input
                    type="checkbox"
                    checked={manualSelectedIds.has(item.id)}
                    onChange={() => toggleManual(item.id)}
                  />
                  {item.pinyin}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm text-neutral-500">{currentSelection().length} syllable(s) in this set.</p>
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
