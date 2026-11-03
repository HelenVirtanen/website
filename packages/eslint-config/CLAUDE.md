# @moscowcss/eslint-config — agent guide

`CLAUDE.md` and `AGENTS.md` in this folder are **identical**, kept in sync so any
agent (Claude, Cursor, …) reads either and gets the same rules — **edit both
together.** Repo-wide rules live in the **root `CLAUDE.md`**, which wins on
conflict. Below is only what's specific to this package.

## What this is

The shared flat ESLint config — the **single source of truth** for lint rules.
Exported from `index.js`; every package spreads it.

## Rules

- **Every package's `eslint.config.js` is just**
  `import config from '@moscowcss/eslint-config'; export default [...config];`.
  **Never fork rules per package** — change them here, once.
- What it enforces: `typescript-eslint` recommended, `eslint-plugin-astro`,
  **strict accessibility** (`astro.configs['jsx-a11y-strict']`), Prettier compat
  (formatting rules off), Node globals for config/script files, and
  `@typescript-eslint/no-empty-object-type` set to `allowInterfaces:
  'with-single-extends'` (so `interface Props extends HTMLAttributes<…> {}` is
  allowed).
- Add deps with `pnpm --filter @moscowcss/eslint-config add -D <latest>`.
- This is code, not docs → **Russian** comments (only `.md` stays English).

## Validate

```bash
pnpm lint   # from repo root — exercises this config across every package
```
