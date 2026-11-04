---
id: "01"
title: dark-tokens
spec: "005"
criteria: ["AC-1", "AC-10"]
status: done
depends_on: []
owns: ["packages/design-system/src/**"]
model: opus
risk: contract
attempts: 0
---

## Goal
Токены тёмной темы заданы по таблице спеки, синий фокус и выделение есть в обеих темах, контраст проверен тестом.

## Context
- `packages/design-system/src/palette.ts`, `colors.ts`: примитивы и семантические токены.
- `packages/design-system/src/themes/colors.css.ts`: применение тем.

## Steps
1. Добавить графитовые примитивы и значения `dark` в `colors.ts`, токен кольца на обратном фоне.
2. Добавить тест контраста по значениям токенов.

## Done when
- [ ] `pnpm --filter @moscowcss/design-system test` проходит, тест контраста падает при занижении порога.
- [ ] `grep -n "palette.black" packages/design-system/src/colors.ts` не находит тёмных фонов в `dark`.
- [ ] Закрыты AC-1, AC-10: проверено тестами, гейтом и просмотром в браузере.

## Must not
- менять светлую палитру, кроме цвета фокуса;
- снижать пороги контраста, чтобы тест прошёл.
