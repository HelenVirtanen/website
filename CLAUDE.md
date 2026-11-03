# CLAUDE.md

Rules of engagement for any AI agent (and human) working in this repository.
Read this file **fully** before running commands or writing code. When a rule
here conflicts with a habit or a default, this file wins.

**Agent files are everywhere and synced.** This root file holds **repo-wide**
rules. **Every package and app** additionally carries its own `CLAUDE.md` **and**
`AGENTS.md` (in `packages/*/` and `apps/*/`) with that unit's specific rules —
and within each folder the two files are **byte-identical**, so any agent reads
either. Keep them in sync: when you edit one, edit its twin. The nearest
package/app file governs local detail; this root file wins on conflict.

---

## 1. What this repo is

A Turborepo monorepo (pnpm workspaces) hosting a small marketing/community
website built with **Astro**, plus a component library, a Storybook, and shared
tooling. Styling is done with **vanilla-extract** on top of a two-layer,
theme-aware design-token system.

```
.
├── apps/
│   ├── website/          # the site itself (Astro)
│   └── storybook/        # component demo (@storybook-astro/framework)
├── packages/
│   ├── ui/               # Astro components + their vanilla-extract styles
│   ├── design-system/    # the design-token system: palette + semantic vars + spacing + typography tokens + breakpoints
│   ├── icons/            # source SVGs -> SVGO-cleaned, generated .astro icon components
│   ├── fonts/            # @font-face css + font files (font *loading*, not the font tokens)
│   ├── eslint-config/    # shared flat ESLint config (single source of truth)
│   └── typescript-config/# shared tsconfig bases (single source of truth)
├── plop-templates/       # generators used by new:* scripts
├── turbo.json
├── pnpm-workspace.yaml
├── .npmrc
└── package.json
```

Workspace package names use the `@moscowcss/*` scope: `@moscowcss/ui`,
`@moscowcss/design-system`, `@moscowcss/icons`, `@moscowcss/fonts`,
`@moscowcss/eslint-config`, `@moscowcss/typescript-config`.

---

## 2. Golden rules (non-negotiable)

1. **pnpm only.** Never run `npm install` / `yarn`. Never hand-edit a lockfile.
2. **Always install the latest version.** Add every dependency with
   `pnpm add <pkg>` (or `pnpm add -D <pkg>`) so the current published version is
   resolved. **Never** type a version range into `package.json` by hand, and
   **never** pin a version from memory — you don't know what is current, `pnpm`
   does.
3. **Exact versions, no ranges.** `.npmrc` sets `save-exact=true` and
   `save-prefix=''`, so `pnpm add` writes exact versions (`"astro": "5.13.2"`,
   not `"^5.13.2"`). Keep it that way.
4. **Install into the package that uses it.** Run `pnpm add` from inside the
   target package directory, or use `pnpm --filter <pkg> add <dep>`. Shared
   tooling that every workspace uses (turbo, prettier) lives at the root with
   `pnpm add -Dw`.
5. **Internal deps use the workspace protocol:** `"@moscowcss/ui": "workspace:*"`.
6. **Tooling config has exactly one home.** ESLint and TypeScript settings live
   in `packages/eslint-config` and `packages/typescript-config`. Every other
   package *extends* those. If a rule needs changing globally, change it there.
   Only add local overrides when something is genuinely unique to that package.
7. **Never downgrade the recommendation.** No "this is just a demo / MVP /
   student project" shortcuts. Always the current best-practice setup.
8. **`pnpm lint` and `pnpm build` must pass** before you consider a task done.
9. **Commit your own work; the user drives everything that leaves the machine.**
   - Commit as you go, one coherent change per commit: a finished task or a
     self-contained step of it, never a half-done state. The checks that the
     change touches (`pnpm lint`, `pnpm build`, `pnpm test`) pass before the
     commit; the husky `pre-commit` hook re-runs lint and build.
   - Never commit straight to `master`. Work on a feature branch (create one if
     you are on `master`); merging into `master` is the user's call.
   - Message in English, Conventional Commits (`feat:`, `fix:`, `chore:`,
     `refactor:`, `docs:`, `test:`, `ci:`), subject says what changed, body says
     why. Stage files explicitly — no `git add -A` that sweeps in stray files.
   - Never commit secrets, `.env` files, build output or generated artefacts
     (`dist/`, `packages/icons/src/generated/`, `.visual/`).
   - **Never `git push`**, force-push, rewrite published history or delete
     branches unless the user asks for it explicitly.

---

## 3. Package manager & dependency policy

`.npmrc` (do not remove these lines):

```properties
save-exact=true
save-prefix=''
```

