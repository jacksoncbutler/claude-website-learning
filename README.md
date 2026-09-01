# Mandarin Learning Companion

A personal Mandarin-learning website that grows over time: one consistent
content model, reused across whatever views/interactions get added next
(tables, flashcards, and beyond).

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`.

## How it's organized

- `src/lib/content/types.ts` — the shared `LearningItem` shape used by every
  content module (pinyin, and later radicals/hanzi/vocab). New modules add a
  new `kind` and use whichever optional fields apply — existing data never
  needs to change.
- `src/lib/content/schema.ts` — Zod validation for every data file, so a
  malformed entry fails loudly at load time instead of breaking a page.
- `src/lib/content/loaders.ts` — the only place that reads the JSON data
  files. UI code always goes through here, which is what would make a future
  move to a real database low-risk.
- `src/data/` — the actual content, as JSON. Safe to hand-edit or extend.
- `src/components/views/` — generic `TableView` and `FlashcardView`
  components that any content module can reuse just by passing new data and
  render functions.
- `src/components/audio/AudioButton.tsx` — plays a pronunciation clip, and
  degrades to a disabled button whenever the audio isn't available yet.
- `src/lib/content/modules.ts` — the module registry that drives the
  dashboard's "learning path" grid. Flipping a module from `coming-soon` to
  `available` is the whole integration step once its route + data exist.

## Learning path

Pinyin → Radicals → HSK1 → HSK2 → … following the self-study method at
https://teachyourselfmandarin.wordpress.com/. Only Pinyin is built out so
far; the rest are placeholders on the dashboard.

## Adding audio

Drop audio files under `public/audio/<module>/...` and register them in
`src/data/audio/audio-assets.json`:

```json
{ "id": "audio-ma1", "file": "pinyin/ma1.mp3" }
```

Then set `"audioId": "audio-ma1"` on the matching entry in the module's data
file. No file yet? Leave `audioId` unset — the play button just shows as
disabled until it's added.

### Pinyin audio is already wired up

`public/audio/pinyin/` and `src/data/audio/audio-assets.json` are populated
from [davinfifield/mp3-chinese-pinyin-sound](https://github.com/davinfifield/mp3-chinese-pinyin-sound)
(public domain, Unlicense) — its filenames already match our `pinyinNumeric`
convention (`{syllable}{tone}.mp3`), and `generate-pinyin-data.mjs` assigns
every syllable an `audioId` on that same convention automatically. 210 of
our 221 current syllables have a recording; the rest (a handful of rare
syllables like lüe/nüe) just show a disabled play button.

To (re)fetch audio for whatever's currently in `syllables.json`:

```bash
node scripts/fetch-pinyin-audio.mjs
```

Safe to re-run after extending coverage (see below) — it only downloads what
that source actually has and rewrites `audio-assets.json` to match.

## Extending the pinyin chart

`scripts/generate-pinyin-data.mjs` generates
`src/data/pinyin/{initials,finals,valid-syllables,syllables}.json` from a
small table of initials/finals and a handful of fully-authored tone
families. To add more coverage (e.g. the j/q/x or zh/ch/sh/r rows), edit that
table and re-run:

```bash
node scripts/generate-pinyin-data.mjs
node scripts/fetch-pinyin-audio.mjs
```

## Other data sources worth knowing about

Found while looking for audio, kept here for when they become relevant:

- [xiaohk/pinyin_data](https://github.com/xiaohk/pinyin_data) — hanzi → pinyin
  readings for ~41,000 characters (Unicode Unihan data), including multiple
  readings ranked by frequency and some polyphone/context data. No audio.
  Good candidate source when building out the Hanzi/HSK modules.
- [digglesby/plain-pinyin](https://github.com/digglesby/plain-pinyin) — a
  similar interactive-pinyin-chart-plus-quizzes project (also Next.js); it's
  where the davinfifield audio credit above was traced from. Useful as prior
  art, not a data source we depend on.
