---
id: "11"
title: pagefind-search
spec: "001"
criteria: ["AC-15"]
status: pending
depends_on: ["10"]
owns: ["apps/website/src/search/**", "apps/website/src/pages/[...locale]/search.astro", "apps/website/src/components/**", "apps/website/src/i18n/ui.ts", "apps/website/src/layouts/BaseLayout.astro", "apps/website/package.json", "pnpm-lock.yaml", "packages/ui/src/components/**", "packages/ui/src/index.ts", "apps/storybook/stories/**"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Поиск Pagefind по страницам митапов, докладов и спикеров: `/search/` и `/en/search/` находят страницы
только своего языка; страница поиска закрыта от индексации.

## Context (grounded)
- Образец: `/home/r/common/0work/blog/apps/blog/package.json` (`"build": "astro build && pagefind --site dist"`),
  `apps/blog/src/search/pagefind.ts:1-40` (обёртка JS API, модуль передаётся аргументом — тестируемо),
  `apps/blog/src/pages/[...locale]/search.astro` (страница с `noindex`, сама не индексируется — нет
  `data-pagefind-body`).
- Индексируемые страницы уже размечены `<main data-pagefind-body>` (задача 09). Pagefind делит индекс по
  `<html lang>` (его ставит `BaseLayout`).
- Новые компоненты (поле поиска, выдача) — `pnpm new:component`, на токенах, со стори и JSDoc.
- `BaseLayout` пропы `noindex` (задача 07) — `<meta name="robots" content="noindex, follow">`, без canonical.

## Steps
1. `pnpm --filter website add -D pagefind`; `build` = `astro build && pagefind --site dist`.
2. `src/search/pagefind.ts` + тест на фейковом модуле (пустой запрос, лимит, маппинг результатов).
3. `pages/[...locale]/search.astro` — форма GET `?q=`, клиентский скрипт грузит `/pagefind/pagefind.js`
   (в dev индекса нет — показывать сообщение из словаря, не падать), выдача — ссылки с заголовком и
   описанием. `noindex`.
4. Ссылка на поиск — в навигацию (словарь, обе локали).

## Done when
- [ ] `pnpm build` → существует `apps/website/dist/pagefind/pagefind.js`, вывод pagefind упоминает языки `ru` и `en` (AC-15)
- [ ] `grep -c 'noindex' apps/website/dist/search/index.html` ≥ 1 и `grep -c 'data-pagefind-body' apps/website/dist/search/index.html` = 0 (AC-15)
- [ ] проверка в браузере (`playwright-core` с `/usr/bin/chromium` по превью): `/search/?q=<фамилия спикера>` выдаёт ссылку на `/speakers/<имя>/`; `/en/search/?q=<имя латиницей>` выдаёт только ссылки с `/en/` (AC-15) — команда и вывод в отчёте
- [ ] `pnpm lint && pnpm test && pnpm build && pnpm build:storybook` → exit 0

## Must not
- подключать готовый `pagefind-ui` со своими стилями-литералами
- индексировать главную/поиск; коммитить (коммит делает conductor); трогать файлы вне `owns`

## Report
`plans/001-blog-like-architecture/tasks/reports/11-report.md`. Вернуть conductor-у ТОЛЬКО: статус + строка +
файлы + `contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
