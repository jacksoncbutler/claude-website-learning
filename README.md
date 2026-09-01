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
every syllable an `audioId` on that same convention automatically. 1,575 of
our 1,621 current syllable+tone combinations have a recording; the rest (a
handful of rare syllables/combinations not in that recording set) just show
a disabled play button.

To (re)fetch audio for whatever's currently in `syllables.json`:

```bash
node scripts/fetch-pinyin-audio.mjs
```

Safe to re-run after extending coverage (see below) — it only downloads what
that source actually has and rewrites `audio-assets.json` to match.

## The pinyin chart

`scripts/generate-pinyin-data.mjs` generates
`src/data/pinyin/{initials,finals,valid-syllables,syllables}.json` from a
table of initials/finals and a handful of fully-authored tone families. It
covers the full standard inventory: all 21 consonant initials (b p m f d t n
l g k h j q x zh ch sh r z c s) plus the zero-initial row (a, wu, yi, yu, ...),
with all four tones generated for every valid syllable (tone 5 / neutral is
the exception — kept only where a real neutral-tone word is known, via the
hand-curated families, since unlike 1-4 it isn't a given for every syllable)
— 1,621 syllable+tone entries in total. To fix or extend anything (wrong
final, a rare syllable missing, a new tone family), edit that table and
re-run:

```bash
node scripts/generate-pinyin-data.mjs
node scripts/fetch-pinyin-audio.mjs
```

The comment at the top of `generate-pinyin-data.mjs` explains the trickier
parts of the data model — in particular why `final` is sometimes a
phonological id (`v`/`ve`/`van`/`vn` for ü/üe/üan/ün) rather than the literal
spelling, since the same final is spelled differently depending on the
initial (nü, ju, yu are all "ü" phonologically).

## Deploying to GitHub Pages

Every push to `main` builds and deploys automatically via
`.github/workflows/deploy-pages.yml` — no local build needed. One-time setup
in the GitHub repo itself: **Settings → Pages → Build and deployment →
Source: "GitHub Actions"**.

The app is a static export (`output: 'export'` in `next.config.mjs`), since
GitHub Pages only serves static files. Two things that follow from that:

- **Base path**: a project repo like this one is served at
  `https://<user>.github.io/<repo>/`, not the domain root. `next.config.mjs`
  derives the base path from `GITHUB_REPOSITORY` automatically (no
  hardcoded repo name) and exposes it via `src/lib/basePath.ts` for the one
  place that needs it by hand — raw audio URLs (`next/link` already prefixes
  itself). Empty locally, so `npm run dev`/`npm run build` outside CI are
  unaffected.
- **Daily proverb**: computed client-side (`DailyProverbClient.tsx`) rather
  than at render time on the server, since a static export's HTML is only as
  fresh as the last deploy — computing "today" in the browser means it's
  always correct for the viewer, with no rebuild required.

To build the static export locally for inspection (rarely needed day-to-day):

```bash
npm run build   # outputs to ./out
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
