---
id: "05"
title: content-package-schema-and-migration
spec: "001"
criteria: ["AC-2", "AC-3", "AC-9"]
status: done
depends_on: ["04"]
owns: ["packages/content/**", "apps/website/src/content.config.ts", "apps/website/package.json", "pnpm-lock.yaml", "apps/website/public/assets/*.jpg"]
model: sonnet
risk: migration
attempts: 0
---

## Goal
Пакет `@moscowcss/content` хранит весь контент сайта файлами `.md` по папкам `ru/` и `en/` со схемой zod;
текущие русские тексты перенесены без изменений, английские — переводом.

## Context (grounded)
- Образец пакета: `/home/r/common/0work/blog/packages/content/{package.json,src/collections.ts,src/schema.ts,README.md,CLAUDE.md}`.
  Загрузчик: `collections.ts:19-28` (`glob` + `generateId: ({ entry }) => entry.replace(/\.[^.]+$/, '')`,
  id = `ru/<имя>`). У нас `pattern: '**/*.md'` (MDX и YML вне охвата, ADR `adr/001-content-model-md-relations.md`).
- Сайт подключает коллекции так же, как блог: `apps/blog/src/content.config.ts` = `export { collections } from '@vzhyx/content/collections'`.
- Источник текстов (переносить ДОСЛОВНО): `apps/website/src/data/hero.ts` (title, modes, meetupLine,
  dateTime «9 июля 2026 в 18:00», address, passportNote, registrationHref, translationHref),
  `apps/website/src/data/schedule.ts` (доклады, спикеры, перерывы/активности, `scheduleHint`),
  `apps/website/src/data/partner.ts` (бренд и features), `apps/website/src/sections/FAQSection.astro:13-45`
  (вопросы и ответы со ссылками), `apps/website/src/sections/HeroSection.astro:56-61`,
  `JoinSection.astro`, `PartnerSection.astro`, `ProgramSection.astro` (подписи — в словарь позже, НЕ сюда).
- Фото спикеров: `apps/website/public/assets/{anna-rastorgueva,daria-egorova,denis-makushin}.jpg`.
- Модель (решения плана 3, 4 — `plans/001-blog-like-architecture/plan.md`): ссылки — короткие имена файлов
  (`event: "31"`, `speakers: [daria-egorova]`), номер митапа = имя файла `events/<lang>/31.md`.
- Схемы и поля — `plan.md`, задача T05 «IMPLEMENT» (PageSchema, EventSchema, TalkSchema, SpeakerSchema,
  PartnerSchema, FaqSchema). Дата митапа — с временем и смещением: `date: 2026-07-09T18:00:00+03:00`.
- Дом-правила: комментарии в коде по-русски, Markdown-доки по-английски, КРОМЕ README пакета контента —
  он для редакторов, по-русски (как README блога). `CLAUDE.md`/`AGENTS.md` пакета — английский, побайтно одинаковы.

## Steps
1. Создать `packages/content` (`package.json` name `@moscowcss/content`, private, exports `.`, `./collections`,
   `./schema`; devDeps через `pnpm --filter @moscowcss/content add -D astro typescript eslint
   @moscowcss/eslint-config@workspace:* @moscowcss/typescript-config@workspace:*` — версия astro должна
   совпасть с сайтом, проверьте `apps/website/package.json`; `tsconfig.json`, `eslint.config.js` по образцу
   `packages/ui`).
2. `src/schema.ts` и `src/collections.ts` (коллекции `pages, events, talks, speakers, partners, faq`;
   `speakers` — `schema: ({ image }) => …` для `photo`).
3. Контент: `pages/{ru,en}/index.md` (title, description, telegramUrl `https://t.me/moscowcss`, тело — абзац
   «о митапе»: в ru — короткий текст о сообществе MoscowCSS по смыслу текущего сайта, пометьте в отчёте,
   что его надо вычитать), `events/{ru,en}/31.md`, `talks/{ru,en}/<имя>.md` для каждого доклада,
   `speakers/{ru,en}/<имя>.md` + `speakers/assets/*.jpg` (перенести `git mv` из `public/assets`),
   `partners/{ru,en}/zvuk.md`, `faq/{ru,en}/<имя>.md` (поле `order` сохраняет порядок карточек).
   Ответы FAQ — Markdown; переносы строк — жёсткий перенос `\`.
4. `apps/website/src/content.config.ts`; `pnpm --filter website add @moscowcss/content@workspace:*`.
5. `README.md` пакета (русский): раскладка, таблица полей по коллекциям (обязательные отмечены), связи
   (доклад → митап и спикеры, обратные списки строятся сами), черновик `draft`, перевод = тот же путь в
   `en/`, какие поля обязаны совпадать между языками, правка с телефона (github.com → файл → карандаш →
   Commit changes), команды `pnpm new:*` (появятся в задаче 13 — описать как есть в плане).
6. `CLAUDE.md` = `AGENTS.md` пакета: назначение, правила (только `.md`, схема — единственный источник формы).

## Done when
- [ ] `ls packages/content/src` содержит `pages events talks speakers partners faq` и `find packages/content/src -type f ! -name '*.md' ! -name '*.ts' ! -path '*/assets/*'` → пусто — контент — отдельный пакет на `.md` (AC-2, AC-3)
- [ ] `grep -c "workspace:\*" apps/website/package.json` ≥ 5 и в нём есть `@moscowcss/content` — пакет подключён к сайту (AC-2)
- [ ] `cmp packages/content/CLAUDE.md packages/content/AGENTS.md` → молчит (AC-2)
- [ ] `grep -l "Если бизнес не играет\|ЕСЛИ БИЗНЕС НЕ ИГРАЕТ" packages/content/src/talks/ru/*.md` и `grep -rl "9 июля\|2026-07-09" packages/content/src/events/ru/31.md` → находят — тексты перенесены (AC-3)
- [ ] `grep -n "телефон" packages/content/README.md` и таблица полей присутствуют — README для редакторов (AC-9)
- [ ] `pnpm lint && pnpm build` → exit 0 (коллекции валидны по схеме)

## Must not
- использовать `.mdx`, `.yml`, `.json` для контента
- менять тексты русской версии (только перенос); удалять `apps/website/src/data` (это задача 08)
- вписывать версии руками; коммитить (коммит делает conductor после проверки); трогать файлы вне `owns`

## Report
Полный результат — `plans/001-blog-like-architecture/tasks/reports/05-report.md` (список файлов контента,
что перевести/вычитать). Вернуть conductor-у ТОЛЬКО: статус + одна строка + изменённые файлы +
`contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
