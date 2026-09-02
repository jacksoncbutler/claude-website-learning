#!/usr/bin/env node
/**
 * Generates src/data/hsk1/hsk1.json from the classic HSK (Level 1) 150-word
 * vocabulary list — the standard, widely-used word list (predating the 2021
 * HSK 3.0 restructuring, which uses much larger per-level counts). This
 * matches what src/lib/content/modules.ts already promises for this module
 * ("First 150 words and characters").
 *
 * Audio: a word's pronunciation is only wired up when it's a single
 * syllable that matches an existing pinyin recording (reusing the same
 * audio-assets.json entries the pinyin/radicals modules use — see
 * scripts/generate-radicals-data.mjs for why). Our audio source only has
 * isolated single-syllable recordings, not compound-word pronunciations,
 * so multi-character words correctly have no audioId and show a disabled
 * play button — same graceful-degradation pattern as everywhere else.
 *
 * To extend later (HSK2's list is the next 150), add rows below (or a new
 * script following this shape) and re-run:
 *   node scripts/generate-hsk1-data.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'src', 'data', 'hsk1');

// [simplified, pinyin (space-separated per syllable, toned), meaning(s), part of speech]
const HSK1_WORDS = [
  ['爱', 'ài', 'to love', 'verb'],
  ['八', 'bā', 'eight', 'number'],
  ['爸爸', 'bà ba', 'father, dad', 'noun'],
  ['杯子', 'bēi zi', 'cup, glass', 'noun'],
  ['北京', 'Běi jīng', 'Beijing', 'proper noun'],
  ['本', 'běn', '(measure word for books)', 'measure word'],
  ['不客气', 'bú kè qi', "you're welcome", 'phrase'],
  ['不', 'bù', 'not, no', 'adverb'],
  ['菜', 'cài', 'dish, vegetable', 'noun'],
  ['茶', 'chá', 'tea', 'noun'],
  ['吃', 'chī', 'to eat', 'verb'],
  ['出租车', 'chū zū chē', 'taxi', 'noun'],
  ['打电话', 'dǎ diàn huà', 'to make a phone call', 'phrase'],
  ['大', 'dà', 'big, large', 'adjective'],
  ['的', 'de', "(possessive/modifying particle)", 'particle'],
  ['点', 'diǎn', "o'clock; a little", 'noun'],
  ['电脑', 'diàn nǎo', 'computer', 'noun'],
  ['电视', 'diàn shì', 'television', 'noun'],
  ['电影', 'diàn yǐng', 'movie', 'noun'],
  ['东西', 'dōng xi', 'thing, object', 'noun'],
  ['都', 'dōu', 'all, both', 'adverb'],
  ['读', 'dú', 'to read', 'verb'],
  ['对不起', 'duì bu qǐ', 'sorry', 'phrase'],
  ['多', 'duō', 'many, much', 'adjective'],
  ['多少', 'duō shao', 'how many, how much', 'pronoun'],
  ['儿子', 'ér zi', 'son', 'noun'],
  ['二', 'èr', 'two', 'number'],
  ['饭店', 'fàn diàn', 'restaurant, hotel', 'noun'],
  ['飞机', 'fēi jī', 'airplane', 'noun'],
  ['分钟', 'fēn zhōng', 'minute', 'noun'],
  ['高兴', 'gāo xìng', 'happy, glad', 'adjective'],
  ['个', 'gè', '(general measure word)', 'measure word'],
  ['工作', 'gōng zuò', 'to work; job', 'verb'],
  ['狗', 'gǒu', 'dog', 'noun'],
  ['汉语', 'Hàn yǔ', 'Chinese (language)', 'proper noun'],
  ['好', 'hǎo', 'good, well', 'adjective'],
  ['号', 'hào', 'number; day of the month', 'noun'],
  ['喝', 'hē', 'to drink', 'verb'],
  ['和', 'hé', 'and, with', 'conjunction'],
  ['很', 'hěn', 'very', 'adverb'],
  ['后面', 'hòu mian', 'behind, in the back', 'noun'],
  ['回', 'huí', 'to return', 'verb'],
  ['会', 'huì', 'can, to know how to', 'verb'],
  ['几', 'jǐ', 'how many; several', 'pronoun'],
  ['家', 'jiā', 'home, family', 'noun'],
  ['叫', 'jiào', 'to be called, to call', 'verb'],
  ['今天', 'jīn tiān', 'today', 'noun'],
  ['九', 'jiǔ', 'nine', 'number'],
  ['开', 'kāi', 'to open; to drive', 'verb'],
  ['看', 'kàn', 'to look, to watch, to read', 'verb'],
  ['看见', 'kàn jiàn', 'to see', 'verb'],
  ['块', 'kuài', '(measure word for money, "yuan")', 'measure word'],
  ['来', 'lái', 'to come', 'verb'],
  ['老师', 'lǎo shī', 'teacher', 'noun'],
  ['了', 'le', '(completed-action/change-of-state particle)', 'particle'],
  ['冷', 'lěng', 'cold', 'adjective'],
  ['里', 'lǐ', 'inside, in', 'noun'],
  ['六', 'liù', 'six', 'number'],
  ['妈妈', 'mā ma', 'mother, mom', 'noun'],
  ['吗', 'ma', '(yes/no question particle)', 'particle'],
  ['买', 'mǎi', 'to buy', 'verb'],
  ['猫', 'māo', 'cat', 'noun'],
  ['没关系', 'méi guān xi', "it doesn't matter, never mind", 'phrase'],
  ['没有', 'méi yǒu', 'to not have; there is not', 'verb'],
  ['米饭', 'mǐ fàn', 'cooked rice', 'noun'],
  ['明天', 'míng tiān', 'tomorrow', 'noun'],
  ['名字', 'míng zi', 'name', 'noun'],
  ['哪', 'nǎ', 'which', 'pronoun'],
  ['哪儿', 'nǎr', 'where', 'pronoun'],
  ['那', 'nà', 'that', 'pronoun'],
  ['呢', 'ne', '(question particle)', 'particle'],
  ['能', 'néng', 'can, to be able to', 'verb'],
  ['你', 'nǐ', 'you', 'pronoun'],
  ['年', 'nián', 'year', 'noun'],
  ['女儿', 'nǚ ér', 'daughter', 'noun'],
  ['朋友', 'péng you', 'friend', 'noun'],
  ['漂亮', 'piào liang', 'pretty, beautiful', 'adjective'],
  ['苹果', 'píng guǒ', 'apple', 'noun'],
  ['七', 'qī', 'seven', 'number'],
  ['前面', 'qián mian', 'front, in front', 'noun'],
  ['钱', 'qián', 'money', 'noun'],
  ['请', 'qǐng', 'please; to invite', 'verb'],
  ['去', 'qù', 'to go', 'verb'],
  ['热', 'rè', 'hot', 'adjective'],
  ['人', 'rén', 'person, people', 'noun'],
  ['认识', 'rèn shi', 'to know, to recognize', 'verb'],
  ['三', 'sān', 'three', 'number'],
  ['商店', 'shāng diàn', 'shop, store', 'noun'],
  ['上', 'shàng', 'on, above; to go to', 'noun'],
  ['上午', 'shàng wǔ', 'morning', 'noun'],
  ['少', 'shǎo', 'few, little', 'adjective'],
  ['谁', 'shéi', 'who', 'pronoun'],
  ['什么', 'shén me', 'what', 'pronoun'],
  ['十', 'shí', 'ten', 'number'],
  ['时候', 'shí hou', 'time, moment', 'noun'],
  ['是', 'shì', 'to be', 'verb'],
  ['书', 'shū', 'book', 'noun'],
  ['水', 'shuǐ', 'water', 'noun'],
  ['水果', 'shuǐ guǒ', 'fruit', 'noun'],
  ['睡觉', 'shuì jiào', 'to sleep', 'verb'],
  ['说话', 'shuō huà', 'to speak, to talk', 'verb'],
  ['四', 'sì', 'four', 'number'],
  ['岁', 'suì', 'year (of age)', 'noun'],
  ['他', 'tā', 'he, him', 'pronoun'],
  ['她', 'tā', 'she, her', 'pronoun'],
  ['太', 'tài', 'too, extremely', 'adverb'],
  ['天气', 'tiān qì', 'weather', 'noun'],
  ['听', 'tīng', 'to listen', 'verb'],
  ['同学', 'tóng xué', 'classmate', 'noun'],
  ['喂', 'wèi', 'hello (on the phone); hey', 'interjection'],
  ['我', 'wǒ', 'I, me', 'pronoun'],
  ['我们', 'wǒ men', 'we, us', 'pronoun'],
  ['五', 'wǔ', 'five', 'number'],
  ['喜欢', 'xǐ huan', 'to like', 'verb'],
  ['下', 'xià', 'down, below; next', 'noun'],
  ['下午', 'xià wǔ', 'afternoon', 'noun'],
  ['下雨', 'xià yǔ', 'to rain', 'verb'],
  ['先生', 'xiān sheng', 'Mr., sir', 'noun'],
  ['现在', 'xiàn zài', 'now', 'noun'],
  ['想', 'xiǎng', 'to want to; to think', 'verb'],
  ['小', 'xiǎo', 'small, little', 'adjective'],
  ['小姐', 'xiǎo jiě', 'Miss, young lady', 'noun'],
  ['些', 'xiē', 'some, a few', 'measure word'],
  ['谢谢', 'xiè xie', 'thank you', 'phrase'],
  ['星期', 'xīng qī', 'week', 'noun'],
  ['学生', 'xué sheng', 'student', 'noun'],
  ['学习', 'xué xí', 'to study, to learn', 'verb'],
  ['学校', 'xué xiào', 'school', 'noun'],
  ['一', 'yī', 'one', 'number'],
  ['一点儿', 'yì diǎnr', 'a little, a bit', 'phrase'],
  ['衣服', 'yī fu', 'clothes', 'noun'],
  ['医生', 'yī shēng', 'doctor', 'noun'],
  ['医院', 'yī yuàn', 'hospital', 'noun'],
  ['椅子', 'yǐ zi', 'chair', 'noun'],
  ['有', 'yǒu', 'to have; there is', 'verb'],
  ['月', 'yuè', 'month; moon', 'noun'],
  ['再见', 'zài jiàn', 'goodbye', 'phrase'],
  ['在', 'zài', 'at, in; to be located at', 'preposition'],
  ['怎么', 'zěn me', 'how, why', 'pronoun'],
  ['怎么样', 'zěn me yàng', 'how is it, how about', 'pronoun'],
  ['这', 'zhè', 'this', 'pronoun'],
  ['中国', 'Zhōng guó', 'China', 'proper noun'],
  ['中午', 'zhōng wǔ', 'noon', 'noun'],
  ['住', 'zhù', 'to live, to reside', 'verb'],
  ['桌子', 'zhuō zi', 'table, desk', 'noun'],
  ['字', 'zì', 'character, word', 'noun'],
  ['昨天', 'zuó tiān', 'yesterday', 'noun'],
  ['做', 'zuò', 'to do, to make', 'verb'],
  ['坐', 'zuò', 'to sit; to travel by (vehicle)', 'verb'],
  ['零', 'líng', 'zero', 'number'],
];

// Same reverse-lookup as scripts/generate-radicals-data.mjs — 'v' is the
// ASCII stand-in for ü, matching the pinyin module's convention.
const TONE_REVERSE = {
  ā: ['a', 1], á: ['a', 2], ǎ: ['a', 3], à: ['a', 4],
  ē: ['e', 1], é: ['e', 2], ě: ['e', 3], è: ['e', 4],
  ī: ['i', 1], í: ['i', 2], ǐ: ['i', 3], ì: ['i', 4],
  ō: ['o', 1], ó: ['o', 2], ǒ: ['o', 3], ò: ['o', 4],
  ū: ['u', 1], ú: ['u', 2], ǔ: ['u', 3], ù: ['u', 4],
  ǖ: ['v', 1], ǘ: ['v', 2], ǚ: ['v', 3], ǜ: ['v', 4],
};

function syllableToNumeric(syllable) {
  const bare = syllable.toLowerCase().replace(/[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, '');
  for (const [markedChar, [plain, tone]] of Object.entries(TONE_REVERSE)) {
    if (bare.includes(markedChar)) {
      return `${bare.replace(markedChar, plain)}${tone}`;
    }
  }
  return `${bare}5`; // no mark found -> neutral tone
}

const items = HSK1_WORDS.map(([simplified, pinyin, meaning, partOfSpeech], index) => {
  const syllables = pinyin.split(' ');
  const pinyinNumeric = syllables.map(syllableToNumeric).join(' ');
  // Audio only exists for isolated single syllables in our source (see
  // header comment) — a multi-syllable word has no matching recording.
  const audioId = syllables.length === 1 ? `audio-${pinyinNumeric}` : undefined;

  return {
    id: `hsk1-${String(index + 1).padStart(3, '0')}`,
    kind: 'word',
    hskLevel: 1,
    simplified,
    traditional: simplified,
    pinyin,
    pinyinNumeric,
    definitions: [meaning],
    partOfSpeech: [partOfSpeech],
    ...(audioId ? { audioId } : {}),
  };
});

mkdirSync(DATA_DIR, { recursive: true });
writeFileSync(path.join(DATA_DIR, 'hsk1.json'), JSON.stringify(items, null, 2) + '\n');

const withAudio = items.filter((i) => i.audioId).length;
console.log(`Wrote ${items.length} HSK1 words (${withAudio} single-syllable words have an audioId).`);