Adding dependencies:

```bash
# a runtime dep in the website
pnpm --filter website add <pkg>

# a dev dep in the ui package
pnpm --filter @moscowcss/ui add -D <pkg>

# a repo-wide dev tool (turbo, prettier, syncpack…)
pnpm add -Dw <pkg>

# link an internal package
pnpm --filter website add @moscowcss/ui@workspace:*
```

Node & pnpm:

- Node: use the **current LTS** (hard floor is **>= 20.16**, required by
  `@storybook-astro/framework`). `engines.node` enforces the floor.
- Pin pnpm via Corepack — run `corepack use pnpm@latest` once; it writes the
  `packageManager` field. Do not guess/pin a pnpm version by hand.

---

## 4. Scripts (run from repo root)

| Script                | What it does                                                        |
| --------------------- | ------------------------------------------------------------------- |
| `pnpm dev`            | Runs the **website** dev server (Astro).                            |
| `pnpm storybook`      | Runs **Storybook** for the UI components.                           |
| `pnpm build`          | Production build of the **website**.                                |
| `pnpm build:storybook`| Static Storybook build (for deploy).                                |
| `pnpm lint`           | Lints **and** applies safe autofixes across all packages.           |
| `pnpm new:component`  | Scaffolds a new component in `packages/ui` (plop).                  |
| `pnpm new:speaker`    | Scaffolds a speaker content page in the website (stub).             |
| `pnpm new:event`      | Scaffolds an event content page in the website (stub).              |
| `pnpm new:report`     | Scaffolds a report content page in the website (stub).             |

Notes:

- `lint` = ESLint with `--fix`: autofixable issues are fixed, the rest are
  reported (non-zero exit). There is no separate "fix" script by design.
- `dev`/`storybook` are long-running (Turborepo `persistent`, uncached).
- `@moscowcss/ui` and `@moscowcss/fonts` are **source-only** packages (they export
  `.astro` / `.css.ts` / `.css` directly, no build step), so their changes are
  picked up live by the website's and Storybook's Vite dev servers.
- `@moscowcss/icons` **does** have a build step (SVG → generated `.astro`), so the
  website/storybook `build` depends on it topologically via `^build`.

---

## 5. Design tokens & theming (the heart of the system)

Tokens live in the dedicated **`@moscowcss/design-system`** package
(`packages/design-system/src`) and are the *only* place values are defined.
Components never contain raw hex colours, raw pixel sizes, or literal
breakpoints. `@moscowcss/ui` **consumes** these tokens; it does not define them.

### Two layers

1. **Primitive palette** — raw values, named by *what they are*
   (`palette.green = '#70DC55'`). Plain TS constants in `palette.ts`.
2. **Semantic contract** — named by *what they mean*
   (`vars.color.success` → `palette.green`). Components consume **only** this
   layer.

### Each concern is its own file

The semantic tokens are split by concern so each group is self-contained (it owns
its contract slice **and** its values — `colors` splits `light`/`dark`, the rest
expose a single theme-independent `values`), then assembled into one theme:

- **palette** (`palette.ts`) — the primitives.
- **semantic colours** (`colors.ts`) — `vars.color.*` mapped from the palette.
- **spacing** (`spacing.ts`) — a t-shirt scale (`xs`/`s`/`m`/`l`/`xl`/`xxl`) split
  into two semantic groups over the same values: `vars.padding.*` (inner padding)
  and `vars.spacing.*` (gaps/margins between elements), plus `vars.radius.*`.
  The scale is responsive — `themes/spacing.css.ts` bumps `m`/`l`/`xxl` on wide
  screens, so any component using those rungs scales up automatically.
- **typography** (`typography.ts`) — `vars.font.*` **tokens** (the font
  shorthands). These are *not* the font *loading*: `@font-face` + files live in
  `@moscowcss/fonts`. The family names here must match that package.

`contract.ts` assembles the slices into `vars`; the per-concern appliers in
`themes/` apply them — colour per theme, padding/radius/typography once on
`:root`. **Each concern applies its own tokens *and* owns its adaptive** in its
own file (`themes/colors.css.ts`, `themes/spacing.css.ts`,
`themes/typography.css.ts`), so no single theme file bloats with every concern's
responsive rules; `themes/index.css.ts` imports the three.

### Tooling choice

Use vanilla-extract's **`createGlobalThemeContract`** (not `createThemeContract`)
so the emitted CSS custom properties get **readable, stable names** like
`--padding-l` and `--font-shorthand-caption` instead of hashed ones. The naming
mapper turns the token path into the variable name (`padding.l` →
`--padding-l`).

