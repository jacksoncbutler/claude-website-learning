'use client';

import { useMemo, useState } from 'react';
import { AudioButton } from '@/components/audio/AudioButton';
import { isCorrectAnswer } from '@/lib/quiz/answerMatch';
import type { QuizItem, QuizItemStats } from '@/lib/quiz/types';

// A syllable heard 3+ times, or gotten wrong at all, counts as "needs review"
// on the post-quiz "study weak items" option. Named constants so these are
// easy to retune later without hunting through the component.
const INCORRECT_THRESHOLD = 1;
const PLAYBACK_THRESHOLD = 3;

type Feedback = 'answering' | 'correct' | 'wrong' | 'revealed';

interface ListenAndWriteQuizProps {
  items: QuizItem[];
  /** Go back to the study-set selection screen. */
  onChangeStudySet: () => void;
  /** Leave the quiz entirely (e.g. back to the module landing page). */
  onExit: () => void;
}

function shuffledIndices(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function ListenAndWriteQuiz({ items: initialItems, onChangeStudySet, onExit }: ListenAndWriteQuizProps) {
  const [items, setItems] = useState(initialItems);
  const [order, setOrder] = useState(() => shuffledIndices(initialItems.length));
  const [position, setPosition] = useState(0);
  const [stats, setStats] = useState<Map<string, QuizItemStats>>(new Map());
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('answering');
  const [done, setDone] = useState(false);

  const current = items[order[position]];

  const currentStats = useMemo<QuizItemStats>(
    () => stats.get(current?.id ?? '') ?? { playCount: 0, incorrectCount: 0 },
    [stats, current],
  );

  function updateStats(id: string, patch: Partial<QuizItemStats>) {
    setStats((prev) => {
      const next = new Map(prev);
      const existing = next.get(id) ?? { playCount: 0, incorrectCount: 0 };
      next.set(id, { ...existing, ...patch });
      return next;
    });
  }

  function startSession(sessionItems: QuizItem[]) {
    setItems(sessionItems);
    setOrder(shuffledIndices(sessionItems.length));
    setPosition(0);
    setStats(new Map());
    setInputValue('');
    setFeedback('answering');
    setDone(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (feedback !== 'answering' || !current) return;
    if (isCorrectAnswer(inputValue, current)) {
      setFeedback('correct');
    } else {
      updateStats(current.id, { incorrectCount: currentStats.incorrectCount + 1 });
      setFeedback('wrong');
    }
  }

  function handleReveal() {
    if (!current) return;
    updateStats(current.id, { incorrectCount: currentStats.incorrectCount + 1 });
    setFeedback('revealed');
  }

  function handleNext() {
    setInputValue('');
    setFeedback('answering');
    if (position + 1 >= order.length) {
      setDone(true);
    } else {
      setPosition(position + 1);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-white p-8 text-center">
        <p className="text-neutral-500">No syllables with audio in this set yet.</p>
        <button
          type="button"
          onClick={onChangeStudySet}
          className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
        >
          Change study set
        </button>
      </div>
    );
  }

  if (done) {
    const weakItems = items.filter((item) => {
      const s = stats.get(item.id);
      return s && (s.incorrectCount >= INCORRECT_THRESHOLD || s.playCount >= PLAYBACK_THRESHOLD);
    });
    const perfectCount = items.length - weakItems.length;

    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-white p-8 text-center">
        <h2 className="text-xl font-semibold">Session complete 🎉</h2>
        <p className="text-neutral-600">
          {perfectCount} of {items.length} syllables answered cleanly (no mistakes, few replays).
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => startSession(initialItems)}
            className="rounded-md bg-brand-500 px-3 py-1.5 text-sm text-white hover:bg-brand-600"
          >
            Study all again
          </button>
          <button
            type="button"
            disabled={weakItems.length === 0}
            onClick={() => startSession(weakItems)}
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
            title={weakItems.length === 0 ? 'Nothing needs review — nice work!' : undefined}
          >
            Study weak items ({weakItems.length})
          </button>
          <button
            type="button"
            onClick={onChangeStudySet}
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
          >
            Change study set
          </button>
          <button
            type="button"
            onClick={onExit}
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-neutral-500">
        Syllable {position + 1} of {order.length}
      </p>

      <AudioButton
        src={current.audioSrc}
        available={current.audioAvailable}
        label="Play audio"
        className="h-16 w-16 text-2xl"
        onPlay={() => updateStats(current.id, { playCount: currentStats.playCount + 1 })}
      />

      {feedback === 'answering' || feedback === 'wrong' ? (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
          <input
            type="text"
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type the pinyin, e.g. ma1"
            className="w-48 rounded-md border border-neutral-300 px-3 py-2 text-center text-lg focus:border-brand-500 focus:outline-none"
          />
          {feedback === 'wrong' && <p className="text-sm text-amber-600">Not quite — try again.</p>}
          <div className="flex gap-2">
            <button type="submit" className="rounded-md bg-brand-500 px-3 py-1.5 text-sm text-white hover:bg-brand-600">
              Check
            </button>
            <button
              type="button"
              onClick={handleReveal}
              className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
            >
              I don&apos;t know
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className={feedback === 'correct' ? 'text-green-600' : 'text-amber-600'}>
            {feedback === 'correct' ? 'Correct!' : 'The answer was:'}
          </p>
          <p className="text-2xl font-medium">{current.displayAnswer}</p>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-md bg-brand-500 px-3 py-1.5 text-sm text-white hover:bg-brand-600"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
