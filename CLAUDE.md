# CLAUDE.md — Expedition Oz Website

## Project Overview

Luxury sailing charter website for **Expedition Oz**, Ningaloo, Western Australia.
Two 75ft black steel sailboats (Sylfia, Millennium) running 3–10 day trips.
Non-technical crew manage content via Sanity Studio at `/studio`.
SEO is a commercial priority. FareHarbor/Rezdy handles booking embeds.

**Stack:** Astro 6 · Sanity v3 (Phase 1+) · GSAP 3 · Tailwind v4 · Netlify

---

## Critical URLs

| | URL |
|---|---|
| Production | `https://expedition-oz.netlify.app` (update when custom domain added) |
| Sanity Studio (local) | `http://localhost:4321/studio` (Phase 1+) |
| Sanity project ID | _fill in after Phase 1_ |
| Sanity dataset | `production` |
| Netlify site name | _fill in after deploy_ |
| FareHarbor shortname | _fill in when client provides_ |

---

## Phase Status

- [x] **Phase 0** — Foundation: Astro scaffold, Tailwind v4, design system, BaseLayout, Nav, Footer, Netlify config
- [ ] **Phase 1** — Sanity CMS: all schemas, embedded Studio at `/studio`, content collections, seed data
- [ ] **Phase 2** — Core pages: Home (full), Our Story, Fleet, Expeditions, Contact — all wired to CMS
- [ ] **Phase 3** — Journal + Gallery: paginated blog, PortableText renderer, masonry gallery + lightbox
- [ ] **Phase 4** — Ningaloo page: marine calendar, species profiles, SEO content
- [ ] **Phase 5** — Animations: GSAP scroll reveals, hero entrance, marine life horizontal pin, parallax
- [ ] **Phase 6** — SEO + performance: Lighthouse audit, JSON-LD, sitemap submission, image optimization
- [ ] **Phase 7** — FareHarbor: booking embed per expedition, requires client's FareHarbor account

---

## Design Token Reference

All tokens live in `src/styles/global.css` inside the `@theme {}` block.

### Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-abyss` | `#0A0F1E` | Hero/CTA backgrounds, deepest dark |
| `--color-deep` | `#0D1B2A` | Section backgrounds (dark) |
| `--color-ocean` | `#1A3A5C` | Secondary backgrounds, borders |
| `--color-current` | `#1E5B8A` | Primary interactive elements |
| `--color-horizon` | `#2E86B5` | Hover states, text links |
| `--color-surface` | `#5BA3C9` | Subtle accents |
| `--color-foam` | `#D4EAF5` | Text on dark backgrounds (headings) |
| `--color-gold` | `#C9923A` | CTAs, highlights, warm accent |
| `--color-sand` | `#E8D5B0` | Body text on dark backgrounds |
| `--color-ivory` | `#F5F0E8` | Light section backgrounds |
| `--color-slate` | `#8AA3B8` | Subtext, captions, muted labels |
| `--color-ink` | `#1C1C24` | Text on light backgrounds |

**Rule:** Never use pure `#000` or `#fff` — the ocean has neither.

In Tailwind: `bg-abyss`, `text-gold`, `border-ocean`, etc.

### Typography

| Token | Value | Usage |
|---|---|---|
| `--font-display` | Cormorant Garamond, Georgia, serif | Headings, hero, pull quotes |
| `--font-body` | DM Sans, system-ui, sans-serif | Body copy, UI, labels, nav |
| `--text-hero` | `clamp(3.5rem, 8vw, 7rem)` | Hero `<h1>` |
| `--text-display` | `clamp(2.5rem, 5vw, 4.5rem)` | Section `<h2>` |
| `--text-title` | `clamp(1.75rem, 3vw, 2.5rem)` | Card/sub headings `<h3>` |
| `--text-body-lg` | `1.125rem` | Body copy |
| `--text-label` | `0.8125rem` | Labels, nav, buttons (uppercase + tracked) |

**Font weights used:**
- Cormorant Garamond: 300 (Light), 300 Italic, 400, 400 Italic, 600 SemiBold
- DM Sans: 300, 400, 500

Fonts are loaded from `@fontsource` npm packages in `BaseLayout.astro`.

### Spacing

`--spacing-section: clamp(5rem, 10vw, 9rem)` — applied via `.section-py` utility class.

---

## Component Conventions

- All `.astro` components define a typed `Props` interface in the frontmatter
- Once Sanity is set up, Sanity-sourced types import from `src/sanity/types.ts` (auto-generated via `npx sanity typegen generate`)
- **Client islands:** `client:load` for interactive UI; `client:only="astro"` for FareHarbor embed (DOM-manipulating)
- **Images:** once Sanity is live, always use `SanityImage.astro` wrapper, never raw `<img>` for CMS images. Always specify `width`, `height`, `sizes`.
- Never hardcode color hex values in components — always use CSS custom properties (`var(--color-gold)`) or Tailwind tokens (`bg-gold`)
- Utility classes `.section-py`, `.container-site`, `.font-display`, `.font-body` are defined in `global.css`

---

## Directory Structure

