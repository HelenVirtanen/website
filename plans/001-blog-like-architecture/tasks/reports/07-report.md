# Report 07: i18n routing, BaseLayout, LocaleSwitcher

Status: DONE_WITH_CONCERNS
contract: 621371f0

## Done
- apps/website/src/i18n/{config,index,ui,ui.test}.ts: ru/en dictionaries (typed keys), hints, endonyms, test of equal keys.
- astro.config.mjs: i18n (ru default, no prefix), trailingSlash 'always'.
- src/layouts/BaseLayout.astro: lang, title, description, canonical (absolute, none for noindex), hreflang ru/en + x-default, NavBar + LocaleSwitcher, `card?` prop reserved (not rendered; task 10).
- LocaleSwitcher created via `pnpm new:component`; story with 4 cases (two languages, en current, one language, empty).
- NavBar: props links/telegramLabel/menuLabel/closeLabel, named slot `locale`; styles untouched; story passes the old Russian values.
- pages/[...locale]/index.astro (loadCatalog preserved), pages/index.astro removed.

## Checks
- lint, build, build:storybook: exit 0. website test: 27 passed.
- dist/index.html `<html lang="ru"`, dist/en/index.html `<html lang="en"`; 3 `<link rel="alternate" hreflang=` per page with absolute https://css.moscow/ and /en/.
- Visual (--exact baseline vs t07): all 30 pre-existing stories (incl. NavBar) 0.0000%; new LocaleSwitcher stories "no baseline" (expected). Site: navbar differs (switcher added, expected); other sections differ only in the 24px band where the sticky navbar overlaps (known README effect).

## Concerns
- Literal `grep -c 'hreflang='` gives 1 per file (compressHTML puts head on one line) and 5 occurrences with `-o` (3 head links + 2 switcher links that Step 4 requires to carry hreflang). Head alternates = 3.
- Plop template component.css.ts.hbs uses stale tokens (`vars.padding.medium`, `vars.font.body`); I rewrote the generated css by hand. Template is outside owns: record for later.
