# @moscowcss/design-system — agent guide

`CLAUDE.md` and `AGENTS.md` in this folder are **identical**, kept in sync so any
agent (Claude, Cursor, …) reads either and gets the same rules — **edit both
together.** Repo-wide rules live in the **root `CLAUDE.md`**, which wins on
conflict.

The design-token system for the repo. **The single source of truth for every
value** (colour, spacing, radius, typography). Everything visual elsewhere
(`@moscowcss/ui` components, the website) consumes tokens from here and defines
nothing itself.

## Two layers

1. **Primitive palette** (`palette.ts`) — raw values named by *what they are*
   (`palette.green = '#70DC55'`). **Never imported by a component.** Only the
   semantic token files below read the palette.
2. **Semantic contract** (`vars`, from `contract.ts`) — named by *what they mean*
   (`vars.color.success`). This is the **only** layer components may import.

## One concern per file

Each semantic group is self-contained: it owns its slice of the contract shape
**and** its values (`colors` splits into `light`/`dark`; theme-independent slices
expose a single `values`). `contract.ts` assembles the slices into `vars`; the
per-concern appliers in `themes/` apply them (colour per theme, the rest once on
`:root`) — **each concern owns its own application *and* its adaptive**, so no
single file bloats with every concern's responsive rules.

```
src/
├── palette.ts      # primitives (raw values)
├── fonts.ts        # primitives: fontFamily {display,sans,mono} + fontWeight (NOT @font-face)
├── colors.ts       # semantic colours: contract slice + light/dark (from palette)
├── scale.ts        # scale tables ("base + steps per breakpoint", rem) + resolver; tested in scale.test.ts
├── spacing.ts      # t-shirt scale (xs…4xl, constant) as padding + spacing groups + radius: contract slice + values
├── typography.ts   # font tokens: size / shorthand / letterSpacing (shorthand refs size vars)
├── contract.ts     # createGlobalThemeContract -> `vars`  (assembles the slices)
├── themes/         # per-concern appliers: each writes to :root and owns its adaptive
│   ├── colors.css.ts     # colour = light base + dark (prefers-color-scheme + data-theme)
│   ├── spacing.css.ts    # padding/spacing/radius/size once on :root, constant (no @media)
│   ├── layout.css.ts     # layout.inset / layout.gap ladders: base + overrides per breakpoint from `layoutSpace`
│   ├── typography.css.ts # font once on :root + font-size overrides generated from `typeScale`
│   ├── root.css.ts       # html font-size: max(100%, 100vw / 120) — the UI grows above 1920px (ADR-002)
│   └── index.css.ts      # imports all appliers — the theme entry point
├── breakpoints.ts  # mobile/tablet/laptop/desktop/desktopLarge (rem) + `media` query strings (NOT css vars)
└── index.ts        # side-effect: applies the theme; re-exports { vars, breakpoints, media, palette }
```

## Rules

- **Scale lives in tables (`scale.ts`).** Font sizes (`typeScale`), the constant
  spacing steps (`space`) and the growing ladders (`layoutSpace.inset|gap`) are
  "base + overrides per breakpoint" tables in `rem`; themes generate CSS from them
  (`baseValues`, `mediaOverrides`) and `scale.test.ts` checks the resolver. Growing
  values go to `vars.layout.inset|gap`; `vars.padding|spacing` never change with width.
- **Add a token** by editing the concern file (e.g. a new colour → `colors.ts`):
  add the key to its `contract` slice **and** to its values (`colors` has
  `light`/`dark`; theme-independent slices like `spacing`/`typography` have a
  single `values`). The key appears on `vars` automatically; nothing else changes.
- **Theme = colour only.** `themes/spacing.css.ts` and `themes/typography.css.ts`
  set padding/radius/font **once** on `:root`; only `vars.color`
  (`themes/colors.css.ts`) gets a light/dark switch. Never re-emit non-colour
  tokens per theme. Dark applies via `@media (prefers-color-scheme: dark)` **and**
  `:root[data-theme="dark"]`; `:root[data-theme="light"]` forces light. All three
  override **only** `--color-*`.
- **`createGlobalThemeContract`, not `createThemeContract`** — the readable var
  names (`vars.color.success` → `--color-success`) come from the `path.join('-')`
  naming mapper. Keep it.
- **Breakpoints are build-time constants, not css vars** — `@media` cannot read
  `var()`. Import `media` (ready-made query strings) into `.css.ts` `@media`
  blocks: `'@media': { [media.laptop]: { … } }`. Use `breakpoints` for the raw
  `rem` values. Never try to put them in the contract.
- **Typography tokens ≠ font loading.** Families/weights are primitives in
  `fonts.ts` (`fontFamily.{display,sans,mono}`, `fontWeight.*`); the actual
  `@font-face` + files live in `@moscowcss/fonts` and family names must match.
- **Typography is responsive by var-indirection.** `font.shorthand.*` embeds its
  `font.size.*` var (`… var(--font-size-h1) …`). To make type responsive, override
  **only** the size vars per breakpoint in `themes/typography.css.ts`
  (`globalStyle(':root', { '@media': { [media.laptop]: { vars: { [vars.font.size.h1]: '…' } } } })`) —
  the shorthands follow. Never redefine a full shorthand per breakpoint. Note the
  size var is referenced as a `var(--font-size-…)` string inside `typography.ts`
  (importing `vars` there would be a circular dependency).
- **Dark currently duplicates light.** To theme dark, change only the `dark`
  values in **`colors.ts`** — the contract, typography, spacing and every
  component stay untouched.
- **Comments:** only the *why* of non-obvious spots, short, in Russian (root §14).

## Validate

Source-only package (no build step). From the repo root:

```bash
pnpm lint
pnpm build            # website — proves the :root token vars emit
pnpm build:storybook  # if components/stories are affected
```
