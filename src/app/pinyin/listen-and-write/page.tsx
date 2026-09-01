import { getPinyinItems, getPinyinInitials, getPinyinFinals, resolveAudioSrc } from '@/lib/content/loaders';
import { PinyinListenAndWriteSetup } from '@/components/pinyin/PinyinListenAndWriteSetup';
import type { PinyinTableItem } from '@/components/pinyin/PinyinTableClient';

export default function PinyinListenAndWritePage() {
  const items: PinyinTableItem[] = getPinyinItems().map((item) => {
    const { src, available } = resolveAudioSrc(item.audioId);
    return { ...item, audioSrc: src, audioAvailable: available };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Listen and Write</h1>
        <p className="mt-1 text-neutral-500">Hear a syllable, then type the pinyin you heard.</p>
      </div>

      <PinyinListenAndWriteSetup items={items} initials={getPinyinInitials()} finals={getPinyinFinals()} />
    </div>
  );
}
