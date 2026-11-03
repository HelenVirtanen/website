# storybook — agent guide

`CLAUDE.md` and `AGENTS.md` in this folder are **identical**, kept in sync so any
agent (Claude, Cursor, …) reads either and gets the same rules — **edit both
together.** Repo-wide rules live in the **root `CLAUDE.md`**, which wins on
conflict. Below is only what's specific to this app.

## What this is

The component workshop, built on **`@storybook-astro/framework`** (community
framework, Storybook 10). Demos the `@moscowcss/ui` components.

## Rules

- **Stories live in `apps/storybook/stories/*.stories.ts`** (scaffolded by
  `pnpm new:component`). They import components from `@moscowcss/ui`.
- `.storybook/main.ts` is load-bearing: framework `renderMode: 'server'`, the
  vanilla-extract Vite plugin **and** a CSS-reinject plugin (so `.css.ts` styles
  reach the story canvas), addons `@storybook/addon-docs` + `@storybook/addon-a11y`,
  and onboarding disabled (`features.sidebarOnboardingChecklist: false`).
- **Autodocs is on for every component** (`tags: ['autodocs']` in
  `preview.ts`) → each component's own `Props` members **must** carry a Russian
  JSDoc (that's the docs table). See `@moscowcss/ui`.
- `.storybook/preview.ts` imports `@moscowcss/fonts` and
  `@moscowcss/design-system` once, so every story has fonts + `:root` tokens.
- **All `@storybook/*` packages share ONE version** (currently `10.4.6`). Add
  addons with `pnpm --filter storybook add -D @storybook/addon-x` and keep them in
  lockstep with `storybook`.

## Validate

```bash
pnpm storybook        # dev workshop on :6006
pnpm build:storybook  # static build (must pass)
```
