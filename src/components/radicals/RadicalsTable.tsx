import { TableView } from '@/components/views/TableView';
import type { RadicalItem } from '@/lib/content/types';

/**
 * Grouped by stroke count ascending — the universal convention for radical
 * charts (it's how the Kangxi index itself is organized), rendered as one
 * generic list-mode TableView per group rather than teaching TableView a
 * new "grouped" mode it doesn't otherwise need.
 */
export function RadicalsTable({ radicals }: { radicals: RadicalItem[] }) {
  const byStrokeCount = new Map<number, RadicalItem[]>();
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
          <TableView<RadicalItem>
            mode="list"
            items={byStrokeCount.get(strokeCount)!}
            getRowId={(item) => item.id}
            columns={[
              { key: 'form', label: 'Radical', render: (item) => <span className="text-2xl">{item.simplified}</span> },
              { key: 'pinyin', label: 'Pinyin', render: (item) => item.pinyin },
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