```
src/
  styles/global.css          ← @theme block — ENTIRE design token system
  components/
    layout/
      BaseLayout.astro       ← HTML shell, font imports, meta, Nav, Footer
      Nav.astro              ← Fixed nav with scroll opacity + mobile toggle
      Footer.astro           ← Footer with wave divider, nav, social links
    ui/
      SectionDivider.astro   ← SVG wave between sections (fromColor, toColor, flip)
      Button.astro           ← (Phase 2+)
      SanityImage.astro      ← (Phase 1+)
      ScrollReveal.astro     ← (Phase 5)
    home/                    ← (Phase 2) Home-specific components
    expeditions/             ← (Phase 2) ExpeditionCard, BookingEmbed, etc.
    journal/                 ← (Phase 3) PostCard, PostBody
    gallery/                 ← (Phase 3) GalleryGrid, Lightbox
    seo/
      SEOHead.astro          ← (Phase 3) Full structured data JSON-LD
  pages/
    index.astro
    our-story.astro          ← (Phase 2)
    fleet/index.astro        ← (Phase 2)
    fleet/sylfia.astro       ← (Phase 2)
    fleet/millennium.astro   ← (Phase 2)
    expeditions/index.astro  ← (Phase 2)
    expeditions/[slug].astro ← (Phase 2)
    ningaloo.astro           ← (Phase 4)
    gallery.astro            ← (Phase 3)
    journal/index.astro      ← (Phase 3)
    journal/[slug].astro     ← (Phase 3)
    contact.astro            ← (Phase 2)
    studio/[...all].astro    ← (Phase 1) Embedded Sanity Studio
    404.astro
    sitemap.xml.ts           ← (Phase 6) Programmatic sitemap
  sanity/                    ← (Phase 1+)
    schemas/                 ← boat.ts, expedition.ts, journalPost.ts, gallery.ts, testimonial.ts, marineLife.ts, siteSettings.ts
    lib/client.ts
    lib/queries.ts
    lib/portableText.ts
  content/config.ts          ← (Phase 1) Astro content collections with Sanity loader
  utils/
    formatDate.ts            ← (Phase 3)
    seo.ts                   ← (Phase 6) JSON-LD generators
```

---

## Sanity Schema Summary (Phase 1+)

| Type | Purpose | Key Fields |
|---|---|---|
| `boat` | Vessel profiles | name, slug, length, maxPassengers, tripDurationRange, description (PT), specs[], heroImage, galleryImages[] |
| `expedition` | Trip products | title, slug, boat (ref), duration, priceFrom, season, heroImage, description (PT), itinerary[], inclusions[], exclusions[], marineHighlights[] (ref), **fareharborItemId**, faqs[], seo |
| `journalPost` | Blog posts | title, slug, publishedAt, author, coverImage, excerpt, body (PT), tags[], relatedBoat (ref), marineSpeciesMentioned[] (ref), seo |
| `gallery` | Photo/video assets | image, caption, credit, tags[], relatedBoat (ref), relatedExpedition (ref), mediaType, vimeoId |
| `testimonial` | Guest quotes | quote, authorName, authorLocation, relatedBoat (ref), rating, featured |
| `marineLife` | Species profiles | name, slug, scientificName, description (PT), photo, seasonality, bestMonth |
| `siteSettings` | **SINGLETON** | siteName, contactEmail, socialLinks, defaultSeo, **fareharborCompanyShortname**, announcementBanner |

---

## GSAP Setup (Phase 5+)

- Import GSAP only in components using `client:load` or `client:only`
- Never reference `window` or `document` in server-side (non-island) Astro frontmatter
- Always check `window.matchMedia("(prefers-reduced-motion: reduce)").matches` before registering animations
- After Astro View Transitions navigation, call `ScrollTrigger.refresh()` via the `astro:after-swap` event
- FareHarbor `BookingEmbed.astro` uses `client:only` — it DOM-manipulates and must skip SSR entirely

---

## CMS Workflow for Crew (Phase 1+)

1. Go to `https://expedition-oz.netlify.app/studio`, log in with Sanity account
2. Write or edit content (trips, journal posts, photos, testimonials)
3. Click **Publish**
4. Netlify rebuild triggers automatically via webhook (~90 seconds)
5. Changes are live at the production URL

---

## Dev Commands

```bash
npm run dev       # Dev server at http://localhost:4321
npm run build     # Build static site to dist/
npm run preview   # Preview built site
```

After Phase 1, also:
```bash
npx sanity typegen generate   # Regenerate TypeScript types from schemas (run after schema changes)
```

---

## Environment Variables (Phase 1+)

Set in Netlify dashboard, not committed to git.

```
SANITY_PROJECT_ID=
SANITY_DATASET=production
SANITY_API_TOKEN=           # Read-only, for build-time queries
PUBLIC_SANITY_PROJECT_ID=   # Same value — safe to expose (used by Studio embed)
```

---

## Deployment

- Commits to `main` trigger Netlify auto-deploy
- Sanity publish webhook also triggers a Netlify rebuild (set up in Phase 1)
- Never commit `.env` — use Netlify env panel

---

## Known Decisions & Tradeoffs

| Decision | Rationale |
|---|---|
| Static output (not SSR) | Max Lighthouse scores, CDN caching, no cold starts. Publish-to-live takes ~90s — acceptable tradeoff |
| Sylfia + Millennium as static pages | Only 2 boats, structurally different. Convert to `[slug].astro` if a 3rd joins |
| `@fontsource` npm packages | Self-hosted fonts, no Google Fonts DNS lookup, no GDPR concerns |
| FareHarbor as `client:only` island | It DOM-manipulates; must skip SSR. Booking widget loads slightly delayed (below fold) |
| No React/Vue | Pure Astro components. Alpine.js is the lowest-weight addition if more interactivity needed |
| Tailwind v4 `@theme` block | All design tokens in one CSS file — readable and maintainable across sessions |
| CSS Grid masonry gallery | No Masonry.js. Small JS fallback for browsers without native `masonry` support |
