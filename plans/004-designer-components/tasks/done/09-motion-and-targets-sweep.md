---
id: "09"
title: motion-and-targets-sweep
spec: "004"
criteria: ["AC-2", "AC-3"]
status: done
depends_on: ["03", "04", "05", "06", "07", "08"]
owns: ["packages/ui/src/components/LinkList/**", "packages/ui/src/components/SearchField/**", "packages/ui/src/components/SearchResults/**", "packages/ui/src/components/JoinBlock/**", "packages/ui/src/components/MediaTile/**", "packages/ui/src/components/MapPlaceholder/**", "packages/ui/src/components/SpeakerAvatar/**", "apps/website/src/sections/AboutSection.css.ts", "apps/website/src/sections/JoinSection.css.ts", "apps/website/src/sections/PartnerSection.css.ts", "apps/website/src/sections/PastEventsSection.css.ts", "apps/website/src/sections/ProgramSection.css.ts", "tools/visual/check-targets.mjs"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Во всех стилях нет литералов переходов, а мелкие активные элементы на сайте дают зону захвата от 42×42 и контур фокуса нужного цвета.

## Context (grounded — executor needs NO extra search)
- Токены: `vars.motion.duration.*`, `vars.motion.easing.*`, `vars.size.hitTarget`, `vars.color.focus`, `vars.border.width.thin`.
- Поиск литералов: `grep -rnE "[0-9]+m?s\b|ease|cubic-bezier" packages/ui/src apps/website/src/sections --include=*.css.ts`.
- `tools/visual/capture.mjs` — образец запуска `playwright-core` с системным Chromium; скрипт пишется рядом и читается человеком, `pnpm lint` его не покрывает.
- Текстовые ссылки внутри абзаца (`Prose`, тело карточек) в проверку не входят: это не отдельные элементы управления.

## Steps
1. Заменить все найденные литералы на токены.
2. Добавить `min-height`/`min-width` `hitTarget` и контур фокуса отдельным элементам управления (иконки, кнопки поиска, ссылки-плашки). В строке текста увеличивать зону за счёт полей с компенсирующим отрицательным отступом, чтобы вёрстка не поехала.
3. `tools/visual/check-targets.mjs`: на 375 и 1440 открыть `http://localhost:4321/`, открыть меню на узкой ширине, обойти `[data-navbar] a, [data-navbar] button, [data-card-slider] button, a[hreflang]`; у видимых проверить `getBoundingClientRect` не меньше 42×42; у каждого фокус с клавиатуры и `outline-color` `rgb(202, 48, 53)` с толщиной от 1px. Вывести нарушения и выйти с кодом 1.

## Done when (verification handle — the CONDUCTOR checks these, not the worker)
- [ ] `grep -rnE "[0-9]+m?s\b|\bease\b|cubic-bezier" packages/ui/src apps/website/src/sections --include=*.css.ts` пуст (AC-2)
- [ ] `pnpm build`, `pnpm --filter website preview` в фоне, `node tools/visual/check-targets.mjs` → код 0 (AC-3)
- [ ] `pnpm lint` и `pnpm test` зелёные

## Must not
- менять компоненты задач 03–08: нарушения в них вернуть как NEEDS_CONTEXT
- ослаблять проверку, исключать элементы, чтобы скрипт прошёл
- переверстывать секции без макета

## Report
Write the full result to `plans/004-designer-components/tasks/reports/09-report.md`. Return to the conductor ONLY:
status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT) + one-line summary + files touched (must be
within `owns`) + `contract: <digest>` copied from the contract file's frontmatter.
