---
id: "06"
title: catalog-validation-and-relations
spec: "001"
criteria: ["AC-4", "AC-5", "AC-6", "AC-7", "AC-12"]
status: pending
depends_on: ["05"]
owns: ["apps/website/src/content/**", "apps/website/src/test/**", "apps/website/vitest.config.ts", "apps/website/package.json", "pnpm-lock.yaml", "packages/content/src/schema.ts"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Каталог контента — чистые функции с тестами: ошибки ссылок, переводов и схемы роняют сборку с путём
файла и полем, связи спикер↔доклад↔митап и выбор ближайшего митапа работают.

## Context (grounded)
- Образец: `/home/r/common/0work/blog/apps/blog/src/content/catalog.ts:60-170` (`validateLayout` бросает
  `Error`, ошибка роняет сборку), `apps/blog/src/seo/pages.ts:53-70` (`loadCatalog` — единственное место
  с `getCollection`, валидация внутри), `apps/blog/vitest.config.ts` (`getViteConfig`), тестовые фикстуры
  `apps/blog/src/test/content-fixtures.ts`.
- Схемы: `packages/content/src/schema.ts` (задача 05). Записи Astro имеют `id` (`ru/31`), `filePath`,
  `data`, `body`, `collection`.
- Инварианты переводов (сверка `en` с `ru` по одинаковому пути без языка): event — `date`,
  `venue.mapUrl`, `registrationUrl`, `streamUrl`, `recordingUrl`, `partner`, `schedule[].time`,
  `schedule[].kind`; talk — `event`, `speakers`, `time`, `slidesUrl`, `videoUrl`; speaker — `photo`, `links`. Плюс `venue.coordinates` (добавлено в задаче 05 для карты).
- Время в `schedule[]` митапа — диапазон `HH:MM—HH:MM` (длинное тире), у доклада — `HH:MM`; сортировка расписания — по началу (первые `HH:MM`).
- ADR `adr/001-content-model-md-relations.md` — почему связи только в докладе и инварианты дублируются.

## Steps
1. `pnpm --filter website add -D vitest`; `apps/website/vitest.config.ts` через `getViteConfig` (include
   `src/**/*.test.ts`, `scripts/**/*.test.mjs`); скрипт `"test": "vitest run"`.
2. `src/content/catalog.ts`: `validateCatalog(entries)` (неизвестный митап/спикер в своём языке — сообщение
   `<filePath>: <поле> → нет записи «<имя>» в <коллекция>/<язык>`; расхождение инварианта —
   `<filePath>: поле <путь поля> отличается от ru/<id>`; опубликованный доклад в черновом митапе),
   `loadCatalog()`, `talksOfEvent`, `scheduleOf(event, talks)` (доклады + перерывы/активности по `HH:MM`),
   `talksOfSpeaker` (по всем митапам, с митапом каждого доклада), `upcomingEvent(events, now)` (ближайший с
   датой ≥ now; иначе последний прошедший с `past: true`; черновики исключены), `pastEvents(events, now)`.
   `now` — аргумент, без `new Date()` внутри.
3. Проверить, что ошибка схемы Astro (нет обязательного поля) называет файл и поле: временно удалить
   `title` у одного файла, `pnpm build`, посмотреть вывод, вернуть. Если путь/поле не видны — обернуть
   `loadCatalog` так, чтобы сообщение их содержало.
4. `src/test/fixtures.ts` и `src/content/catalog.test.ts`: спикер с докладами на митапах 10 и 15; ссылка
   на несуществующего спикера; расхождение `time` в en; будущих нет → последний прошедший `past`; два
   будущих → ближайший; расписание сливает доклады и перерыв по времени.

## Done when
- [ ] `pnpm --filter website test` → pass, среди тестов: несуществующий спикер даёт ошибку с путём файла и именем (AC-4); расхождение `time` в en даёт ошибку с путём и `time` (AC-5); спикер с докладами на 10 и 15 получает оба с их митапами, расписание митапа сливает доклады и перерывы по времени (AC-7); при `now` после всех дат выбран последний митап с `past: true`, при двух будущих — ближайший (AC-12)
- [ ] временная правка `speakers: [nobody]` в любом `packages/content/src/talks/ru/*.md` → `pnpm --filter website build` exit ≠ 0 и вывод содержит путь файла и `nobody` (AC-4); правка откачена (`git diff --quiet packages/content/src/talks`)
- [ ] временное удаление `title` в одном файле контента → `pnpm --filter website build` exit ≠ 0, вывод содержит путь файла и `title` (AC-6); правка откачена
- [ ] `pnpm lint && pnpm build` → exit 0

## Must not
- делать поля схемы опциональными ради прохождения проверок; ослаблять сообщения ошибок
- вызывать `new Date()` в функциях каталога
- коммитить (коммит делает conductor); трогать файлы вне `owns`

## Report
`plans/001-blog-like-architecture/tasks/reports/06-report.md`. Вернуть conductor-у ТОЛЬКО: статус + строка +
файлы + `contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
