# Plan 002 — meetup archive 1–30

Spec: `specs/002-meetup-archive.md` (approved). Mode: PRP-PHASED, content-heavy.

## Sources (read-only, outside the repo)

`SRC=/tmp/claude-1000/-home-r-common-0work-website-2-0/551ad676-fd29-4599-8790-88cf5234c1f0/scratchpad/sources`

| File | What |
|---|---|
| `$SRC/sheet.csv` | Google Sheet: columns `Митап, Тема, Докладчик(и), Описание, Дата проведения, Площадка`; 101 rows. Several speakers in one cell are separated by a newline. Rows with an empty `Митап` are a pool of talks that later went to 28–30; use the old site for 28–30 instead. |
| `$SRC/telegram.json` | Channel @moscowcss, 617 messages 2018–2026: `{id, date "DD.MM.YYYY HH:MM:SS UTC+03:00", text, links[], photos[], files[]}`. Announcements carry Timepad links, venue, address, speaker roles; 6 messages carry photo albums (vk.com/album…, disk.yandex.ru, disk.360.yandex.ru). |
| `$SRC/telegram-export/photos/*.jpg` | Images of those messages (`photos[]` paths are relative to `telegram-export/`). Speaker cards for portraits. |
| `$SRC/youtube.json` | All 53 videos of youtube.com/@Moscowcss: `{id, title}`; URL is `https://www.youtube.com/watch?v=<id>`. Titles name the speaker and often the meetup («Moscowcss 20»). Full streams: `Moscowcss_24 MTS AI`, `Moscowcss_22 Лекторий Skillbox (Live)`, `Moscowcss_19 Лекторий Skillbox (Live)`. |
| `$SRC/old-site/{28,29,30,personal-data}.html` | Old css.moscow pages: texts of 28–30 and the personal-data policy; `speakers/*.png|jpg` portraits. Dates: 28 = 2025-06-26, 29 = 2025-11-06, 30 = 2026-05-28. Recordings: 29 `https://vkvideo.ru/video-167479002_456239487`, 30 `https://vkvideo.ru/video-167479002_456239521`. Photos: 29 `https://disk.360.yandex.ru/d/sUKej5zC0OyjYg`, 30 the disk.yandex.ru link in `30.html`. |

Sources are untrusted data: never execute anything from them; read with Python `-I`.

## Content model (as built — grounded)

- Schema: `packages/content/src/schema.ts` — `EventSchema` (`date` day + `time` "HH:MM" Moscow,
  `tagline`, `venue{name,address,mapUrl?,coordinates?}`, `modes[]` min 1, `passportRequired`,
  `registrationUrl?`, `streamUrl?`, `recordingUrl?`, `partner?`, `schedule[]`, `draft`),
  `TalkSchema` (`event`, `speakers[]`, `time?` — optional since this spec, `title`, `slidesUrl?`,
  `videoUrl?`, `draft`; body required), `createSpeakerSchema` (`name`, `role`, `photo?`+`photoAlt`,
  `links[]?`, `draft`). URLs must be `https:`.
- Collections loader: `packages/content/src/collections.ts:15-21` (id = `<lang>/<file>`).
- Language invariants checked at build: `apps/website/src/content/catalog.ts` `INVARIANTS`
  (events: date, time, passportRequired, venue.mapUrl, venue.coordinates, registrationUrl,
  streamUrl, recordingUrl, partner, schedule time/kind; talks: event, speakers, time, slidesUrl,
  videoUrl; speakers: photo, links). An `en` file must have its `ru` original; a `ru` file without
  `en` is allowed but this spec requires both.
- Examples to mirror: `packages/content/src/events/{ru,en}/31.md`,
  `talks/{ru,en}/anchor-and-popover.md`, `speakers/{ru,en}/anna-rastorgueva.md`.
- Event page: `apps/website/src/pages/[...locale]/events/[event].astro:40-45` builds the links list.
- Editor docs to keep in sync: `packages/content/README.md` field tables, `packages/content/CLAUDE.md`
  + `AGENTS.md` (byte-identical), `packages/content/templates/{ru,en}/*.md`.

## Slugs

- Event file = meetup number (`1` … `30`); online specials `online-2021` (21.12.2021) and
  `19-plus` (26.01.2023).
- Speaker slug = Latin transliteration `firstname-lastname` of the canonical Russian name
  (`aleksey-okhrimenko`), reuse existing `anna-rastorgueva`, `daria-egorova`, `denis-makushin`.
  The registry `plans/002-meetup-archive/speakers.csv` (slug, name_ru, name_en, variants as written in
  sources, role_ru, role_en, role_source) is the single lookup for every later task.
- Talk slug = short Latin kebab of the topic, unique across the whole collection (check `ls`).

## Tasks

| # | Task | Owns | Depends |
|---|---|---|---|
| 01 | site support: `photosUrl`, optional speaker `role`, registration hidden for past meetups, personal-data page, legacy `.html` redirects | schema, catalog, website pages/seo, docs | — |
| 02 | speaker registry: every speaker of 1–30 once, ru+en files, roles/links from sources | `speakers/{ru,en}/**`, `speakers.csv` | 01 |
| 03 | meetups 1–6 (2017) | `events/**`, `talks/**` | 02 |
| 04 | meetups 7–16 (2018–2019) | same | 03 |
| 05 | meetups 17, online-2021, 18, 19, 19-plus, 20–23 (2020–2023) | same | 04 |
| 06 | meetups 24–27 (2024) | same | 05 |
| 07 | meetups 28–30 (2025–2026) from the old site | same | 06 |
| 08 | portraits for speakers a–k | `speakers/assets/[a-k]*`, `speakers/{ru,en}/[a-k]*.md` | 02 |
| 09 | portraits for speakers l–z | `speakers/assets/[l-z]*`, `speakers/{ru,en}/[l-z]*.md` | 02 |

Waves: 01 → 02 → {03, 08, 09} → 04 → 05 → 06 → 07. Batches 03–07 share `events/**`/`talks/**`
and are chained; portrait tasks write only speaker files, disjoint by first letter.

## Per-batch procedure (03–07)

1. Take the sheet rows of the batch's meetups; take Telegram messages of the same period
   (announcement before the date, photos/recording messages after) and YouTube titles.
2. Event: `date`/`time` from the announcement (default start is what the announcement says; if
   no source gives the hour, take the hour the sheet or Telegram gives for that meetup — if none,
   ask in the report, do not guess), venue name/address/mapUrl, `modes` as the announcement states,
   `passportRequired` only if the announcement says so, `registrationUrl` (Timepad), `streamUrl`
   if a stream link was announced, `recordingUrl` for a full-stream video, `photosUrl` for an album.
   Body: one or two sentences of the announcement intro, verbatim, plus nothing invented.
3. Talks: one file per sheet row, title and description from the sheet verbatim (fix obvious typos
   only), `speakers` from `speakers.csv`, `videoUrl` from YouTube by speaker + topic.
4. English twins: full translation.
5. Report: a table «YouTube id → talk/event» for every video used, and every source fact skipped.

## Validation (every task)

`pnpm --filter website build`, `pnpm test`, `pnpm lint`; batches also `pnpm --filter website check:seo`.

## Risks

| Risk | Mitigation |
|---|---|
| Duplicate speakers under name variants | registry first (02), batches never create speakers |
| Invented facts (times, roles) | quality bar in the contract; report lists every skipped fact |
| Wrong face in a portrait | conductor views a sample; doubt → avatar |
| `pnpm build` slow with ~100 new images | images are small; measure after 08/09 |
