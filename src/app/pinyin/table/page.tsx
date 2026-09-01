import { getPinyinItems, getPinyinInitials, getPinyinFinals, getValidPinyinSyllableBases, resolveAudioSrc } from '@/lib/content/loaders';
import { TableView } from '@/components/views/TableView';
import { AudioButton } from '@/components/audio/AudioButton';
import type { PinyinSyllableItem } from '@/lib/content/types';

export default function PinyinTablePage() {
  const allItems = getPinyinItems();
  // One representative (tone 1) syllable per cell — the classic chart shows
  // base syllables; tone contrast is covered by the flashcard view.
  const baseItems = allItems.filter((item) => item.toneNumber === 1);

  const initials = getPinyinInitials();
  const finals = getPinyinFinals();
  const validBases = getValidPinyinSyllableBases();
  const finalSymbolById = new Map(finals.map((f) => [f.id, f.symbol]));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Pinyin Syllable Chart</h1>
        <p className="mt-1 text-neutral-500">
          Click a syllable to hear it pronounced. A dash marks combinations that don&apos;t occur in Mandarin; a dot
          marks ones that just haven&apos;t been added to the data yet.
        </p>
      </div>

      <TableView<PinyinSyllableItem>
        mode="grid"
        items={baseItems}
        rows={initials.map((i) => i.id)}
        columns={finals.map((f) => f.id)}
        getRowKey={(item) => item.initial}
        getColKey={(item) => item.final}
        rowLabel={(row) => row}
        columnLabel={(col) => finalSymbolById.get(col) ?? col}
        isValidCombination={(row, col) => validBases.has(`${row}${col}`)}
        renderCell={(cellItems, _row, _col, valid) => {
          if (!valid) {
            return (
              <span className="text-neutral-200" aria-hidden="true">
                —
              </span>
            );
          }
          const item = cellItems[0];
          if (!item) {
            return (
              <span className="text-neutral-300" aria-hidden="true">
                ·
              </span>
            );
          }
          const { src, available } = resolveAudioSrc(item.audioId);
          return (
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-medium">{item.pinyin}</span>
              <AudioButton src={src} available={available} label={`Play ${item.pinyin}`} />
            </div>
          );
        }}
      />
    </div>
  );
}