**The theme switch affects colour and nothing else.** Padding, radius and
typography are theme-independent — `themes/spacing.css.ts` and
`themes/typography.css.ts` set them **once** on `:root` via
`createGlobalTheme(':root', vars.padding | vars.radius | vars.font, …)`. Do
**not** re-emit them per theme.

Colour is the only slice with a light/dark distinction:

- `createGlobalTheme(':root', vars.color, light)` — light is the base.
- `@media (prefers-color-scheme: dark)` on `:root` applies the **dark** colours
  automatically (OS preference).
- `:root[data-theme="dark"]` / `:root[data-theme="light"]` force a theme (manual
  toggle wins over OS). Both override **only** the `--color-*` vars.

> Current state: **dark colours duplicate light exactly.** Later we only change the
> `dark` values in `colors.ts` — the contract, typography, spacing and every
> component stay untouched. That is the whole point of the contract.

### Breakpoints are special

CSS media queries **cannot** read `var()`. So breakpoints (and anything used
inside `@media`) are **build-time TS constants** in `breakpoints.ts`, imported
into `.css.ts` files. Everything else (spacing, colour, radius, typography) is a
runtime CSS variable from the contract. Do not try to put breakpoints in the
contract.

`breakpoints.ts` exports named breakpoints (`mobile` / `tablet` / `laptop` /
`desktop` / `desktopLarge`, in `rem`) and a **`media`** map of ready-made
media-query strings for those names. In components use **`media`** as the
`@media` key — don't hand-write `(min-width: …)`.

### Typography is responsive by var-indirection

`fonts.ts` holds the family/weight primitives (`fontFamily.{display,sans,mono}`,
`fontWeight.*`). The `font` contract has three parts: **`size`** (rem values),
**`shorthand`** (a ready `font:` value per role), **`letterSpacing`**. A component
sets `font: vars.font.shorthand.h1` (+ optional `letterSpacing`). Roles:
`h1`/`h2`/`h3` = display (Montserrat), `body`/`caption` = sans (Inter), `ui` = mono
(JetBrains Mono).

The trick: each `shorthand` embeds its **size var** (`… var(--font-size-h1) …`),
so `themes/typography.css.ts` makes type responsive by overriding **only** the
size vars per breakpoint (`globalStyle(':root', { '@media': { [media.laptop]: { vars: { [vars.font.size.h1]: '…' } } } })`)
— the shorthands follow automatically. Never redefine a whole shorthand per breakpoint.

### The rule for components

```ts
// ✅ correct — semantic vars + media query from the `media` map
import { vars, media } from '@moscowcss/design-system';
export const card = style({
  padding: vars.padding.l,
  gap: vars.spacing.m,
  color: vars.color.success,
  font: vars.font.shorthand.caption,
  '@media': { [media.laptop]: { padding: vars.padding.xxl } },
});

// ❌ forbidden in a component
export const card = style({ padding: '16px', color: '#00FF00' }); // raw values
export const card = style({ color: vars.palette.green });         // primitive layer
```

File layout in `packages/design-system/src`:

```
src/
├── palette.ts        # primitives: brand colours + neutrals  (raw values, no vars)
├── fonts.ts          # primitives: fontFamily {display,sans,mono} + fontWeight (NOT @font-face)
├── colors.ts         # semantic colour tokens: contract slice + light/dark (from palette)
├── spacing.ts        # spacing tokens: t-shirt scale (xs…xxl) as padding + spacing groups + radius; contract slice + values
├── typography.ts     # font tokens: size / shorthand / letterSpacing (shorthand refs size vars)
├── contract.ts       # createGlobalThemeContract -> `vars` (assembles the slices)
├── themes/           # per-concern appliers: each writes to :root and owns its adaptive
│   ├── colors.css.ts     # colour = light base + dark (prefers-color-scheme + data-theme)
│   ├── spacing.css.ts    # padding/spacing/radius once on :root + responsive scale overrides (m/l/xxl) per breakpoint
│   ├── typography.css.ts # font once on :root + responsive font-size overrides per breakpoint
│   └── index.css.ts      # imports the three appliers — the theme entry point
├── breakpoints.ts    # mobile/tablet/laptop/desktop/desktopLarge (rem) + `media` query strings
└── index.ts          # re-exports { vars, breakpoints, media, palette } + type Breakpoint
```

---

## 6. `packages/ui` — components

- Components are **Astro components** (`.astro`).
- Each component gets its own folder under `src/components/`:
  `src/components/Button/Button.astro`, `Button.css.ts` (vanilla-extract),
  `Button.stories.ts`, `index.ts`. Consumers import a component by folder:
  `import Button from '@moscowcss/ui/components/Button'` (see the `exports` map,
  `./components/*`).
