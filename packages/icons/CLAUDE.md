# @moscowcss/icons — agent guide

`CLAUDE.md` and `AGENTS.md` in this folder are **identical**, kept in sync so any
agent (Claude, Cursor, …) reads either and gets the same rules — **edit both
together.** Repo-wide rules live in the **root `CLAUDE.md`**, which wins on
conflict. Below is only what's specific to this package.

## What this is

The "SVGR for Astro": raw SVGs are cleaned with **SVGO** and compiled into ready
`.astro` icon components. **Has a build step** (`node scripts/generate.mjs`), so
the website/storybook build depends on it via `^build`.

## Rules

- **Add an icon** by dropping `src/svg/<name>.svg`, then build
  (`pnpm --filter @moscowcss/icons build`, or the root `pnpm build`). Consume:
  `import { PascalName } from '@moscowcss/icons'`.
- **Never edit `src/generated/**`** — it is a git-ignored build artifact.
  Regenerate instead. Editing it by hand is always wrong.
- **Colour is `currentColor`** (SVGO `convertColors`) so icons theme via CSS
  `color`. **Outline/stroke icons must export with root `fill="none"`** (Figma
  does this) — the generator takes the root `fill` from the source so open paths
  aren't filled. Monochrome only; for multi-colour icons drop
  `convertColors.currentColor` in `svgo.config.mjs`.
- Icons default to `1em`; size via the `size` prop (or `width`/`height`); any
  extra props spread onto the root `<svg>`.
- Config/scripts are code → **Russian** comments (only `.md` stays English).

## Validate

```bash
pnpm --filter @moscowcss/icons build   # regenerates src/generated/**
pnpm lint                              # from repo root
```
