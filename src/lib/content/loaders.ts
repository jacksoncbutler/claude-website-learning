/**
 * Data-access layer: every place in the app that needs content data goes
 * through here rather than importing JSON directly. This is the seam that
 * would let the JSON files be swapped for a real database later without
 * touching any component.
 */
import fs from 'node:fs';
import path from 'node:path';

import rawSyllables from '@/data/pinyin/syllables.json';
import rawInitials from '@/data/pinyin/initials.json';
import rawFinals from '@/data/pinyin/finals.json';
import rawValidSyllables from '@/data/pinyin/valid-syllables.json';
import rawAudioAssets from '@/data/audio/audio-assets.json';
import rawProverbs from '@/data/proverbs/proverbs.json';
import rawRadicals from '@/data/radicals/radicals.json';

import { parsePinyinSyllables, parseAudioAssets, parseProverbs, parseRadicals } from './schema';
import type { AudioAsset, ModuleDefinition, PinyinSyllableItem, Proverb, RadicalItem } from './types';
import { getModules as getModuleRegistry } from './modules';
import { withBasePath } from '@/lib/basePath';

export interface PinyinInitial {
  id: string;
  symbol: string;
}

export interface PinyinFinal {
  id: string;
  symbol: string;
}

// --- Pinyin -----------------------------------------------------------

export function getPinyinItems(): PinyinSyllableItem[] {
  return parsePinyinSyllables(rawSyllables) as PinyinSyllableItem[];
}

export function getPinyinInitials(): PinyinInitial[] {
  return rawInitials as PinyinInitial[];
}

export function getPinyinFinals(): PinyinFinal[] {
  return rawFinals as PinyinFinal[];
}

/** Toneless syllable bases that are phonologically valid for the initials
 * currently covered by the data set (see scripts/generate-pinyin-data.mjs). */
export function getValidPinyinSyllableBases(): Set<string> {
  return new Set(rawValidSyllables as string[]);
}

// --- Audio --------------------------------------------------------------

let audioAssetsById: Map<string, AudioAsset> | null = null;

function getAudioAssetsById(): Map<string, AudioAsset> {
  if (!audioAssetsById) {
    const assets = parseAudioAssets(rawAudioAssets);
    audioAssetsById = new Map(assets.map((asset) => [asset.id, asset]));
  }
  return audioAssetsById;
}

export function getAudioAsset(audioId?: string): AudioAsset | undefined {
  if (!audioId) return undefined;
  return getAudioAssetsById().get(audioId);
}

export interface ResolvedAudio {
  src: string;
  available: boolean;
}

/**
 * Resolves an audioId to a playable URL, checking on the server that the
 * file actually exists on disk. Callers (AudioButton) never have to guess:
 * `available: false` covers "no audioId", "unknown audioId", and "file
 * missing" uniformly.
 */
export function resolveAudioSrc(audioId?: string): ResolvedAudio {
  const asset = getAudioAsset(audioId);
  if (!asset) return { src: '', available: false };

  const absolutePath = path.join(process.cwd(), 'public', 'audio', asset.file);
  const available = fs.existsSync(absolutePath);
  // withBasePath: files under /public are served as-is by Next, so a plain
  // "/audio/..." string (unlike next/link) needs the GitHub Pages basePath
  // added by hand — see src/lib/basePath.ts.
  return { src: withBasePath(`/audio/${asset.file}`), available };
}

// --- Radicals -------------------------------------------------------

export function getRadicals(): RadicalItem[] {
  return parseRadicals(rawRadicals) as RadicalItem[];
}

// --- Proverbs -------------------------------------------------------

export function getProverbs(): Proverb[] {
  return parseProverbs(rawProverbs);
}

// --- Modules --------------------------------------------------------

export function getModules(): ModuleDefinition[] {
  return getModuleRegistry();
}
