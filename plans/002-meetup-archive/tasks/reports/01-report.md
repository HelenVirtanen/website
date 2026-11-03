# Report 01: site support for the archive

contract: e9668572
Status: DONE

All Done-when commands pass: `pnpm lint && pnpm test && pnpm build` (exit 0), `check:seo` OK (25 HTML, 18 indexable), `pnpm build:storybook` exit 0.

## Done
- Schema: `photosUrl` on the event (and in `INVARIANTS.events`), `role` of the speaker optional (Russian reason comment), new `DocumentSchema` and `documents` collection.
- Bug in the pre-existing edit: the `'~'` sentinel in the sort did not work (`localeCompare` puts punctuation before digits, so talks without a time went FIRST). Replaced with `compareTimes` (absent time is later than any). Covered by tests for `talksOfEvent`, `scheduleOf`, `talksOfSpeaker`.
- `isPastEvent` (catalog.ts), `buildNow()` (`src/content/now.ts`, extracted from index.astro), `eventLinksOf` (`src/content/event-links.ts`): registration is hidden for a past meetup, a "Photos" link was added (`event.photos`).
- Policy: `documents/{ru,en}/personal-data.md`; the Russian text is checked programmatically against the old site (all 11 list items match). Quirks of the source kept verbatim: "а так же", "на срок от 25 лет". Route `[...locale]/[document].astro`, `document` kind in `seo/pages.ts`, `og.ts`, `jsonld.ts` (no markup), link in AboutSection (`about.privacy`).
- Role absent: speaker page, talk page, ProgramSection, JSON-LD, OG card handle it without empty elements.
- Legacy addresses: `/28.html`, `/29.html`, `/30.html`, `/personal-data.html`.
- Docs: README (photosUrl, role, time, documents), content CLAUDE/AGENTS and website CLAUDE/AGENTS (twins are identical), event templates.

## Deviation from the task
`[legacy].html.ts` with getStaticPaths does not build in Astro 7 ("Missing parameter: legacy" for `/28.html/`). Replaced with four static endpoints `pages/{28,29,30,personal-data}.html.ts` plus a table and HTML in `src/seo/legacy.ts` (tested). The generated stubs match the Done-when: `url=/events/28/` etc. The stubs for 28-30 point at pages that do not exist yet (task 07).

## Tests added
catalog.test.ts (sorting, photosUrl invariant), event-links.test.ts, now.test.ts, legacy.test.ts, pages.test.ts (document), og.test.ts (document, speaker without a role). 166 + new, all passing.

## Not done / to record
- `tsc --noEmit` in apps/website gives errors (astro types are not generated); `astro check` was not run. Lint and build are green.
- The pre-existing `Попутно`: none besides the sort fix above.
