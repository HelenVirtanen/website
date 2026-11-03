# @moscowcss/typescript-config — agent guide

`CLAUDE.md` and `AGENTS.md` in this folder are **identical**, kept in sync so any
agent (Claude, Cursor, …) reads either and gets the same rules — **edit both
together.** Repo-wide rules live in the **root `CLAUDE.md`**, which wins on
conflict. Below is only what's specific to this package.

## What this is

Shared TypeScript bases — the **single source of truth** for compiler options.
Ships two files: `base.json` (strict TS base) and `astro.json` (extends base +
Astro's `strictest`). Not a runtime package.

## Rules

- **Every package's `tsconfig.json` extends one of these** — `base.json` for
  TS-only packages (e.g. `design-system`, `eslint-config`), `astro.json` for
  packages/apps with `.astro`. **Never fork compiler options per package**; change
  them here.
- When adding a base file, add it to `files` in `package.json` so it's exported.

## Validate

```bash
pnpm build   # type-checking flows through the apps that extend these
```
