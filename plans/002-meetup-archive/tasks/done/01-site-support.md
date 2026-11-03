---
id: "01"
title: site-support-for-archive
spec: "002"
criteria: ["AC-5", "AC-6", "AC-8", "AC-9", "AC-10"]
status: done
depends_on: []
owns: ["packages/content/src/schema.ts", "packages/content/src/collections.ts", "packages/content/src/documents/**", "packages/content/README.md", "packages/content/CLAUDE.md", "packages/content/AGENTS.md", "packages/content/templates/**", "apps/website/src/**", "apps/website/scripts/**", "apps/website/CLAUDE.md", "apps/website/AGENTS.md"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Сайт умеет всё, что нужно архиву: ссылку на фотоальбом митапа, спикера без должности, скрытую
регистрацию у прошедшего митапа, доклад без времени, страницу политики персональных данных и
старые адреса `/28.html`, `/29.html`, `/30.html`, `/personal-data.html`.

## Context (grounded)
- Уже сделано и не закоммичено в рабочем дереве: `TalkSchema.time` необязательное
  (`packages/content/src/schema.ts`, комментарий над полем), сортировка докладов без времени
  (`apps/website/src/content/catalog.ts`: `AFTER_ANY_TIME`, `byTime`, `scheduleOf`, `talksOfSpeaker`).
  Тестов на это ещё нет — добавить в `apps/website/src/content/catalog.test.ts` (фикстуры
  `apps/website/src/test/fixtures.ts`: `talk(id, data)`, `event(id, data)`).
- Схема митапа: `packages/content/src/schema.ts` `EventFields` (`registrationUrl`, `streamUrl`,
  `recordingUrl` — `url.optional()`). Добавить `photosUrl: url.optional()` рядом; поле
  инвариантно между языками — добавить в `INVARIANTS.events` (`catalog.ts`).
- Спикер: `createSpeakerSchema` `role: z.string().min(1)` → `.optional()` с русским комментарием-причиной:
  у спикеров первых митапов должность не сохранилась. Где `role` выводится — найти `grep -rn "data.role\|\.role" apps/website/src`
  и не выводить пустое (ProgramSection соединяет роли через ` · ` — отфильтровать пустые).
- Страница митапа: `apps/website/src/pages/[...locale]/events/[event].astro:40-45` — список ссылок.
  Добавить «Фотографии» (`photosUrl`, ключ словаря `event.photos` в `apps/website/src/i18n/ui.ts` ru и en)
  и показывать `registrationUrl` только если митап не прошёл: прошёл = `date + EVENT_DURATION_MS < now`
  (`catalog.ts` экспортирует `EVENT_DURATION_MS`; «сейчас» на главной берётся так же — найти
  `BUILD_NOW` в `apps/website/src/pages/[...locale]/index.astro` и вынести общий хелпер, если его нет).
- Политика: русский текст ДОСЛОВНО из `/tmp/claude-1000/-home-r-common-0work-website-2-0/551ad676-fd29-4599-8790-88cf5234c1f0/scratchpad/sources/old-site/personal-data.html` (раздел «Определения» и
  «Политика и правила», ссылки на https://t.me/moscowcss). Новая коллекция `documents` в
  `packages/content/src/collections.ts` (схема `DocumentSchema`: `title` 1–70, `description` 50–160) и файлы
  `packages/content/src/documents/{ru,en}/personal-data.md` (en — перевод). Маршрут
  `apps/website/src/pages/[...locale]/[document].astro` по образцу `events/[event].astro` (`BaseLayout`, `EntityPage`,
  `Prose`); страница публичная — добавить вид `document` в `apps/website/src/seo/pages.ts` (`publicPagesOf`,
  `SECTION` без префикса раздела — адрес `/personal-data/`), OG-карточку в `apps/website/src/seo/og.ts`
  (`OG_TYPE`, `cardInputOf`), JSON-LD — без разметки (как talk). Ссылку на политику вывести в
  `apps/website/src/sections/AboutSection.astro` (ключ `about.privacy`).
- Старые адреса: эндпоинт `apps/website/src/pages/[legacy].html.ts` (getStaticPaths по таблице
  `{ '28': '/events/28/', '29': '/events/29/', '30': '/events/30/', 'personal-data': '/personal-data/' }`)
  отдаёт HTML-заглушку: `<meta http-equiv="refresh" content="0; url=…">`, `<link rel="canonical">` на новый
  адрес, `<meta name="robots" content="noindex">`, видимая ссылка. Адрес брать из `url.pathname`,
  а НЕ из params/props — см. комментарий в `apps/website/src/pages/[...locale]/rss.xml.ts` про баг Astro.
  Страницы 28–30 появятся позже (задача 07) — заглушки собираются и сейчас, `check:seo` их пропускает как noindex.
- Документация: таблицы полей в `packages/content/README.md` (митап: `photosUrl`; спикер: `role` необязательна;
  доклад: `time` необязательно), `packages/content/CLAUDE.md` и `AGENTS.md` (одинаковые), шаблоны
  `packages/content/templates/{ru,en}/event.md` (подсказка про `photosUrl` YAML-комментарием),
  `apps/website/CLAUDE.md` и `AGENTS.md` (одинаковые: документы, заглушки старых адресов).

## Steps
1. Схема и каталог: `photosUrl`, необязательная `role`, инвариант; тесты на сортировку докладов без времени
   и на инвариант `photosUrl`.
2. Страница митапа: ссылка «Фотографии», регистрация только у будущего митапа; тест на хелпер «прошёл ли митап».
3. Коллекция `documents`, политика ru+en, маршрут, SEO-список страниц, ссылка из «О митапе».
4. Заглушки старых адресов.
5. Документация и шаблоны.

## Done when
- [ ] `pnpm lint && pnpm test && pnpm build && pnpm --filter website check:seo && pnpm build:storybook` → код 0 (AC-10)
- [ ] `grep -n photosUrl packages/content/src/schema.ts apps/website/src/content/catalog.ts` → поле есть и в инвариантах (AC-5)
- [ ] тест: прошедший митап — регистрации нет в ссылках, будущий — есть (AC-6)
- [ ] `test -f apps/website/dist/personal-data/index.html && test -f apps/website/dist/en/personal-data/index.html`; русский текст политики совпадает со старым сайтом (AC-8)
- [ ] `for f in 28 29 30 personal-data; do grep -o 'url=[^"]*' apps/website/dist/$f.html; done` → `/events/28/`, `/events/29/`, `/events/30/`, `/personal-data/` (AC-8)
- [ ] тест `catalog.test.ts`: доклады без времени идут после докладов со временем, между собой по имени файла (AC-9)

## Must not
- ослаблять поля схемы, кроме `role` спикера (и уже сделанного `time` доклада)
- удалять или ослаблять существующие тесты и проверки `check:seo`
- менять внешний вид секций главной (снимки `tools/visual` должны остаться прежними, кроме блока «О митапе»)
- трогать файлы вне `owns`; создавать контент митапов, докладов, спикеров

## Report
Полный результат — в `plans/002-meetup-archive/tasks/reports/01-report.md`. Вернуть только: статус, одну строку
итога, список файлов, `contract: <digest>` из `plans/002-meetup-archive/contract.md`.
