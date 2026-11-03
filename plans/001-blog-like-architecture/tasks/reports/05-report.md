# Report 05 — content package

Status: DONE_WITH_CONCERNS. contract: 621371f0

## Created
- packages/content/{package.json,tsconfig.json,eslint.config.js,CLAUDE.md,AGENTS.md,README.md}
- packages/content/src/{index.ts,schema.ts,collections.ts}
- Content (ru + en each): pages/index; events/31; talks/{gamification-in-business,css-features-you-missed,anchor-and-popover};
  speakers/{daria-egorova,denis-makushin,anna-rastorgueva}; partners/zvuk;
  faq/{become-speaker,afterparty,questions,telegram,duration} (order 1..5)
- speakers/assets/*.jpg (git mv from apps/website/public/assets)
- apps/website/src/content.config.ts; apps/website/package.json (+@moscowcss/content); pnpm-lock.yaml

## Concerns
1. Photos moved out of public/assets: website still references /assets/*.jpg in src/data/schedule.ts -> 404 until T08 (as planned).
2. Schema extension beyond plan.md: optional `venue.coordinates {latitude, longitude, zoom}` (map point from data/partner.ts; otherwise lost when T08 deletes data/). T06 invariants should include it.
3. Texts with no field in the plan schema, placed in the event body (31.md): scheduleHint, directions address/hints, route media title. Hero title/labels/passportNote text/"Регистрация"/section titles -> dictionary (T07/T08). `passportRequired: true` carries the passport note.
4. `streamUrl` omitted (translationHref was empty); partner `url` and venue `mapUrl` omitted (no source URL).
5. Hero address «Москва, Поклонная, д. 3» (venue.address) differs from partner directions «Москва, ул. Поклонная, д. 3» (event body); both verbatim.
6. FAQ link https://t.me/@moscowcss carried verbatim (looks broken, source bug).
7. Schedule time for break/activity is an interval string «19:40—20:00»; schema accepts HH:MM or HH:MM—HH:MM (T06 merge must sort by the first 5 chars).
8. Talk title slugs (file names) are my choice.
9. `event: "31"` must be quoted (z.string per plan); documented in README.

## For editorial review
- pages/ru/index.md body and title/description — new text, written by me by meaning; needs proofreading (ru and en).
- All en files are agent translations: events/en/31.md, talks/en/*, speakers/en/* (role translations; "ЦЕХ" -> "TSEKH", "B&D" kept; "бигтех" -> "big tech company"), partners/en/zvuk.md, faq/en/*.
- Names transliterated: Daria Egorova, Denis Makushin, Anna Rastorgueva.
- Talk title "ЕСЛИ БИЗНЕС НЕ ИГРАЕТ — ЕМУ КАПЕЦ" -> "IF BUSINESS DOESN'T PLAY, IT'S DOOMED" (tone is colloquial).
- `#вопросспикеру` tag kept in Russian in en text (it is the actual chat tag).

## Done when
All checked: ls/find, workspace count 7 + content dep, cmp silent, grep hits, README (телефон + tables), pnpm lint and pnpm build exit 0.
Negative check: removing `order` from a faq file makes `astro sync` fail with the file path (restored).
