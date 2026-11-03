# AGENTS.md

Guidance for Cursor and any other AI agent working in this repository.

> **`CLAUDE.md` is the single source of truth.** This file is a short pointer so
> agents that read `AGENTS.md` (Cursor et al.) land on the same rules. When
> anything here is thinner than `CLAUDE.md`, **`CLAUDE.md` wins** — read it fully
> before running commands or writing code.
>
> **Per-package rules:** every `packages/*/` and `apps/*/` folder has its own
> `CLAUDE.md` **and** byte-identical `AGENTS.md` with that unit's specific rules
> (e.g. `@moscowcss/ui` must consume design tokens strictly from
> `@moscowcss/design-system`). Read the nearest one for local detail; keep the two
> twins in sync when editing.

## What this repo is

A Turborepo monorepo (pnpm workspaces): an **Astro** community site in two
languages (`apps/website`: `ru` at `/`, `en` at `/en/`), a **Storybook**
(`apps/storybook`, `@storybook-astro/framework`), and shared packages under the
`@moscowcss/*` scope — `content` (all site content as Markdown files + zod
schema), `og` (build-time OpenGraph/Twitter PNG cards), `ui` (Astro components +
vanilla-extract styles), `design-system` (the design-token system: palette +
semantic vars + scale tables + layout/typography tokens + breakpoints), `icons`
(SVGO → generated `.astro`), `fonts` (font *loading*), `eslint-config`,
`typescript-config`. Decisions: `specs/001-blog-like-architecture.md`,
`adr/001-*.md` (content model), `adr/002-*.md` (responsive scale).

## Non-negotiables (full detail in `CLAUDE.md`)

- **pnpm only.** Never `npm`/`yarn`, never hand-edit the lockfile.
- **Latest, exact versions.** Add deps with `pnpm add` (`.npmrc` pins exact, no
  ranges). Never hand-type or remember a version. Install into the package that
  uses it (`pnpm --filter <pkg> add <dep>`); repo-wide tooling with `pnpm add -Dw`.
- **Design tokens only** (`@moscowcss/design-system`, `packages/design-system/src`).
  No raw hex / `px` / breakpoints and no primitive-palette use inside components —
  import the semantic `vars` (and the `media` query strings for `@media`) from
  `@moscowcss/design-system`.
- **Shared config extends, never forks** — ESLint/TS rules live in
  `packages/eslint-config` and `packages/typescript-config`.
- **Use the generators** — `pnpm new:component`, and for content `pnpm new:event` /
  `new:talk` / `new:speaker` / `new:partner` / `new:faq` (drafts in `ru` and `en`,
  never overwrite). Never hand-create component or content files. Never edit
  `packages/icons/src/generated/**` — regenerate it.
- **Content is Markdown in `@moscowcss/content`**, `src/<collection>/<lang>/<name>.md`;
  relations live in the talk only; links `https` only, no raw HTML (the build
  fails otherwise). No user-facing text literals in `.astro` files: UI strings
  come from `apps/website/src/i18n`, the rest from content.
- **Sizes in `rem`, no `px`.** Values live in `scale.ts` tables; component inner
  padding is constant (`vars.padding`/`vars.spacing`), only `vars.layout.*` grows
  with width; `@media` in a component changes structure, not sizes.
- **Props extend the native element, tag is single source of truth.** A
  component's `Props` MUST be `interface Props extends HTMLAttributes<typeof Tag>`
  where `const Tag = 'div'` (from `astro/types`), rendered as `<Tag>` and spread
  onto the root via `class:list` + `{...attrs}`. Change the tag once → type and
  markup move together (desync impossible). Use `const Tag` **everywhere**, even
  fixed-element components (`Button` uses `const Tag = 'button'`). Never a bare
  DOM type like `HTMLButtonElement['type']`. Empty body is fine; declare only your
  **own** props (see `CLAUDE.md` §6).
- **Document every UI prop you add.** Each of your **own** members of a `Props`
  type MUST have a short **Russian** `/** … */` JSDoc comment — Storybook autodocs
  turns it into the prop's description (§6). A `//` comment is not picked up;
  inherited native attributes are documented upstream.
- **Comments** — otherwise only the *why* of genuinely non-obvious spots, short
  and in Russian. Only Markdown docs (`*.md`) stay English; every other file,
  config included, uses Russian comments.
- **`pnpm lint`, `pnpm test` and `pnpm build` must pass** before a task is done
  (`pnpm --filter website check:seo` after the build when pages or content changed).
- **Agents own git: commit, push, merge.** One coherent change per commit after
  the touched checks pass; branch for multi-step work (every push to `main`
  deploys); English Conventional Commits; no secrets or build output; no
  force-push or rewriting pushed history (see `CLAUDE.md` §2.9).

## Everyday commands (from repo root)

| Command | Does |
| --- | --- |
| `pnpm dev` | website dev server (Astro) |
| `pnpm storybook` | Storybook for the UI components |
| `pnpm build` | production build of the website (+ Pagefind index) |
| `pnpm build:storybook` | static Storybook build |
| `pnpm lint` | ESLint with `--fix` across all packages |
| `pnpm test` | all vitest suites (turbo) |
| `pnpm --filter website check:seo` | SEO gate over the built `dist` |
| `pnpm new:component` | scaffold a UI component and its story (plop) |
| `pnpm new:event <n>` / `new:talk` / `new:speaker` / `new:partner` / `new:faq <name>` | draft content files, `ru` + `en` |

For anything not covered here — dependency policy, theming/token layers and the
root font size, content and i18n rules, OG cards, CI/deploy, visual regression
(`tools/visual`), icon pipeline, Storybook setup — **read `CLAUDE.md`.**
