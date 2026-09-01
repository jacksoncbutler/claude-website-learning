import { getPinyinItems, getPinyinInitials, getPinyinFinals, getValidPinyinSyllableBases, resolveAudioSrc } from '@/lib/content/loaders';
import { PinyinTableClient, type PinyinTableItem } from '@/components/pinyin/PinyinTableClient';

export default function PinyinTablePage() {
  const items: PinyinTableItem[] = getPinyinItems().map((item) => {
    const { src, available } = resolveAudioSrc(item.audioId);
    return { ...item, audioSrc: src, audioAvailable: available };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Pinyin Syllable Chart</h1>
        <p className="mt-1 text-neutral-500">
          A dash marks combinations that don&apos;t occur in Mandarin; a dot marks ones that just haven&apos;t been
          added to the data yet.
        </p>
      </div>

      <PinyinTableClient
        items={items}
        initials={getPinyinInitials()}
        finals={getPinyinFinals()}
        validBases={[...getValidPinyinSyllableBases()]}
      />
    </div>
  );
}
