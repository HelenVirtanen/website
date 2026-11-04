---
id: "02"
title: local-fonts
spec: "004"
criteria: ["AC-16"]
status: done
depends_on: []
owns: ["packages/fonts/**"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Jost 400, Golos Text 400 и JetBrains Mono 300 лежат в `@moscowcss/fonts` с кириллицей и лицензиями и подключаются через `@font-face`.

## Context (grounded — executor needs NO extra search)
- `packages/fonts/index.css:1-16` — формат `@font-face` с `local()` и `font-display: swap`.
- `packages/fonts/index.css:83` — блок JetBrains Mono, сюда начертание 300; файлы в `packages/fonts/jetbrains/`.
- `packages/fonts/README.md` — здесь записывается источник каждого набора.
- Семейства должны называться ровно `"Jost"` и `"Golos Text"`: так их называют токены (задача 01).

## Steps
1. Во временной папке вне репозитория выполнить `pnpm add @fontsource/jost @fontsource/golos-text @fontsource/jetbrains-mono` и взять файлы `*-cyrillic-*-normal.woff2` и `*-latin-*-normal.woff2` нужных весов плюс `LICENSE`.
2. Разложить в `packages/fonts/jost/`, `packages/fonts/golos/`, `packages/fonts/jetbrains/`; лицензии рядом.
3. Добавить `@font-face` с `unicode-range` на каждый набор (диапазоны взять из css этих же пакетов), `font-display: swap`.
4. Дописать в README источник и лицензию.

## Done when (verification handle — the CONDUCTOR checks these, not the worker)
- [ ] `grep -c "font-family: \"Jost\"\|font-family: \"Golos Text\"" packages/fonts/index.css` ≥ 4 и `grep -n "font-weight: 300" packages/fonts/index.css` находит JetBrains Mono (AC-16)
- [ ] `ls packages/fonts/jost packages/fonts/golos` показывает woff2 с кириллицей и `LICENSE` (AC-16)
- [ ] `git diff --stat -- package.json pnpm-lock.yaml packages/fonts/package.json` пуст: файлы лежат в пакете, зависимостей не прибавилось
- [ ] `pnpm build` зелёный

## Must not
- запускать `npm` или `yarn`
- править объявления уже подключённых начертаний
- подключать Google Fonts ссылкой или качать другие начертания
- писать вне `packages/fonts`

## Report
Write the full result to `plans/004-designer-components/tasks/reports/02-report.md`. Return to the conductor ONLY:
status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT) + one-line summary + files touched (must be
within `owns`) + `contract: <digest>` copied from the contract file's frontmatter.
