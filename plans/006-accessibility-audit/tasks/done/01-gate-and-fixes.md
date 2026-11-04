---
id: "01"
title: gate-and-fixes
spec: "006"
criteria: ["AC-1", "AC-2", "AC-3", "AC-4", "AC-5", "AC-6", "AC-7"]
status: done
depends_on: []
owns: ["tools/visual/check-a11y.mjs", "packages/design-system/src/**", "packages/ui/src/components/**", "apps/website/src/**", ".github/workflows/deploy.yml"]
model: opus
risk: contract
attempts: 0
---

## Goal
Серого текста нет, `pnpm check:a11y` проходит в обеих темах и запускается в CI, однозначные ошибки исправлены.

## Context
- `tools/visual/browser.mjs`: запуск браузера, как у `check-targets.mjs`.
- `packages/design-system/src/colors.ts`: токены цвета и контраст в `colors.test.ts`.

## Steps
1. Заменить серые подписи обычным цветом текста.
2. Написать `tools/visual/check-a11y.mjs` и команду `check:a11y`.
3. Исправить найденное и подключить проверку в CI.

## Done when
- [ ] `pnpm check:a11y` завершается кодом 0: закрыты AC-2, AC-3, AC-4, AC-5, AC-6.
- [ ] `git grep "textMuted"` ничего не находит: закрыт AC-1.
- [ ] `grep check:a11y .github/workflows/deploy.yml` находит шаг: закрыт AC-7.

## Must not
- снимать нарушение исключением в конфиге проверки без причины в комментарии;
- ослаблять проверки ради зелёного прогона.
