#!/usr/bin/env node
/**
 * Downloads pronunciation audio for every syllable currently in
 * src/data/pinyin/syllables.json from davinfifield/mp3-chinese-pinyin-sound
 * (public domain, Unlicense — https://github.com/davinfifield/mp3-chinese-pinyin-sound),
 * whose filenames already match our `pinyinNumeric` convention
 * (`{syllable}{toneNumber}.mp3`, e.g. "ma1.mp3").
 *
 * Writes downloaded files to public/audio/pinyin/ and (re)writes
 * src/data/audio/audio-assets.json to register exactly the files that were
 * actually found — a 404 for a given syllable (some rare syllables, e.g.
 * lüe/nüe, aren't in this recording set) is skipped, not an error; that
 * item's AudioButton just stays disabled until audio for it exists.
 *
 * Run from the repo root: node scripts/fetch-pinyin-audio.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'public', 'audio', 'pinyin');
const SOURCE_BASE = 'https://raw.githubusercontent.com/davinfifield/mp3-chinese-pinyin-sound/master/mp3';

const syllables = JSON.parse(await import('node:fs').then((fs) => fs.readFileSync(path.join(ROOT, 'src/data/pinyin/syllables.json'), 'utf8')));

mkdirSync(AUDIO_DIR, { recursive: true });

const CONCURRENCY = 12;
const ids = [...new Set(syllables.map((s) => s.pinyinNumeric))];
const results = new Map(); // id -> boolean (found)

async function fetchOne(id) {
  const url = `${SOURCE_BASE}/${id}.mp3`;
  const res = await fetch(url);
  if (res.status === 200) {
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(path.join(AUDIO_DIR, `${id}.mp3`), buf);
    results.set(id, true);
  } else {
    results.set(id, false);
  }
}

async function run() {
  let cursor = 0;
  async function worker() {
    while (cursor < ids.length) {
      const id = ids[cursor++];
      try {
        await fetchOne(id);
      } catch (err) {
        console.error(`Error fetching ${id}:`, err.message);
        results.set(id, false);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
}

await run();

const found = ids.filter((id) => results.get(id));
const missing = ids.filter((id) => !results.get(id));

const audioAssets = found.map((id) => ({
  id: `audio-${id}`,
  file: `pinyin/${id}.mp3`,
  source: 'davinfifield/mp3-chinese-pinyin-sound (Unlicense / public domain)',
}));

writeFileSync(
  path.join(ROOT, 'src/data/audio/audio-assets.json'),
  JSON.stringify(audioAssets, null, 2) + '\n',
);

console.log(`Downloaded ${found.length}/${ids.length} audio files.`);
if (missing.length > 0) {
  console.log(`No recording found for: ${missing.join(', ')}`);
}
