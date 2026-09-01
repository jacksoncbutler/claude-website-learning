'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListenAndWriteQuiz } from '@/components/quiz/ListenAndWriteQuiz';
import type { QuizItem } from '@/lib/quiz/types';
import type { PinyinTableItem } from './PinyinTableClient';

type StudyMode = 'filter' | 'manual';

const ALL_TONES = [1, 2, 3, 4, 5] as const;
const TONE_LABELS: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: 'Neutral' };

interface PinyinListenAndWriteSetupProps {
  items: PinyinTableItem[];
  initials: { id: string; symbol: string }[];
  finals: { id: string; symbol: string }[];
}

function toQuizItem(item: PinyinTableItem): QuizItem {
  return {
    id: item.id,
    audioSrc: item.audioSrc,
    audioAvailable: item.audioAvailable,
    acceptedAnswers: [item.pinyinNumeric.toLowerCase(), item.pinyin.toLowerCase()],
    displayAnswer: item.simplified ? `${item.pinyin}  (${item.simplified})` : item.pinyin,
  };
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

export function PinyinListenAndWriteSetup({ items, initials, finals }: PinyinListenAndWriteSetupProps) {
  const router = useRouter();
  // Can't quiz on a syllable with no recording — filter once, up front.
  const quizable = useMemo(() => items.filter((item) => item.audioAvailable), [items]);

  const [mode, setMode] = useState<StudyMode>('filter');

  const [selectedInitials, setSelectedInitials] = useState<Set<string>>(() => new Set(initials.map((i) => i.id)));
  const [selectedFinals, setSelectedFinals] = useState<Set<string>>(() => new Set(finals.map((f) => f.id)));
  const [selectedTones, setSelectedTones] = useState<Set<number>>(() => new Set(ALL_TONES));

  const [manualSearch, setManualSearch] = useState('');
  const [manualSelectedIds, setManualSelectedIds] = useState<Set<string>>(new Set());
  const [activeSet, setActiveSet] = useState<QuizItem[] | null>(null);

  const manualFiltered = useMemo(() => {
    const search = manualSearch.trim().toLowerCase();
    if (!search) return quizable;
    // Match on the numeric form too — typing tone marks (bā vs ba) isn't
    // practical, so plain "ba1" (or even just "ba") needs to find it.
    return quizable.filter(
      (item) => item.pinyin.toLowerCase().includes(search) || item.pinyinNumeric.toLowerCase().includes(search),
    );
  }, [quizable, manualSearch]);

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
      return quizable.filter((item) => manualSelectedIds.has(item.id));
    }
    return quizable.filter(
      (item) =>
        selectedInitials.has(item.initial) && selectedFinals.has(item.final) && selectedTones.has(item.toneNumber),
    );
  }

  function handleStart() {
    setActiveSet(currentSelection().map(toQuizItem));
  }

  if (activeSet) {
    return (
      <ListenAndWriteQuiz items={activeSet} onChangeStudySet={() => setActiveSet(null)} onExit={() => router.push('/pinyin')} />
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
          onClick={handleStart}
          className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start quiz
        </button>
      </div>
    </div>
  );
}
