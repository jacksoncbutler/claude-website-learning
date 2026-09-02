import { TableView } from '@/components/views/TableView';
import { AudioButton } from '@/components/audio/AudioButton';
import type { Hsk1AudioItem } from './types';

/** Pedagogically sensible group order — not alphabetical. */
const POS_ORDER = [
  'number', 'pronoun', 'noun', 'proper noun', 'verb', 'adjective', 'adverb',
  'measure word', 'particle', 'conjunction', 'preposition', 'interjection', 'phrase',
];

export function Hsk1Table({ words }: { words: Hsk1AudioItem[] }) {
  const byPos = new Map<string, Hsk1AudioItem[]>();
  for (const word of words) {
    const pos = word.partOfSpeech?.[0] ?? 'other';
    const group = byPos.get(pos);
    if (group) group.push(word);
    else byPos.set(pos, [word]);
  }
  const groups = [...byPos.keys()].sort((a, b) => {
    const ai = POS_ORDER.indexOf(a);
    const bi = POS_ORDER.indexOf(b);
    return (ai === -1 ? POS_ORDER.length : ai) - (bi === -1 ? POS_ORDER.length : bi);
  });

  return (
    <div className="flex flex-col gap-6">
      {groups.map((pos) => (
        <div key={pos} className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{pos}</h2>
          <TableView<Hsk1AudioItem>
            mode="list"
            items={byPos.get(pos)!}
            getRowId={(item) => item.id}
            columns={[
              { key: 'word', label: 'Word', render: (item) => <span className="text-xl">{item.simplified}</span> },
              {
                key: 'pinyin',
                label: 'Pinyin',
                render: (item) => (
                  <div className="flex items-center gap-1.5">
                    <span>{item.pinyin}</span>
                    <AudioButton src={item.audioSrc} available={item.audioAvailable} label={`Play ${item.pinyin}`} />
                  </div>
                ),
              },
              { key: 'meaning', label: 'Meaning', render: (item) => item.definitions?.join(', ') ?? '' },
            ]}
          />
        </div>
      ))}
    </div>
  );
}
