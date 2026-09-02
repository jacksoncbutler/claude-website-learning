/**
 * Zod schemas mirroring src/lib/content/types.ts, used to validate every
 * data file at load time. `.passthrough()` on LearningItem lets JSON carry
 * fields the TS type hasn't caught up to yet without failing validation —
 * new optional fields are the intended extension path, not this escape
 * hatch, but it keeps data authoring from being blocked on a type change.
 */
import { z } from 'zod';

export const ItemKindSchema = z.enum(['pinyin-syllable', 'radical', 'hanzi', 'word', 'phrase']);

export const ExampleSentenceSchema = z.object({
  hanzi: z.string(),
  pinyin: z.string().optional(),
  translation: z.string().optional(),
});

export const ToneNumberSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const HskLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);

export const LearningItemSchema = z
  .object({
    id: z.string(),
    kind: ItemKindSchema,

    pinyin: z.string().optional(),
    pinyinNumeric: z.string().optional(),
    toneNumber: ToneNumberSchema.optional(),

    simplified: z.string().optional(),
    traditional: z.string().optional(),

    definitions: z.array(z.string()).optional(),
    partOfSpeech: z.array(z.string()).optional(),

    hskLevel: HskLevelSchema.optional(),
    strokeCount: z.number().optional(),

    radicalComponents: z.array(z.string()).optional(),
    relatedItemIds: z.array(z.string()).optional(),

    exampleSentences: z.array(ExampleSentenceSchema).optional(),
    mnemonic: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
    source: z.string().optional(),

    audioId: z.string().optional(),

    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough();

export const PinyinSyllableItemSchema = LearningItemSchema.extend({
  kind: z.literal('pinyin-syllable'),
  initial: z.string(),
  final: z.string(),
  syllableBase: z.string(),
  toneNumber: ToneNumberSchema,
  pinyin: z.string(),
  pinyinNumeric: z.string(),
});

export const RadicalItemSchema = LearningItemSchema.extend({
  kind: z.literal('radical'),
  kangxiNumber: z.number(),
  simplified: z.string(),
  traditional: z.string(),
  pinyin: z.string(),
  pinyinNumeric: z.string(),
  strokeCount: z.number(),
});

export const AudioAssetSchema = z.object({
  id: z.string(),
  file: z.string(),
  voice: z.string().optional(),
  source: z.string().optional(),
  createdAt: z.string().optional(),
});

export const ProverbSchema = z.object({
  id: z.string(),
  hanzi: z.string(),
  pinyin: z.string().optional(),
  translation: z.string().optional(),
  source: z.string().optional(),
});

/** Parses and validates an array of pinyin syllable items, throwing with a
 * clear message on the first invalid entry rather than failing silently. */
export function parsePinyinSyllables(data: unknown) {
  return z.array(PinyinSyllableItemSchema).parse(data);
}

export function parseAudioAssets(data: unknown) {
  return z.array(AudioAssetSchema).parse(data);
}

export function parseProverbs(data: unknown) {
  return z.array(ProverbSchema).parse(data);
}

export function parseRadicals(data: unknown) {
  return z.array(RadicalItemSchema).parse(data);
}
