---
id: "13"
title: content-scaffolding-commands
spec: "001"
criteria: ["AC-8", "AC-9"]
status: done
depends_on: ["12"]
owns: ["apps/website/scripts/new-entry.mjs", "apps/website/scripts/new-entry.test.mjs", "packages/content/templates/**", "packages/content/README.md", "package.json", "plopfile.mjs", "plop-templates/content/**"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
`pnpm new:event|new:talk|new:speaker|new:partner|new:faq <имя>` создаёт черновики на ru и en из
шаблонов пакета контента и никогда не перезаписывает существующие файлы; старые plop-заглушки страниц убраны.

## Context (grounded)
- Образец: `/home/r/common/0work/blog/apps/blog/scripts/new-entry.mjs:1-107` (`LOCALES`, regex имени,
  `DEFAULT_DIRS` от `packages/content`, `planEntry` — сначала собирает все пути и падает при любом
  существующем, `runNewEntry` пишет с `flag: 'wx'`, возвращает код), тест `new-entry.test.mjs`.
- Шаблоны блога: `packages/content/templates/<lang>/*.mdx` (вне `src/`, на сайт не попадают).
- Схемы: `packages/content/src/schema.ts` — шаблон должен проходить схему после заполнения плейсхолдеров
  и сразу быть `draft: true`.
- Старые генераторы: `plopfile.mjs:35-50` (цикл `speaker/event/report` → `apps/website/src/pages/*s/*.astro`),
  `plop-templates/content/page.astro.hbs`; корневые скрипты `new:speaker`, `new:event`, `new:report` в `package.json`.
  Генератор `component` в plopfile ОСТАЁТСЯ.
- Имя: `event` — целое число (номер митапа); прочие — `^[a-z0-9]+(?:-[a-z0-9]+)*$`.

## Steps
1. Шаблоны `packages/content/templates/{ru,en}/{event,talk,speaker,partner,faq}.md` с подсказками-
   комментариями (HTML-комментарий `<!-- -->` в теле `.md` допустим) и `draft: true`.
2. `apps/website/scripts/new-entry.mjs` по образцу; при конфликте — сообщение со списком путей, код 1,
   ничего не создано.
3. Корневые скрипты `new:event`, `new:talk`, `new:speaker`, `new:partner`, `new:faq` →
   `node apps/website/scripts/new-entry.mjs <kind>`; убрать `new:report` и plop-цикл, удалить `plop-templates/content/`.
4. Раздел команд в `packages/content/README.md` актуализировать.

## Done when
- [ ] `pnpm --filter website test` → pass: конфликт → код 1 и ничего не создано; неверное имя → код 1 (AC-8)
- [ ] `pnpm new:event 99` → создаёт `packages/content/src/events/ru/99.md` и `en/99.md`; повторный запуск → exit 1, `git status --short packages/content/src/events` не изменился; созданные файлы удалены после проверки (AC-8)
- [ ] `grep -nE "speaker|report" plopfile.mjs` → пусто и `test ! -e plop-templates/content` (AC-8)
- [ ] `grep -n "new:event" packages/content/README.md` → находит (AC-9)
- [ ] `pnpm lint && pnpm build` → exit 0

## Must not
- перезаписывать существующие файлы контента; создавать опубликованные (не draft) заготовки
- трогать генератор `component`; коммитить (коммит делает conductor); трогать файлы вне `owns`

## Report
`plans/001-blog-like-architecture/tasks/reports/13-report.md`. Вернуть conductor-у ТОЛЬКО: статус + строка +
файлы + `contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
