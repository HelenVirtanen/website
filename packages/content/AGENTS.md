# @moscowcss/content — agent guide

`CLAUDE.md` and `AGENTS.md` in this folder are **identical**, kept in sync so any
agent (Claude, Cursor, …) reads either and gets the same rules — **edit both
together.** Repo-wide rules (pnpm-only, exact versions, Russian comments, git
discipline) live in the **root `CLAUDE.md`**, which wins on conflict. Below is
only what's specific to this package.

## What this is

The single home of all site content: Markdown files with frontmatter, split by
collection and then by language. Source-only — no build step. Exports `.`,
`./collections` (Astro content collections) and `./schema` (zod schemas).
`apps/website` re-exports the collections from its `content.config.ts`.

Decision record: `adr/001-content-model-md-relations.md`.

## Rules

- **Only `.md` files** for content. No `.mdx`, `.yml`, `.json`. Images live in
  `assets/` next to the collection (`speakers/assets/`).
- **The schema is the single source of the shape.** Fields are defined in
  `src/schema.ts` only; do not make required fields optional to "ease" editing —
  the editor-facing answer is short flat fields and clear error messages.
- **Layout:** `src/<collection>/<lang>/<name>.md`, languages `ru` and `en`. A
  translation is the same path in the other language folder. The entry id is
  `<lang>/<name>`; a meetup number is the file name (`events/ru/31.md`).
- **Relations are stored in the talk only** (`event`, `speakers`) as short file
  names without the language (`event: "31"`, `speakers: [daria-egorova]`). Reverse
  lists are built at build time. Never write both directions.
- **Language-independent fields are duplicated in the translation** and checked
  against `ru` at build time (`apps/website/src/content/catalog.ts`, tests next to
  it). A mismatch fails the build with the file path and the field name.
- **Meetup date and time:** `date` is a day (`2026-07-09`, no time), `time` is the
  start in Moscow time (`"18:00"`, quoted). A date with a time is rejected: YAML
  would read it as UTC.
- **Links are `https` only**; bodies are Markdown only (raw HTML or a non-`https`
  link fails the build — `apps/website/src/content/markdown-safety.ts`). Empty
  bodies of pages, talks and FAQ are errors.
- **`draft: true`** keeps an entry off the site. A published meetup cannot
  reference a draft partner. The `new:*` templates start as drafts.
- **New entries come from `pnpm new:event | new:talk | new:speaker | new:partner |
  new:faq`** (templates in `templates/`, outside `src/`, so they are not content).
  Never hand-create them.
- **Russian text is the source of truth.** Do not edit Russian wording while
  moving content; the English text is a translation of the Russian meaning,
  names are transliterated.
- Collections: `pages`, `events`, `talks`, `speakers`, `partners`, `faq`.
- `README.md` here is for editors and is written in Russian; keep its field
  table in sync with `src/schema.ts`.

## Validate

```bash
pnpm lint            # from repo root
pnpm test            # catalog, schema and generator tests (they live in apps/website)
pnpm build           # website build loads every collection and validates it
```
