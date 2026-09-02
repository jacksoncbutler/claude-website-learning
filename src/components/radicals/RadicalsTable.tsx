import { TableView } from '@/components/views/TableView';
import { AudioButton } from '@/components/audio/AudioButton';
import type { RadicalAudioItem } from './types';

/**
 * Grouped by stroke count ascending — the universal convention for radical
 * charts (it's how the Kangxi index itself is organized), rendered as one
 * generic list-mode TableView per group rather than teaching TableView a
 * new "grouped" mode it doesn't otherwise need.
 */
export function RadicalsTable({ radicals }: { radicals: RadicalAudioItem[] }) {
  const byStrokeCount = new Map<number, RadicalAudioItem[]>();
  for (const radical of radicals) {
    const group = byStrokeCount.get(radical.strokeCount);
    if (group) group.push(radical);
    else byStrokeCount.set(radical.strokeCount, [radical]);
  }
  const strokeCounts = [...byStrokeCount.keys()].sort((a, b) => a - b);

  return (
    <div className="flex flex-col gap-6">
      {strokeCounts.map((strokeCount) => (
        <div key={strokeCount} className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            {strokeCount} stroke{strokeCount === 1 ? '' : 's'}
          </h2>
          <TableView<RadicalAudioItem>
            mode="list"
            items={byStrokeCount.get(strokeCount)!}
            getRowId={(item) => item.id}
            columns={[
              { key: 'form', label: 'Radical', render: (item) => <span className="text-2xl">{item.simplified}</span> },
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
              {
                key: 'meaning',
                label: 'Meaning',
                render: (item) => item.definitions?.join(', ') ?? '',
              },
              {
                key: 'notes',
                label: 'Notes',
                render: (item) => <span className="text-neutral-400">{item.notes ?? ''}</span>,
              },
            ]}
          />
        </div>
      ))}
    </div>
  );
}