- Import styles from the colocated `.css.ts`; import tokens from
  `@moscowcss/design-system`. No inline `style="..."` with literal values.
- vanilla-extract runs via `@vanilla-extract/vite-plugin`, wired into both the
  website's `astro.config.mjs` and Storybook's Vite config.
- Add a new component with `pnpm new:component` — do not create the files by
  hand, so structure stays uniform.

### Props always extend the native element (mandatory)

A component's `Props` **must** extend the underlying element's attributes, and the
element's tag is a **single source of truth** so the type and the markup can never
drift apart. This is exactly what `pnpm new:component` scaffolds:

```astro
---
import type { HTMLAttributes } from 'astro/types';
import { root } from './Thing.css';

// Тег — единственный источник правды: меняешь 'div' на 'span' — тип и разметка
// меняются вместе, рассинхрон невозможен by design.
const Tag = 'div';

interface Props extends HTMLAttributes<typeof Tag> {
  // свои дополнительные пропсы
}

const { class: className, ...attrs } = Astro.props;
---
<Tag class:list={[root, className]} {...attrs}>
  <slot />
</Tag>
```

- `const Tag = 'div'` + `HTMLAttributes<typeof Tag>` + `<Tag>` — the tag string
  drives both the prop type and the rendered element. Change it once (`'div'` →
  `'span'`) and both update; you **cannot** desync them. No ESLint rule needed for
  that — the coupling is structural.
- Use `HTMLAttributes<…>` (from `astro/types`) — **never** a bare DOM lib type
  like `HTMLButtonElement['type']` (that trips `no-undef`, and gives one attribute
  instead of the whole element contract).
- The frontmatter forwards the rest onto the root element — destructure your own
  props + `class`, spread `...attrs`, merge classes with `class:list`. Every
  standard attribute, event, `aria-*` and `data-*` passes through for free; you
  declare **only** your own extra props.
- An **empty body is fine** — the shared ESLint config allows a single-extends
  empty interface.
- Use the `const Tag` pattern **everywhere**, even for a component that is
  conceptually always one tag (e.g. `Button` uses `const Tag = 'button'`) — it
  keeps every component uniform and desync-proof.

### Document every prop (mandatory)

Storybook autodocs derives each control's **description** from the JSDoc comment
on the corresponding member of the component's `Props`. So **every field of a
UI component's `Props` type MUST carry a short, self-contained JSDoc comment**
describing what it does. This is the one place doc-comments are *required* — it
is not "useless commenting" (§14), it is the source of the Storybook docs table.

Rules:

- Use a `/** … */` JSDoc block **directly above** each prop — a line `//`
  comment is **not** picked up by autodocs.
- One line, terse, describes the prop's *purpose* (not its type — the type is
  already visible). Written in **Russian**, like all other repo comments (§14).
- Applies to every member, including optional ones. When a `Props` extends a
  native type (e.g. `HTMLAttributes<'button'>`), document the props **you** add;
  the inherited ones are documented upstream.

```astro
---
import type { HTMLAttributes } from 'astro/types';
import { button } from './Button.css';

const Tag = 'button';

// `type`, `disabled`, `aria-*` и т.п. приходят из HTMLAttributes<typeof Tag> —
// объявляем и документируем только свои пропсы (здесь `variant`).
interface Props extends HTMLAttributes<typeof Tag> {
  /** Визуальный вариант: акцентная или второстепенная */
  variant?: 'primary' | 'secondary';
}

const { variant = 'primary', class: className, ...attrs } = Astro.props;
---
<Tag class:list={[button, className]} {...attrs}>
  <slot />
</Tag>
```

---

## 7. `packages/icons` — SVGO + generated Astro components

The "SVGR for Astro" of this repo. Source SVGs are cleaned with **SVGO** and
compiled into ready-to-import `.astro` icon components at build time — no
runtime cost, props forwarded to the root `<svg>`.

Pipeline:

