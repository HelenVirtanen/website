---
id: "16"
title: final-verification
spec: "001"
criteria: ["AC-1", "AC-10", "AC-16", "AC-19", "AC-20", "AC-21", "AC-22"]
status: pending
depends_on: ["15"]
owns: ["plans/001-blog-like-architecture/tasks/reports/16-report.md"]
model: sonnet
risk: none
attempts: 0
---

## Goal
Независимый полный прогон всех проверок спеки на чистой установке и итоговое сравнение снимков; отчёт
с фактами по каждому проверяемому критерию.

## Context (grounded)
- Спека: `specs/001-blog-like-architecture.md` (критерии AC-1…AC-23, AC-14 снят).
- Тулинг снимков: `tools/visual/README.md`; эталон `.visual/baseline`; для паритета главной сборка с
  `BUILD_NOW=2026-07-01`.
- Браузер: `/usr/bin/chromium` через `playwright-core` (стоит в корне).

## Steps
1. `pnpm install --frozen-lockfile && pnpm lint && pnpm test && pnpm build && pnpm --filter website check:seo && pnpm build:storybook`.
2. `BUILD_NOW=2026-07-01 pnpm build`, превью + Storybook, `capture` в `.visual/final`, `compare` с базой.
3. Скриптом на `playwright-core`: `getComputedStyle(document.documentElement).fontSize` на ширинах 1920 и
   3840 по превью.
4. Повторить проверки-grep из задач 02, 04, 08 (литералы, data, корень).

## Done when
- [ ] шаг 1 → каждая команда exit 0 (AC-22)
- [ ] `node tools/visual/compare.mjs .visual/baseline .visual/final` → exit 0, все доли ≤ 0.1% (AC-21)
- [ ] font-size `html` = `16px` при 1920 и `32px` при 3840 (AC-20)
- [ ] `git ls-files src public scripts astro.config.mjs tsconfig.json gitignore npmrc apps/website/src/data` → пусто (AC-1)
- [ ] `grep -rnE "[0-9]px" --include='*.css.ts' packages/ui/src apps/website/src | grep -v '//'` → пусто (AC-19)
- [ ] `check:seo` (шаг 1) печатает OK — мета-теги на всех индексируемых страницах (AC-16); в `dist/index.html` и `dist/en/index.html` по три `hreflang` (AC-10)

## Must not
- править код, чтобы проверка прошла: найденное — в отчёт как провал с выводом команды
- поднимать порог сравнения; коммитить; трогать что-либо кроме отчёта

## Report
`plans/001-blog-like-architecture/tasks/reports/16-report.md` (вывод каждой команды кратко, таблица AC →
факт). Вернуть conductor-у ТОЛЬКО: статус + строка + `contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
