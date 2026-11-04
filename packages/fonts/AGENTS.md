# @moscowcss/fonts — agent guide

`CLAUDE.md` and `AGENTS.md` in this folder are **identical**, kept in sync so any
agent (Claude, Cursor, …) reads either and gets the same rules — **edit both
together.** Repo-wide rules live in the **root `CLAUDE.md`**, which wins on
conflict. Below is only what's specific to this package.

## What this is

Font **loading** — `@font-face` declarations in `index.css` plus the `woff2`
files (in `inter/`, `montserrat/`, `jetbrains/`, `jost/`, `golos/`). No build step, no lint script.
Montserrat Regular/SemiBold/Bold are also stored as **TTF** and exported from
`package.json` for `@moscowcss/og`.

## Rules

- **Loading only — NOT tokens.** The font *tokens* (families, weights,
  shorthands) live in `@moscowcss/design-system` (`fonts.ts` / `typography.ts`).
  The `font-family` names declared here **must match** the ones there.
- **Import once at an app root:** `import '@moscowcss/fonts'` (the website page,
  Storybook `preview.ts`). It is a side-effect CSS import.
- **No italics** — only upright faces. Each `@font-face` uses a **`local()`-first**
  `src` (`local(...), url("./…woff2") format("woff2")`) with `font-display: swap`.
- When adding a weight, add the `woff2` to the right subfolder and a matching
  `@font-face` with the correct numeric `font-weight`.
- **TTF are for OG cards only.** satori cannot read WOFF2, so `@moscowcss/og` reads
  `montserrat/Montserrat-{Regular,SemiBold,Bold}.ttf` through the exports
  (`./montserrat-regular.ttf` …). The browser never loads them (no `@font-face`).
  Source and licence: `README.md`. Do not copy them into `og` and do not download
  fonts at build time.

## Validate

```bash
pnpm build            # the referenced woff2 must appear in apps/website/dist
pnpm build:storybook  # …and in storybook-static
```
