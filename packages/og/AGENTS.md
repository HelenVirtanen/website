# @moscowcss/og — agent guide

`CLAUDE.md` and `AGENTS.md` in this folder are **identical**, kept in sync so any
agent (Claude, Cursor, …) reads either and gets the same rules — **edit both
together.** Repo-wide rules live in the **root `CLAUDE.md`**, which wins on
conflict.

## What this is

Build-time generator of the OpenGraph (1200×630) and Twitter (1200×600) PNG cards:
`renderCard({ title, kicker, meta, size })` → `Buffer`. Cards are always in the dark theme. satori draws the SVG from a
plain `{type, props}` tree (no React), sharp rasterises it. The same package draws
the initials avatar of a speaker without a photo (`renderAvatar`) and the site icons
(`iconSvg`, `renderIcon`, `toIco`: the star in the brand red, `favicon.ico` holds PNGs).
Source-only package (exports `./src/index.ts`), no build step.

## Rules

- **Colours** come from `@moscowcss/design-system/theme-colors` (pure TS). Never import
  the root `@moscowcss/design-system` here: it pulls `.css.ts` files into Node.
- **Fonts**: Montserrat TTF are read from `@moscowcss/fonts` (`createRequire` +
  `@moscowcss/fonts/package.json`). Do not copy TTF into this package and do not
  download fonts. satori does not read WOFF2.
- **`onStyleError` throws**: an unsupported style must fail the build, not silently
  degrade the card.
- **Logo**: `src/logo.ts` duplicates the path of `packages/icons/src/svg/Logo.svg`;
  update both together.
- What goes on a card (which page, which text) is decided by the website
  (`apps/website/src/seo/og.ts`), not here.

## Validate

```bash
pnpm --filter @moscowcss/og test
pnpm --filter @moscowcss/og lint
```
