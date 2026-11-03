# @moscowcss/ui — agent guide

`CLAUDE.md` and `AGENTS.md` in this folder are **identical**, kept in sync so any
agent (Claude, Cursor, …) reads either and gets the same rules — **edit both
together.** Repo-wide rules (pnpm-only, exact versions, Russian comments, git
discipline) live in the **root `CLAUDE.md`**, which wins on conflict. Below is
only what's specific to this package.

## What this is

The Astro **component library** (`@moscowcss/ui`). Source-only — no build step;
exports `.` and `./components/*`. Components are consumed by `apps/website` and
demoed in `apps/storybook`.

## Rules

- **Design tokens come STRICTLY from `@moscowcss/design-system`.** Import `vars`
  and `media` from it. In a component **never** write a raw hex colour, a raw
  `px`/`rem` size, a literal breakpoint, or reference the primitive `palette`.
  Colour → `vars.color.*`, spacing → `vars.padding.*` (inner) / `vars.spacing.*`
  (gaps/margins) / `vars.radius.*`, type →
  `vars.font.shorthand.*`, media queries → `media.*`, fixed component sizes →
  `vars.size.*`.
- **Padding and gaps are constant; only `vars.layout.inset|gap.*` grow with width**
  (ADR-002). Use `layout.*` only where the design grows the value. Inside a
  component's `@media` change structure (direction, columns, visibility) or swap one
  token step for another; never put a literal size there. If a size must change
  with width, add it to the scale tables in `@moscowcss/design-system`.
- **No user-facing text literals.** A component takes its text through props or
  slots; the website feeds them from the i18n dictionary or from content, so the
  same component serves `ru` and `en`.
- **One folder per component** under `src/components/<Name>/`: `<Name>.astro`,
  `<Name>.css.ts` (vanilla-extract), `index.ts`. `pnpm new:component`
  scaffolds all of it plus the story; by hand is fine if the result has the same
  shape (story and JSDoc included).
- **Props extend the native element with a single-source tag:**
  `const Tag = 'button'` + `interface Props extends HTMLAttributes<typeof Tag>`,
  rendered `<Tag>` with `class:list={[…, className]}` + `{...attrs}`. Declare only
  your **own** props; give each a short **Russian** `/** … */` JSDoc (Storybook
  autodocs reads it). Never a bare DOM type like `HTMLButtonElement['type']`.
- **Styles live only in the colocated `.css.ts`** — no inline `style="…"` with
  literal values.
- **Stories live in `apps/storybook/stories/`**, not here (`pnpm new:component`
  creates the story with the component).
- Source-only: Vite/Astro pick up changes live; nothing to build here.

## Validate

```bash
pnpm lint            # from repo root (or: pnpm --filter @moscowcss/ui lint)
pnpm build           # website builds (consumes this package)
pnpm build:storybook # if components/stories changed
```