1. Drop raw icons into `packages/icons/src/svg/<name>.svg`.
2. `pnpm --filter @moscowcss/icons build` (or the root `build`, which depends on it)
   runs `scripts/generate.mjs`:
   - optimizes each SVG with SVGO using `svgo.config.mjs`
     (strips fixed width/height so size is controllable, normalizes colours to
     `currentColor` for monochrome icons, and **keeps `fill="none"`** so
     stroke/outline icons don't get filled);
   - emits `src/generated/<PascalName>.astro`, each rendering `<svg>` with
     `width/height` defaulting to `1em`, the root **`fill` taken from the source
     `<svg>`** (`currentColor` by default; `none` for stroke/outline icons),
     `aria-hidden="true"`, and **all extra props spread onto the `<svg>`**;
   - regenerates `src/generated/index.ts` (a barrel re-exporting every icon).
3. Consume:

   ```astro
   ---
   import { ArrowRight } from '@moscowcss/icons';
   ---
   <ArrowRight size="24" class="text-success" />
   ```

`src/generated/` is produced output — treat it as build artifact (git-ignored;
regenerate rather than edit).

---

## 8. `packages/fonts`

- `index.css` holds the `@font-face` declarations; font files sit alongside it.
- Consumers `import '@moscowcss/fonts'` (or `@moscowcss/fonts/index.css`) once, at the app
  root. Font *family names* referenced by the design tokens must match the
  `@font-face` `font-family` values here.

---

## 9. `apps/website`

- Astro site. Depends on `@moscowcss/ui`, `@moscowcss/icons`, `@moscowcss/fonts`.
- `astro.config.mjs` registers the vanilla-extract Vite plugin.
- Content pages (speakers / events / reports) are scaffolded via `new:*`
  scripts and are currently **stubs** — placeholder frontmatter + minimal
  markup, ready to be filled in later.

---

## 10. `apps/storybook`

- Uses **`@storybook-astro/framework`** (community framework). Requirements:
  Node **20.16+**, **Storybook 10**, **Astro 5.5.3+** (the repo currently runs
  **Astro 7**), **Vite 6+**.
- `.storybook/main.ts` sets `framework: { name: '@storybook-astro/framework' }`
  and, in `viteFinal`, adds the **vanilla-extract Vite plugin** so component
  styles resolve identically to the website.
- Stories live next to components in `@moscowcss/ui` (`*.stories.ts`); Storybook's
  `stories` glob points into that package.
- `npm create storybook` does **not** recognise Astro — set it up manually per
  the framework docs. Install with `pnpm add`, latest versions.

---

## 11. Shared configs — extend, don't fork

`@moscowcss/typescript-config` exports:
- `base.json` — strict TS base.
- `astro.json` — extends base + Astro's `strictest` tsconfig.

`@moscowcss/eslint-config` exports a **flat config** (`eslint.config.js` style):
- base = `typescript-eslint` + `eslint-plugin-astro` + Prettier compat.
Each package's own `eslint.config.js` imports and spreads this, adding local
rules **only** when unavoidable. Same for tsconfig via `extends`.

---

## 12. Definition of done

Before declaring any task complete:

```bash
pnpm install        # if deps changed — lockfile updated, exact versions
pnpm lint           # zero errors (warnings acceptable if agreed)
pnpm build          # website builds
pnpm build:storybook  # if you touched components/stories
```

Then sanity-check the token rule: search your diff for raw hex colours
(`#`), literal `px` in `.css.ts`, and any use of the primitive palette inside a
component. All three are red flags.

---

## 13. Do NOT

- ❌ `npm`/`yarn`, editing lockfiles, or committing `node_modules`.
- ❌ version ranges (`^`, `~`) or hand-typed/remembered versions.
- ❌ raw hex/px/breakpoints inside components — go through tokens.
- ❌ referencing the primitive palette from a component (semantic layer only).
- ❌ duplicating ESLint/TS rules in a package instead of extending the shared config.
- ❌ hand-creating component or content-page files — use the `new:*` generators.
- ❌ editing `packages/icons/src/generated/**` — regenerate it.
- ❌ downgrading a recommendation for being "just a demo".
- ❌ useless/obvious comments (see §14).

---

## 14. Code comments

- **No useless comments.** Do not restate what the code already says. Most code
  should carry no comments at all.
- **Comment only genuinely non-obvious spots** — a real gotcha, invariant, or
  reason that isn't clear from the code itself. If nothing is unclear, write
  nothing.
- **Such comments are written in Russian and kept short** (one line where
  possible). They explain the *why*, not the *what*.
- **English only in Markdown.** Only Markdown docs (`CLAUDE.md`, `AGENTS.md`, and
  any `*.md`) stay in English. **Every other file uses Russian comments** — that
  includes configuration (`*.config.*`, `.storybook/*`, `eslint.config.js`,
  tsconfig, `pnpm-workspace.yaml`, `turbo.json`, build scripts, etc.), which are
  code like everything else.
- **Exception — required doc-comments:** members of a UI component's `Props`
  type are the source of Storybook's prop descriptions and **must** each carry a
  short Russian JSDoc comment (§6). This overrides "most code carries no
  comments" for that specific case.
