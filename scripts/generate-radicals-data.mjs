#!/usr/bin/env node
/**
 * Generates src/data/radicals/radicals.json from the table below: the
 * standard Kangxi radicals #1-100 (of the full 214), grouped by stroke
 * count ascending — the universal convention for radical charts, and
 * exactly how the Kangxi index itself is organized. This set is also the
 * 100 lowest-stroke-count radicals, which is why it doubles as the
 * standard "start here" beginner set most courses use.
 *
 * Radicals #1-100 are all 1-5 strokes, a range where the simplified and
 * traditional Chinese writing systems don't diverge (character
 * simplification mostly affected higher-numbered, more complex radicals —
 * e.g. 言→讠 is #149, 金→钅 is #167, 馬→马 is #187 — none of which are in
 * this set). Several DO have positional variant forms though (e.g. 人 is
 * written 亻 on the left side of a character); those are recorded in
 * `notes`, with the standalone form used as both `simplified` and
 * `traditional`.
 *
 * To extend later (the remaining Kangxi radicals #101-214, which do need
 * real traditional/simplified distinctions), add rows below and re-run:
 *   node scripts/generate-radicals-data.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'src', 'data', 'radicals');

// [Kangxi number, form(s) - primary first, '/' separated variants, pinyin (toned), meaning, stroke count]
const RADICALS = [
  [1, '一', 'yī', 'one', 1],
  [2, '丨', 'gǔn', 'line, stick', 1],
  [3, '丶', 'zhǔ', 'dot', 1],
  [4, '丿', 'piě', 'slash', 1],
  [5, '乙/乚', 'yǐ', 'second; twisting', 1],
  [6, '亅', 'jué', 'hook', 1],
  [7, '二', 'èr', 'two', 2],
  [8, '亠', 'tóu', 'lid', 2],
  [9, '人/亻', 'rén', 'person', 2],
  [10, '儿', 'ér', 'legs; son', 2],
  [11, '入', 'rù', 'enter', 2],
  [12, '八', 'bā', 'eight', 2],
  [13, '冂', 'jiōng', 'borders, wide', 2],
  [14, '冖', 'mì', 'cover', 2],
  [15, '冫', 'bīng', 'ice', 2],
  [16, '几', 'jī', 'small table', 2],
  [17, '凵', 'kǎn', 'open box', 2],
  [18, '刀/刂', 'dāo', 'knife', 2],
  [19, '力', 'lì', 'power', 2],
  [20, '勹', 'bāo', 'wrap', 2],
  [21, '匕', 'bǐ', 'spoon, ladle', 2],
  [22, '匚', 'fāng', 'box', 2],
  [23, '匸', 'xì', 'hiding enclosure', 2],
  [24, '十', 'shí', 'ten', 2],
  [25, '卜', 'bǔ', 'divination', 2],
  [26, '卩/㔾', 'jié', 'seal', 2],
  [27, '厂', 'hàn', 'cliff', 2],
  [28, '厶', 'sī', 'private', 2],
  [29, '又', 'yòu', 'again; right hand', 2],
  [30, '口', 'kǒu', 'mouth', 3],
  [31, '囗', 'wéi', 'enclosure', 3],
  [32, '土', 'tǔ', 'earth', 3],
  [33, '士', 'shì', 'scholar', 3],
  [34, '夂', 'zhǐ', 'go, follow', 3],
  [35, '夊', 'suī', 'go slowly', 3],
  [36, '夕', 'xī', 'evening', 3],
  [37, '大', 'dà', 'big', 3],
  [38, '女', 'nǚ', 'woman', 3],
  [39, '子', 'zǐ', 'child', 3],
  [40, '宀', 'mián', 'roof', 3],
  [41, '寸', 'cùn', 'inch', 3],
  [42, '小', 'xiǎo', 'small', 3],
  [43, '尢/尣', 'wāng', 'lame', 3],
  [44, '尸', 'shī', 'corpse', 3],
  [45, '屮', 'chè', 'sprout', 3],
  [46, '山', 'shān', 'mountain', 3],
  [47, '巛/川', 'chuān', 'river', 3],
  [48, '工', 'gōng', 'work', 3],
  [49, '己', 'jǐ', 'self', 3],
  [50, '巾', 'jīn', 'cloth', 3],
  [51, '干', 'gān', 'shield; dry', 3],
  [52, '幺', 'yāo', 'tiny, young', 3],
  [53, '广', 'guǎng', 'shelter', 3],
  [54, '廴', 'yǐn', 'long stride', 3],
  [55, '廾', 'gǒng', 'two hands, clasp', 3],
  [56, '弋', 'yì', 'shoot; take', 3],
  [57, '弓', 'gōng', 'bow', 3],
  [58, '彐/彑', 'jì', 'snout', 3],
  [59, '彡', 'shān', 'bristle, hair', 3],
  [60, '彳', 'chì', 'step', 3],
  [61, '心/忄', 'xīn', 'heart', 4],
  [62, '戈', 'gē', 'halberd, spear', 4],
  [63, '戶/户', 'hù', 'door', 4],
  [64, '手/扌', 'shǒu', 'hand', 4],
  [65, '支', 'zhī', 'branch', 4],
  [66, '攴/攵', 'pū', 'rap, tap', 4],
  [67, '文', 'wén', 'script, culture', 4],
  [68, '斗', 'dǒu', 'dipper, measure', 4],
  [69, '斤', 'jīn', 'axe', 4],
  [70, '方', 'fāng', 'square, direction', 4],
  [71, '无', 'wú', 'not, without', 4],
  [72, '日', 'rì', 'sun, day', 4],
  [73, '曰', 'yuē', 'say', 4],
  [74, '月', 'yuè', 'moon, month', 4],
  [75, '木', 'mù', 'tree, wood', 4],
  [76, '欠', 'qiàn', 'lack; yawn', 4],
  [77, '止', 'zhǐ', 'stop', 4],
  [78, '歹', 'dǎi', 'death, bad', 4],
  [79, '殳', 'shū', 'weapon, lance', 4],
  [80, '毋', 'wú', 'do not', 4],
  [81, '比', 'bǐ', 'compare', 4],
  [82, '毛', 'máo', 'fur, hair', 4],
  [83, '氏', 'shì', 'clan', 4],
  [84, '气', 'qì', 'steam, air', 4],
  [85, '水/氵/氺', 'shuǐ', 'water', 4],
  [86, '火/灬', 'huǒ', 'fire', 4],
  [87, '爪/爫', 'zhǎo', 'claw', 4],
  [88, '父', 'fù', 'father', 4],
  [89, '爻', 'yáo', 'trigrams', 4],
  [90, '爿/丬', 'qiáng', 'half tree trunk, bed', 4],
  [91, '片', 'piàn', 'slice, slab', 4],
  [92, '牙', 'yá', 'fang, tooth', 4],
  [93, '牛/牜', 'niú', 'cow, ox', 4],
  [94, '犬/犭', 'quǎn', 'dog', 4],
  [95, '玄', 'xuán', 'profound, dark', 5],
  [96, '玉/王/玊', 'yù', 'jade', 5],
  [97, '瓜', 'guā', 'melon', 5],
  [98, '瓦', 'wǎ', 'tile', 5],
  [99, '甘', 'gān', 'sweet', 5],
  [100, '生', 'shēng', 'life, birth', 5],
];

// Reverse-lookup for tone marks -> {plain vowel, tone number}. We already
// know the correct tone from hand-typing the marked pinyin above, so this
// just needs to find and strip it, not re-derive placement.
const TONE_REVERSE = {
  ā: ['a', 1], á: ['a', 2], ǎ: ['a', 3], à: ['a', 4],
  ē: ['e', 1], é: ['e', 2], ě: ['e', 3], è: ['e', 4],
  ī: ['i', 1], í: ['i', 2], ǐ: ['i', 3], ì: ['i', 4],
  ō: ['o', 1], ó: ['o', 2], ǒ: ['o', 3], ò: ['o', 4],
  ū: ['u', 1], ú: ['u', 2], ǔ: ['u', 3], ù: ['u', 4],
  ǖ: ['ü', 1], ǘ: ['ü', 2], ǚ: ['ü', 3], ǜ: ['ü', 4],
};

function toNumericPinyin(marked) {
  for (const [markedChar, [plain, tone]] of Object.entries(TONE_REVERSE)) {
    if (marked.includes(markedChar)) {
      return { numeric: `${marked.replace(markedChar, plain)}${tone}`, tone };
    }
  }
  return { numeric: `${marked}5`, tone: 5 }; // no mark found -> neutral tone
}

const items = RADICALS.map(([kangxiNumber, formsStr, pinyin, meaning, strokeCount]) => {
  const forms = formsStr.split('/');
  const primary = forms[0];
  const { numeric, tone } = toNumericPinyin(pinyin);
  const notes = forms.length > 1 ? `Also written ${forms.slice(1).join(', ')} depending on position in a character.` : undefined;

  return {
    id: `radical-${String(kangxiNumber).padStart(3, '0')}`,
    kind: 'radical',
    kangxiNumber,
    simplified: primary,
    traditional: primary,
    pinyin,
    pinyinNumeric: numeric,
    toneNumber: tone,
    definitions: [meaning],
    strokeCount,
    ...(notes ? { notes } : {}),
    tags: ['kangxi-100'],
  };
});

mkdirSync(DATA_DIR, { recursive: true });
writeFileSync(path.join(DATA_DIR, 'radicals.json'), JSON.stringify(items, null, 2) + '\n');

console.log(`Wrote ${items.length} radicals.`);
