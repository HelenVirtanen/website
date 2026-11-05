---
id: "01"
title: catalog-order-filter
spec: "007"
criteria: ["AC-2", "AC-4"]
status: done
depends_on: []
owns: ["apps/website/src/content/archive.ts", "apps/website/src/content/archive.test.ts", "apps/website/src/test/fixtures.ts"]
model: opus
risk: none
attempts: 0
---

## Goal
Чистые функции архива: порядок митапов, докладов, спикеров, метки митапов, данные строк списков, фильтр и разбор состояния фильтра из адреса.

## Context
- `apps/website/src/content/catalog.ts`: `talksOfEvent`, `talksOfSpeaker`, `pastEvents`, `byTime` (порядок программы), `isPublished`.
- Фикстуры `apps/website/src/test/fixtures.ts` (`twoMeetupsCatalog`, `event`, `talk`, `speaker`).

## Steps
1. `archive.ts`: `eventsNewestFirst`, `talksNewestFirst`, `speakersByLatestTalk`, `eventLabel`, `archiveOf(catalog, locale)` → строки трёх видов.
2. `filterArchive(items, filter)`: текст без регистра и `ё`, год, флаги; `filterFromSearch` / `searchOfFilter`.
3. Тесты на фикстурах с повторным спикером и границы фильтра.

## Done when
- [ ] `pnpm --filter website test -- archive` зелёный: AC-2, логика AC-4.

## Must not
- сортировать в `.astro`;
- менять порядок `talksOfSpeaker` и других существующих функций каталога.
