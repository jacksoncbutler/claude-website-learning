import type { ModuleDefinition } from './types';

/**
 * The learning-path registry that drives the dashboard's module grid.
 * Order follows the self-study method this site is built around: pinyin
 * first, then radicals, then HSK1 through HSK6, building characters out of
 * radical + phonetic components as levels progress.
 *
 * Adding a real module later is just: build its route + data, then flip its
 * `status` to 'available' here — the dashboard needs no other changes.
 */
export const modules: ModuleDefinition[] = [
  {
    id: 'pinyin',
    title: 'Pinyin',
    description: 'Pronunciation and tones — the sounds of Mandarin.',
    route: '/pinyin',
    status: 'available',
  },
  {
    id: 'radicals',
    title: 'Radicals',
    description: 'The building blocks characters are made from.',
    route: '/radicals',
    status: 'available',
  },
  {
    id: 'hsk1',
    title: 'HSK 1',
    description: 'First 150 words and characters.',
    route: '/hsk1',
    status: 'available',
  },
  {
    id: 'hsk2',
    title: 'HSK 2',
    description: '150 more words, basic sentence patterns.',
    route: '/hsk2',
    status: 'coming-soon',
  },
  {
    id: 'hsk3',
    title: 'HSK 3',
    description: 'Everyday vocabulary for routine communication.',
    route: '/hsk3',
    status: 'coming-soon',
  },
  {
    id: 'hsk4',
    title: 'HSK 4',
    description: 'Fluent, wide-ranging conversation.',
    route: '/hsk4',
    status: 'coming-soon',
  },
  {
    id: 'hsk5',
    title: 'HSK 5',
    description: 'Reading newspapers, watching films.',
    route: '/hsk5',
    status: 'coming-soon',
  },
  {
    id: 'hsk6',
    title: 'HSK 6',
    description: 'Near-native comprehension and expression.',
    route: '/hsk6',
    status: 'coming-soon',
  },
];

export function getModules(): ModuleDefinition[] {
  return modules;
}
