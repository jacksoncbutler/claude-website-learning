#!/usr/bin/env node
/**
 * Generates src/data/pinyin/{initials,finals,valid-syllables,syllables}.json
 * from the small tables below.
 *
 * This is a one-time-per-edit authoring tool, not part of the app runtime.
 * To extend pinyin coverage later (e.g. add the j/q/x or zh/ch/sh/r rows):
 *   1. Add the initial + its valid finals to INITIAL_FINALS below.
 *   2. Optionally add a fully-authored multi-tone FAMILY for it.
 *   3. Run: node scripts/generate-pinyin-data.mjs
 *
 * Run from the repo root.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'src', 'data', 'pinyin');

// --- Coverage: initial -> its valid toneless finals ------------------------
// Deliberately scoped to the first initials taught in the reference method
// (labials, alveolars, velars). Expand this table to add more rows later.
const INITIAL_FINALS = {
  b: ['a', 'o', 'ai', 'ei', 'ao', 'an', 'en', 'ang', 'eng', 'i', 'ie', 'iao', 'ian', 'in', 'ing', 'u'],
  p: ['a', 'o', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'i', 'ie', 'iao', 'ian', 'in', 'ing', 'u'],
  m: ['a', 'o', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'i', 'ie', 'iao', 'iu', 'ian', 'in', 'ing', 'u'],
  f: ['a', 'o', 'ei', 'ou', 'an', 'en', 'ang', 'eng', 'u'],
  d: ['a', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'ang', 'eng', 'ong', 'i', 'ia', 'ie', 'iao', 'iu', 'ian', 'ing', 'u', 'uo', 'ui', 'uan', 'un'],
  t: ['a', 'e', 'ai', 'ao', 'ou', 'an', 'ang', 'eng', 'ong', 'i', 'ie', 'iao', 'ian', 'ing', 'u', 'uo', 'ui', 'uan', 'un'],
  n: ['a', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'i', 'ia', 'ie', 'iao', 'iu', 'ian', 'in', 'iang', 'ing', 'u', 'uo', 'uan', 'v', 've'],
  l: ['a', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'ang', 'eng', 'ong', 'i', 'ia', 'ie', 'iao', 'iu', 'ian', 'in', 'iang', 'ing', 'u', 'uo', 'uan', 'un', 'v', 've'],
  g: ['a', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'u', 'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang'],
  k: ['a', 'e', 'ai', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'u', 'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang'],
  h: ['a', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'u', 'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang'],
};

// --- Fully-authored multi-tone families (demonstrate real tone contrast) ---
// 'v' is the ASCII stand-in for ü used throughout this file's toneless keys.
const FAMILIES = {
  ma: {
    initial: 'm',
    final: 'a',
    tones: {
      1: { definitions: ['mother'], simplified: '妈', traditional: '媽' },
      2: { definitions: ['hemp', 'numb'], simplified: '麻', traditional: '麻' },
      3: { definitions: ['horse'], simplified: '马', traditional: '馬' },
      4: { definitions: ['to scold'], simplified: '骂', traditional: '罵' },
      5: { definitions: ['(question particle)'], simplified: '吗', traditional: '嗎' },
    },
  },
  hao: {
    initial: 'h',
    final: 'ao',
    tones: {
      1: { definitions: ['mugwort'], simplified: '蒿', traditional: '蒿' },
      2: { definitions: ['a tenth of a unit; extremely small amount'], simplified: '毫', traditional: '毫' },
      3: { definitions: ['good', 'well'], simplified: '好', traditional: '好' },
      4: { definitions: ['number', 'day of the month'], simplified: '号', traditional: '號' },
    },
  },
  hu: {
    initial: 'h',
    final: 'u',
    tones: {
      1: { definitions: ['to exhale', 'to shout'], simplified: '呼', traditional: '呼' },
      2: { definitions: ['lake'], simplified: '湖', traditional: '湖' },
      3: { definitions: ['tiger'], simplified: '虎', traditional: '虎' },
      4: { definitions: ['door', 'household'], simplified: '户', traditional: '戶' },
    },
  },
  fa: {
    initial: 'f',
    final: 'a',
    tones: {
      1: { definitions: ['to send out', 'to occur'], simplified: '发', traditional: '發' },
      2: { definitions: ['to punish', 'lacking'], simplified: '罚', traditional: '罰' },
      3: { definitions: ['law', 'method'], simplified: '法', traditional: '法' },
      4: { definitions: ['hair'], simplified: '发', traditional: '髮' },
    },
  },
};

// --- Tone-mark placement -----------------------------------------------
const TONE_MARKS = {
  a: ['a', 'ā', 'á', 'ǎ', 'à'],
  e: ['e', 'ē', 'é', 'ě', 'è'],
  o: ['o', 'ō', 'ó', 'ǒ', 'ò'],
  i: ['i', 'ī', 'í', 'ǐ', 'ì'],
  u: ['u', 'ū', 'ú', 'ǔ', 'ù'],
  v: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ'], // ü has no unmarked bare form in pinyin text, but keep index 0 for consistency
};

function applyTone(base, toneNumber) {
  // toneNumber 5 (neutral) carries no diacritic.
  if (toneNumber === 5) return base.replace(/v/g, 'ü');
  let target;
  if (base.includes('iu')) target = 'u';
  else if (base.includes('ui')) target = 'i';
  else if (base.includes('a')) target = 'a';
  else if (base.includes('e')) target = 'e';
  else if (base.includes('o')) target = 'o';
  else if (base.includes('i')) target = 'i';
  else if (base.includes('u')) target = 'u';
  else if (base.includes('v')) target = 'v';
  else throw new Error(`No vowel found to mark in "${base}"`);

  const idx = base.lastIndexOf(target);
  const marked = TONE_MARKS[target][toneNumber][0] === undefined
    ? TONE_MARKS[target][toneNumber]
    : TONE_MARKS[target][toneNumber];
  return (base.slice(0, idx) + marked + base.slice(idx + 1)).replace(/v/g, 'ü');
}

// Standard pinyin orthography rewrites (spelling conventions, not sound
// changes) applied to the toneless initial+final concatenation.
function spell(initial, final) {
  let f = final;
  // i after z/c/s/zh/ch/sh/r has no dedicated final in this phase; not needed yet.
  if ((initial === 'j' || initial === 'q' || initial === 'x' || initial === '') && f.startsWith('v')) {
    // ü after j/q/x/y is written 'u' (not used by current 11 initials, kept for future rows)
    f = 'u' + f.slice(1);
  }
  if (final === 'iu') f = 'iu'; // "iou" contraction already written as iu
  if (final === 'ui') f = 'ui'; // "uei" contraction already written as ui
  if (final === 'un' && (initial === 'l' || initial === 'j' || initial === 'q' || initial === 'x')) {
    // "ün" for these initials; represented as final 'v' + n in future extension, not needed for l here since l+un is real "lun" (u, not ü).
  }
  return initial + f;
}

function buildSyllables() {
  const items = [];
  const validBases = [];

  for (const [initial, finals] of Object.entries(INITIAL_FINALS)) {
    for (const final of finals) {
      const base = spell(initial, final);
      validBases.push(base);
      const family = FAMILIES[base];

      if (family) {
        for (const [toneStr, info] of Object.entries(family.tones)) {
          const toneNumber = Number(toneStr);
          const pinyin = applyTone(base, toneNumber);
          items.push({
            id: `pinyin-${base}${toneNumber}`,
            kind: 'pinyin-syllable',
            initial,
            final,
            syllableBase: base,
            toneNumber,
            pinyin,
            pinyinNumeric: `${base}${toneNumber}`,
            simplified: info.simplified,
            traditional: info.traditional,
            definitions: info.definitions,
            // Convention-based: matches davinfifield/mp3-chinese-pinyin-sound
            // filenames (see scripts/fetch-pinyin-audio.mjs). Resolves to
            // "not available" gracefully if no matching file was fetched.
            audioId: `audio-${base}${toneNumber}`,
          });
        }
      } else {
        // Phase-1 authoring scope: tone 1 only for the base grid.
        const toneNumber = 1;
        const pinyin = applyTone(base, toneNumber);
        items.push({
          id: `pinyin-${base}${toneNumber}`,
          kind: 'pinyin-syllable',
          initial,
          final,
          syllableBase: base,
          toneNumber,
          pinyin,
          pinyinNumeric: `${base}${toneNumber}`,
          audioId: `audio-${base}${toneNumber}`,
        });
      }
    }
  }

  return { items, validBases: [...new Set(validBases)].sort() };
}

const { items, validBases } = buildSyllables();

const initials = Object.keys(INITIAL_FINALS).map((id) => ({ id, symbol: id }));

const finalsUsed = [...new Set(Object.values(INITIAL_FINALS).flat())]
  .sort()
  .map((id) => ({ id, symbol: id.replace('v', 'ü') }));

mkdirSync(DATA_DIR, { recursive: true });
writeFileSync(path.join(DATA_DIR, 'initials.json'), JSON.stringify(initials, null, 2) + '\n');
writeFileSync(path.join(DATA_DIR, 'finals.json'), JSON.stringify(finalsUsed, null, 2) + '\n');
writeFileSync(path.join(DATA_DIR, 'valid-syllables.json'), JSON.stringify(validBases, null, 2) + '\n');
writeFileSync(path.join(DATA_DIR, 'syllables.json'), JSON.stringify(items, null, 2) + '\n');

console.log(`Wrote ${items.length} syllable items across ${initials.length} initials and ${finalsUsed.length} finals.`);
