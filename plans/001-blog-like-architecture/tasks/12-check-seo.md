---
id: "12"
title: check-seo-gate
spec: "001"
criteria: ["AC-16", "AC-17"]
status: pending
depends_on: ["11"]
owns: ["apps/website/scripts/check-seo.mjs", "apps/website/scripts/seo-checks.mjs", "apps/website/scripts/seo-checks.test.mjs", "apps/website/scripts/fixtures/**", "apps/website/package.json", "pnpm-lock.yaml"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Скрипт `check:seo` проверяет собранный `dist` и роняет сборку, если у индексируемой страницы нет любого
из обязательных мета-тегов или карточка отсутствует или неверного размера.

## Context (grounded)
- Образец: `/home/r/common/0work/blog/apps/blog/scripts/check-seo.mjs:1-18` (CLI, копит ошибки, exit 1),
  `scripts/seo-checks.mjs`: обход и разбор HTML `:93-125`, `checkHead` `:160-175`, `pngSize` по IHDR
  `:315-358`, взаимность hreflang `:493-530`, `checkDist` `:1178-1207`; тесты `seo-checks.test.mjs`.
  Переносить ТОЛЬКО нужное нам (JSON-LD, robots, markdown, MCP, агентские проверки — не переносить).
- Список обязательных тегов (AC-16): `description`, `canonical`, `og:title`, `og:description`, `og:type`,
  `og:url`, `og:locale`, `og:site_name`, `og:image`, `og:image:type`, `og:image:width`, `og:image:height`,
  `og:image:alt`, `twitter:card` (= `summary_large_image`), `twitter:title`, `twitter:description`,
  `twitter:image`, `twitter:image:alt`. Индексируемая = без `<meta name="robots" content="noindex…">`.
- Сайт: `https://css.moscow` (`apps/website/astro.config.mjs`).

## Steps
1. `pnpm --filter website add -D parse5`.
2. `scripts/seo-checks.mjs` (`checkDist(dist, siteUrl)` → `{ errors, htmlCount, indexableCount }`):
   теги AC-16; абсолютные `og:url`/`og:image`/`twitter:image` на `siteUrl`; файл картинки есть в `dist`,
   PNG `og:image` 1200×630, `twitter:image` 1200×600, `og:image:width/height` совпадают с файлом;
   hreflang взаимны. `scripts/check-seo.mjs` — CLI, скрипт `"check:seo": "node scripts/check-seo.mjs"`.
3. `scripts/seo-checks.test.mjs` на фикстурах (`scripts/fixtures/`): отсутствует `twitter:image`; PNG
   неверного размера; noindex-страница не проверяется; валидная страница проходит.

## Done when
- [ ] `pnpm --filter website test` → pass, тесты ловят пропущенный `twitter:image` (AC-16) и PNG неверного размера (AC-17)
- [ ] `pnpm build && pnpm --filter website check:seo` → exit 0, строка `OK` с числом индексируемых страниц ≥ 8 (AC-16, AC-17)
- [ ] временное удаление любого `dist/og/**/*.png` → `check:seo` exit 1 с путём страницы; файл восстановлен пересборкой
- [ ] `pnpm lint` → exit 0

## Must not
- ослаблять список обязательных тегов или пропускать страницы без причины noindex
- коммитить (коммит делает conductor); трогать файлы вне `owns`

## Report
`plans/001-blog-like-architecture/tasks/reports/12-report.md`. Вернуть conductor-у ТОЛЬКО: статус + строка +
файлы + `contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
