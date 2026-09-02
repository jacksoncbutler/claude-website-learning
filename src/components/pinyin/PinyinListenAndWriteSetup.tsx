'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListenAndWriteQuiz } from '@/components/quiz/ListenAndWriteQuiz';
import { PinyinStudySetPicker } from './PinyinStudySetPicker';
import type { QuizItem } from '@/lib/quiz/types';
import type { PinyinTableItem } from './PinyinTableClient';

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

export function PinyinListenAndWriteSetup({ items, initials, finals }: PinyinListenAndWriteSetupProps) {
  const router = useRouter();
  // Can't quiz on a syllable with no recording — filter once, up front.
  const quizable = useMemo(() => items.filter((item) => item.audioAvailable), [items]);
  const [activeSet, setActiveSet] = useState<QuizItem[] | null>(null);

  if (activeSet) {
    return (
      <ListenAndWriteQuiz items={activeSet} onChangeStudySet={() => setActiveSet(null)} onExit={() => router.push('/pinyin')} />
    );
  }

  return (
    <PinyinStudySetPicker
      items={quizable}
      initials={initials}
      finals={finals}
      startLabel="Start quiz"
      onStart={(selected) => setActiveSet(selected.map(toQuizItem))}
    />
  );
}
