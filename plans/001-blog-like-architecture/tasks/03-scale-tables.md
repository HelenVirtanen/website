---
id: "03"
title: design-system-scale-tables-rem-root-growth
spec: "001"
criteria: ["AC-18", "AC-20"]
status: pending
depends_on: ["02"]
owns: ["packages/design-system/**", "turbo.json", "package.json", "pnpm-lock.yaml"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Дизайн-система описывает шкалу таблицами «база + ступени по брейкпоинтам» (как в блоге), значения в rem,
корневой кегль растёт выше 1920px, а растущие отступы вынесены в layout-лестницы с теми же значениями.

## Context (grounded)
- Образец: `/home/r/common/0work/blog/packages/design-system/src/scale.ts:1-140` (`widthSteps`, `Steps`,
  `remToPx`, `thresholdPx`, `resolveAt`, `baseValues`, `mediaOverrides`), `themes/layout.css.ts:1-9`,
  `themes/typography.css.ts` (генерация из `typeScale`), `reset.css.ts:46` (`fontSize: 'max(100%, 100vw / 120)'`),
  тест — `scale.test.ts`, `vitest.config.ts`.
- Текущее здесь: `packages/design-system/src/spacing.ts:5-14` (scale xs..4xl в px), `:45-48` (radius px),
  `:49-61` (size в rem); `themes/spacing.css.ts:17-33` — растущие m/l/xxl (desktop: m 16, l 24, xxl 32;
  desktopLarge: xxl 40) для `padding` и `spacing`; `typography.ts:110-137` — база кеглей;
  `themes/typography.css.ts:10-40` — переопределения кеглей на tablet/laptop/desktop;
  `border.ts:20-23` — ширины в px; `contract.ts:12-23` — сборка `vars` (`createGlobalThemeContract`,
  имя = путь через `-`); `colors.ts:34-66` — `colors = { contract, light, dark }`; `index.ts:1-6`.
- `breakpoints.ts` совпадает с блогом (без `print`).
- Решение плана 1 (`plans/001-blog-like-architecture/plan.md`, «Решения плана»): `vars.layout.inset.{m,l,xxl}` ←
  бывшие растущие `padding.*`, `vars.layout.gap.{m,l,xxl}` ← бывшие растущие `spacing.*`;
  `vars.padding.*`/`vars.spacing.*` становятся постоянными (база).
- ADR: `adr/002-adaptive-scale-and-root-size.md`.
- Внимание: в контракте уже есть группа `layout` (display/position/…, `layout.ts`) — новые лестницы
  кладутся в неё как `layout.inset` и `layout.gap` (или переименуйте существующие ключи, если конфликт;
  CSS-имена будут `--layout-inset-l`, `--layout-gap-xxl`).

## Steps
1. `pnpm --filter @moscowcss/design-system add -D vitest`; скрипт `"test": "vitest run"`; `vitest.config.ts`
   по образцу блога; задача `"test": {}` в `turbo.json`; корневой скрипт `"test": "turbo run test"`.
2. `src/scale.ts`: функции блога + таблицы с НЫНЕШНИМИ значениями: `typeScale` (все ключи `font.size`:
   база из `typography.ts`, ступени из `themes/typography.css.ts`), `space` (xs 0.25rem, s 0.5rem, m 0.75rem,
   l 1rem, xl 1.25rem, xxl 1.5rem, xxxl 2rem, 4xl 5rem), `layoutSpace` (`inset.m` и `gap.m`:
   base 0.75rem, desktop 1rem; `.l`: base 1rem, desktop 1.5rem; `.xxl`: base 1.5rem, desktop 2rem,
   desktopLarge 2.5rem).
3. `spacing.ts` берёт значения из `space` (rem), radius → rem (`4px`→`0.25rem`, `8px`→`0.5rem`);
   `border.ts` → rem (`0.0625rem`, `0.125rem`, `0.25rem`, `0.5rem`).
4. `themes/spacing.css.ts` без медиазапросов; `themes/typography.css.ts` = `createGlobalTheme` базы +
   `globalStyle(':root', { '@media': mediaOverrides(vars.font.size, typeScale) })`; лестницы layout — в
   `themes/layout.css.ts` тем же способом.
5. Корневой кегль: `globalStyle('html', { fontSize: 'max(100%, 100vw / 120)' })` в новом
   `src/themes/root.css.ts` (импорт из `themes/index.css.ts`), с русским комментарием-причиной (ADR-002).
6. `src/theme-colors.ts` — экспорт `themeColors = colors.light.color` (чистый TS, без `.css`-импортов);
   `package.json` exports `"./theme-colors"` и `"./scale"`.
7. `src/scale.test.ts`: резолвер на порогах (1023/1024, 1279/1280, 1919/1920), `mediaOverrides` выводит
   только ступени с переопределениями, `remToPx` бросает на не-rem.

## Done when
- [ ] `pnpm --filter @moscowcss/design-system test` → pass: `resolveAt(layoutSpace.inset.l, 1280)` = `1.5rem`, `resolveAt(layoutSpace.gap.xxl, 1920)` = `2.5rem`, `resolveAt(typeScale.h1, 1280)` = `3.25rem` — шкала описана таблицами и генерируется (AC-18)
- [ ] `grep -rn "100vw / 120" packages/design-system/src` → строка с `fontSize` на `html` — корень растёт выше 1920 (AC-20)
- [ ] `grep -rnE "[0-9]px'" packages/design-system/src` → только строки-комментарии (`// …px`)
- [ ] `grep -n "'@media'" packages/design-system/src/themes/spacing.css.ts` → пусто
- [ ] `pnpm lint && pnpm build && pnpm test` → exit 0

## Must not
- менять сами значения (только единицы px→rem и место хранения); вводить новые ступени или значения
- трогать компоненты `packages/ui` и секции `apps/website` (это следующая задача; временный визуальный
  сдвиг на desktop здесь ожидаем)
- вписывать версии руками; коммитить (коммит делает conductor); трогать файлы вне `owns`

## Report
Полный результат — `plans/001-blog-like-architecture/tasks/reports/03-report.md`. Вернуть conductor-у ТОЛЬКО:
статус + одна строка + изменённые файлы + `contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
