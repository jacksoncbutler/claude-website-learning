#!/usr/bin/env node
/**
 * Generates src/data/pinyin/{initials,finals,valid-syllables,syllables}.json
 * from the tables below, covering the full standard Mandarin pinyin
 * inventory: all 21 initials (b p m f d t n l g k h j q x zh ch sh r z c s)
 * plus the zero-initial row (a, wu, yi, yu, ...).
 *
 * This is a one-time-per-edit authoring tool, not part of the app runtime.
 * To extend or correct coverage later:
 *   1. Edit INITIAL_FINALS (and FAMILIES for fully tone-authored examples).
 *   2. Run: node scripts/generate-pinyin-data.mjs
 *   3. Run: node scripts/fetch-pinyin-audio.mjs   (re-fetches audio to match)
 *
 * Run from the repo root.
 *
 * --- A note on the data model ---
 * `final` is a *phonological* final id, not always the literal spelling:
 *  - 'v'/'ve'/'van'/'vn' stand for ü/üe/üan/ün. They're spelled differently
 *    depending on initial: literally as ü/üe after n/l (nü, lüe — the dots
 *    are required there since nu/nü and lu/lü are distinct syllables);
 *    with the dots silently dropped after j/q/x (ju, quan, xun — no
 *    ambiguity, j/q/x never combine with the plain u-row); and with a
 *    "yu-" prefix for the zero-initial (yu, yuan, yun).
 *  - The zero-initial row additionally rewrites i-row finals with a "y-"
 *    prefix (i -> yi, iu -> you, ...) and u-row finals with a "w-" prefix
 *    (u -> wu, un -> wen, ...), per standard pinyin orthography.
 *  - Everywhere else, `final` is already the literal spelling.
 * Grid columns are keyed by this phonological `final`, so e.g. ju/qu/xu/yu
 * all land in the "ü" column even though only nu/lu's ü is visibly dotted.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'src', 'data', 'pinyin');

// --- Coverage: initial -> its valid phonological finals ---------------
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
  j: ['i', 'ia', 'ie', 'iao', 'iu', 'ian', 'in', 'iang', 'ing', 'iong', 'v', 've', 'van', 'vn'],
  q: ['i', 'ia', 'ie', 'iao', 'iu', 'ian', 'in', 'iang', 'ing', 'iong', 'v', 've', 'van', 'vn'],
  x: ['i', 'ia', 'ie', 'iao', 'iu', 'ian', 'in', 'iang', 'ing', 'iong', 'v', 've', 'van', 'vn'],
  zh: ['a', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'i', 'u', 'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang'],
  ch: ['a', 'e', 'ai', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'i', 'u', 'uo', 'uai', 'ui', 'uan', 'un', 'uang'],
  sh: ['a', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'i', 'u', 'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang'],
  r: ['e', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'i', 'u', 'uo', 'ui', 'uan', 'un'],
  z: ['a', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'i', 'u', 'uo', 'ui', 'uan', 'un'],
  c: ['a', 'e', 'ai', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'i', 'u', 'uo', 'ui', 'uan', 'un'],
  s: ['a', 'e', 'ai', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'i', 'u', 'uo', 'ui', 'uan', 'un'],
  // Zero-initial: no leading consonant. Spelling is rewritten by spell().
  '': ['a', 'o', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'er',
       'i', 'ia', 'ie', 'iao', 'iu', 'ian', 'in', 'iang', 'ing', 'iong',
       'u', 'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang', 'ueng',
       'v', 've', 'van', 'vn'],
};

// Pedagogical column order (not alphabetical) — plain vowels, then the
// i-row, then the u-row, then the true ü-row.
const FINAL_ORDER = [
  'a', 'o', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'er',
  'i', 'ia', 'ie', 'iao', 'iu', 'ian', 'in', 'iang', 'ing', 'iong',
  'u', 'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang', 'ueng',
  'v', 've', 'van', 'vn',
];
const FINAL_SYMBOLS = { v: 'ü', ve: 'üe', van: 'üan', vn: 'ün' };

const INITIAL_ORDER = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', ''];

// --- Fully-authored multi-tone families (demonstrate real tone contrast) ---
// 'v' is the ASCII stand-in for ü used throughout this file's toneless keys.
const FAMILIES = {
  ma: {
    tones: {
      1: { definitions: ['mother'], simplified: '妈', traditional: '媽' },
      2: { definitions: ['hemp', 'numb'], simplified: '麻', traditional: '麻' },
      3: { definitions: ['horse'], simplified: '马', traditional: '馬' },
      4: { definitions: ['to scold'], simplified: '骂', traditional: '罵' },
      5: { definitions: ['(question particle)'], simplified: '吗', traditional: '嗎' },
    },
  },
  hao: {
    tones: {
      1: { definitions: ['mugwort'], simplified: '蒿', traditional: '蒿' },
      2: { definitions: ['a tenth of a unit; extremely small amount'], simplified: '毫', traditional: '毫' },
      3: { definitions: ['good', 'well'], simplified: '好', traditional: '好' },
      4: { definitions: ['number', 'day of the month'], simplified: '号', traditional: '號' },
    },
  },
  hu: {
    tones: {
      1: { definitions: ['to exhale', 'to shout'], simplified: '呼', traditional: '呼' },
      2: { definitions: ['lake'], simplified: '湖', traditional: '湖' },
      3: { definitions: ['tiger'], simplified: '虎', traditional: '虎' },
      4: { definitions: ['door', 'household'], simplified: '户', traditional: '戶' },
    },
  },
  fa: {
    tones: {
      1: { definitions: ['to send out', 'to occur'], simplified: '发', traditional: '發' },
      2: { definitions: ['to punish', 'lacking'], simplified: '罚', traditional: '罰' },
      3: { definitions: ['law', 'method'], simplified: '法', traditional: '法' },
      4: { definitions: ['hair'], simplified: '发', traditional: '髮' },
    },
  },
  xie: {
    tones: {
      1: { definitions: ['scorpion'], simplified: '蝎', traditional: '蠍' },
      2: { definitions: ['shoe'], simplified: '鞋', traditional: '鞋' },
      3: { definitions: ['to write'], simplified: '写', traditional: '寫' },
      4: { definitions: ['thanks'], simplified: '谢', traditional: '謝' },
    },
  },
  shi: {
    tones: {
      1: { definitions: ['poem'], simplified: '诗', traditional: '詩' },
      2: { definitions: ['ten', 'time'], simplified: '十', traditional: '十' },
      3: { definitions: ['history', 'to make/cause'], simplified: '史', traditional: '史' },
      4: { definitions: ['to be', 'matter'], simplified: '是', traditional: '是' },
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
  v: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ'],
};

function applyTone(base, toneNumber) {
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
  const marked = TONE_MARKS[target][toneNumber];
  return (base.slice(0, idx) + marked + base.slice(idx + 1)).replace(/v/g, 'ü');
}

// Zero-initial spelling rewrites (y-/w-/yu- prefixes). Finals not listed
// here (a, o, e, ai, ei, ao, ou, an, en, ang, eng, er) are written as-is.
const ZERO_INITIAL_SPELLING = {
  i: 'yi', ia: 'ya', ie: 'ye', iao: 'yao', iu: 'you', ian: 'yan', in: 'yin', iang: 'yang', ing: 'ying', iong: 'yong',
  u: 'wu', ua: 'wa', uo: 'wo', uai: 'wai', ui: 'wei', uan: 'wan', un: 'wen', uang: 'wang', ueng: 'weng',
  v: 'yu', ve: 'yue', van: 'yuan', vn: 'yun',
};

// Standard pinyin orthography rewrites (spelling conventions, not sound
// changes) applied to the toneless initial+final concatenation.
function spell(initial, final) {
  if (initial === '') {
    return ZERO_INITIAL_SPELLING[final] ?? final;
  }
  if ((initial === 'j' || initial === 'q' || initial === 'x') && final.startsWith('v')) {
    // ü after j/q/x is written as plain u — never ambiguous with the real
    // u-row, since j/q/x never combine with it.
    return initial + 'u' + final.slice(1);
  }
  return initial + final;
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
        // Base-grid authoring scope: tone 1 only.
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

const initials = INITIAL_ORDER.filter((id) => id in INITIAL_FINALS).map((id) => ({
  id,
  symbol: id === '' ? '∅' : id,
}));

const finalsUsedSet = new Set(Object.values(INITIAL_FINALS).flat());
const finalsUsed = FINAL_ORDER.filter((id) => finalsUsedSet.has(id)).map((id) => ({
  id,
  symbol: FINAL_SYMBOLS[id] ?? id,
}));

mkdirSync(DATA_DIR, { recursive: true });
writeFileSync(path.join(DATA_DIR, 'initials.json'), JSON.stringify(initials, null, 2) + '\n');
writeFileSync(path.join(DATA_DIR, 'finals.json'), JSON.stringify(finalsUsed, null, 2) + '\n');
writeFileSync(path.join(DATA_DIR, 'valid-syllables.json'), JSON.stringify(validBases, null, 2) + '\n');
writeFileSync(path.join(DATA_DIR, 'syllables.json'), JSON.stringify(items, null, 2) + '\n');

console.log(`Wrote ${items.length} syllable items across ${initials.length} initials and ${finalsUsed.length} finals.`);
