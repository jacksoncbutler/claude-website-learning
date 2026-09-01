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

## Extending the pinyin chart

`scripts/generate-pinyin-data.mjs` generates
`src/data/pinyin/{initials,finals,valid-syllables,syllables}.json` from a
small table of initials/finals and a handful of fully-authored tone
families. To add more coverage (e.g. the j/q/x or zh/ch/sh/r rows), edit that
table and re-run:

```bash
node scripts/generate-pinyin-data.mjs
```
