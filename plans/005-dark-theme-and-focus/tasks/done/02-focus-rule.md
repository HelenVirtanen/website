---
id: "02"
title: focus-rule
spec: "005"
criteria: ["AC-8", "AC-9", "AC-10"]
status: done
depends_on: ["01"]
owns: ["packages/design-system/src/themes/**", "packages/ui/src/components/**/*.css.ts", "apps/website/src/**/*.css.ts", "tools/visual/**"]
model: opus
risk: contract
attempts: 0
---

## Goal
Кольцо `:focus-visible` и `::selection` заданы одним правилом в дизайн-системе, своих правил у компонентов нет.

## Context
- Правила фокуса: `git grep -n "focus-visible" -- packages/ui apps/website`.
- `tools/visual/check-targets.mjs:16`: ожидаемый цвет кольца.

## Steps
1. Завести `themes/focus.css.ts` и подключить в `themes/index.css.ts`.
2. Удалить правила `outline` из компонентов и секций.
3. На блоках с обратным фоном подменить токен фокуса, обновить гейт.

## Done when
- [ ] `git grep -n "outline:" -- 'packages/ui/src/**/*.css.ts' 'apps/website/src/**/*.css.ts'` находит только плавающую кнопку.
- [ ] `node tools/visual/check-targets.mjs` проходит на собранном сайте.
- [ ] Закрыты AC-8, AC-9, AC-10: проверено тестами, гейтом и просмотром в браузере.

## Must not
- ослаблять проверки гейта;
- убирать видимый фокус у какого-либо элемента.
