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

A Turborepo monorepo (pnpm workspaces): an **Astro** marketing/community site
(`apps/website`), a **Storybook** (`apps/storybook`, `@storybook-astro/framework`),
and shared packages under the `@moscowcss/*` scope — `ui` (Astro components +
vanilla-extract styles), `design-system` (the design-token system: palette +
semantic vars + spacing + typography tokens + breakpoints), `icons` (SVGO →
generated `.astro`), `fonts` (font *loading*), `eslint-config`,
`typescript-config`.

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
- **Use the generators** — `pnpm new:component` / `new:speaker` / `new:event` /
  `new:report`. Never hand-create component or content-page files. Never edit
  `packages/icons/src/generated/**` — regenerate it.
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
- **`pnpm lint` and `pnpm build` must pass** before a task is done.
- **Commit your own work, never push.** One coherent change per commit on a
  feature branch (never straight to `master`), after the touched checks pass;
  English Conventional Commits; no secrets or build output. `git push`, merges
  into `master` and history rewrites are the user's call (see `CLAUDE.md` §2.9).

## Everyday commands (from repo root)

| Command | Does |
| --- | --- |
| `pnpm dev` | website dev server (Astro) |
| `pnpm storybook` | Storybook for the UI components |
| `pnpm build` | production build of the website |
| `pnpm build:storybook` | static Storybook build |
| `pnpm lint` | ESLint with `--fix` across all packages |
| `pnpm new:component` | scaffold a UI component (plop) |

For anything not covered here — dependency policy, theming/token layers,
icon pipeline, Storybook setup — **read `CLAUDE.md`.**
