import { getProverbs } from '@/lib/content/loaders';
import { DailyProverbClient } from './DailyProverbClient';

export function DailyProverb() {
  return <DailyProverbClient proverbs={getProverbs()} />;
}
