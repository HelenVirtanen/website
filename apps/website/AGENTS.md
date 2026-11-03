# website — agent guide

`CLAUDE.md` and `AGENTS.md` in this folder are **identical**, kept in sync so any
agent (Claude, Cursor, …) reads either and gets the same rules — **edit both
together.** Repo-wide rules live in the **root `CLAUDE.md`**, which wins on
conflict. Below is only what's specific to this app.

## What this is

The Astro **community site**, static output, two languages (`ru` at `/`, `en`
under `/en/`). Consumes `@moscowcss/content`, `@moscowcss/og`, `@moscowcss/ui`,
`@moscowcss/icons`, `@moscowcss/fonts` and `@moscowcss/design-system`.
Decisions: `specs/001-blog-like-architecture.md`, `adr/001-*.md`, `adr/002-*.md`.

```
src/
├── i18n/       # config.ts (locales), ui.ts (UI dictionary, ru is the source), URL helpers
├── content/    # catalog.ts (relations + validation), format.ts, markdown-safety.ts
├── seo/        # pages.ts (public pages), og.ts (card input), jsonld.ts (schema.org), sitemap.ts (sitemap + robots)
├── layouts/    # BaseLayout: canonical, hreflang, og/twitter tags
├── pages/      # [...locale]/ (home, events, talks, speakers, search), og/ and avatars/ (images),
│               # 404.astro (one bilingual page for GitHub Pages), sitemap.xml.ts, robots.txt.ts
├── sections/   # homepage sections
├── components/ # page-level pieces that are not reusable UI
├── search/     # Pagefind client
└── test/       # fixtures for tests
scripts/        # check-seo, seo-checks (SEO gate over dist), new-entry (new:* generator)
```

## Rules

- **No raw design values in pages.** Compose from `@moscowcss/ui` components;
  when you must write CSS, go **strictly** through `@moscowcss/design-system`
  tokens (`vars` / `media`) — never raw hex, `px`, or literal breakpoints.
- **No user-facing text literals in `.astro` files.** Strings come from the
  dictionary `src/i18n/ui.ts` or from content. A new key goes into `ru` first;
  every other locale must cover all keys (`ui.test.ts` checks it). The locale
  list lives in `src/i18n/config.ts` **and** `astro.config.mjs` — keep them in
  sync.
- **Sizes in `rem` through tokens**, no `px` in `.css.ts`, no literal sizes
  inside `@media` (structure only). Constant inner padding is `vars.padding`;
  `vars.layout.*` only where the value grows with width.
- **Import `@moscowcss/fonts` once** at the page/layout root (side-effect CSS).
- `astro.config.mjs` registers the **vanilla-extract Vite plugin** and the
  `markdownSafety` integration — keep both. The plugin
  (`src/content/markdown-safety.ts`) fails the build on raw HTML in content and on
  any `href`/`src` that is not `https:`/`mailto:` after URL resolution. Check
  stays on the parsed tree (hast), never regexes over the source.
  The plugin also opens external links in a new tab (`target="_blank"`,
  `rel="noopener noreferrer"`). Rendered content is cached in
  `.astro/data-store.json` and `node_modules/.astro/`: after changing a Markdown
  plugin, delete those files, or unchanged content keeps the old HTML locally
  (CI starts clean).
- `site` is `https://css.moscow`, `trailingSlash: 'always'`: canonical, hreflang
  and internal links are absolute/with a trailing slash.
- **Content entries** are created with `pnpm new:event | new:talk | new:speaker |
  new:partner | new:faq` (drafts, `ru` + `en`, never overwrite); hand-made
  entries are fine if they pass the schema. Content lives in `@moscowcss/content`; the page code only
  reads it through `src/content/catalog.ts`.
- **Meetup date** is `date` (a day) + `time` (Moscow time). "Nearest meetup" is
  computed at build time; a meetup stays "upcoming" for 4 hours after its start.
  `BUILD_NOW=<ISO date>` pins "now" for **visual snapshots only**; it is in
  `turbo.json` `build.env` and must never be set for a real build.
- **The build is not cached** (`turbo.json` here: `build.cache=false`) because it
  depends on the current date.
- Every indexable page needs the full SEO set; `pnpm check:seo` verifies the
  built `dist` and CI runs it.
- Headings go in order (`h1` → `h2` → `h3`, no skipped level): section titles
  are `h2` (`BlockTitle`), cards inside them are `h3`. Agents and screen readers
  read a skipped level as a missing section.
- Structured data is built in `src/seo/jsonld.ts` from the same catalog as the
  page: `Organization` + `WebSite` on home, `Event` on a meetup, `Person` on a
  speaker. Event times are written in Moscow time with `+03:00`.
- Tests are vitest (`vitest.config.ts` uses `getViteConfig`, so they see the same
  plugins as the build); `astro:content` is mocked with `vi.mock`.
- Theme is **colour-only** and driven by `data-theme` (`<html data-theme="…">`) /
  OS preference — see `@moscowcss/design-system`.

## Validate

```bash
pnpm dev                          # local dev server (no search index in dev)
pnpm test                         # from repo root: vitest
pnpm build                        # astro build + Pagefind index (must pass)
pnpm --filter website check:seo   # SEO gate over dist, after the build
```
