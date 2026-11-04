---
id: "03"
title: button
spec: "004"
criteria: ["AC-4"]
status: done
depends_on: ["01"]
owns: ["packages/ui/src/components/Button/**", "apps/storybook/stories/Button.stories.ts"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
`Button` по макету: кнопка или ссылка, обычный размер и размер шапки, плавный переход в синий при наведении.

## Context (grounded — executor needs NO extra search)
- `packages/ui/src/components/Button/Button.astro`, `Button.css.ts` — текущая кнопка, на сайте не используется.
- `packages/ui/src/components/CallToAction/CallToAction.astro:6-28` — образец двух форм: `LinkProps | ButtonProps`, рендер `a` или `button`.
- Макет обычного размера: обводка 1px `vars.color.border`, радиус `vars.radius.large`, шрифт `vars.font.shorthand.buttonLabel`, поля `vars.adaptive.buttonPaddingBlock/Inline`, `opacity: 0.8`; при наведении `opacity: 1`, фон `vars.color.buttonHover`, текст `vars.color.onButtonHover`, обводка того же цвета.
- Размер шапки `size="nav"`: шрифт `vars.font.shorthand.navMono`, поля `vars.adaptive.navButtonPaddingBlock/Inline`, радиус `vars.adaptive.navButtonRadius`, без `opacity`.

## Steps
1. Пропы: `href?`, `size?: 'default' | 'nav'` с русским JSDoc; остальные атрибуты уходят на корень.
2. Стили: `width: 100%`, текст по центру, `box-sizing: border-box`, минимальная высота `vars.size.hitTarget`, `transition` по `background-color, color, border-color, opacity` с `vars.motion.duration.base` и `vars.motion.easing.standard`; `:focus-visible` — контур `vars.border.width.thin` цвета `vars.color.focus` со смещением `vars.spacing.xs`.
3. Истории: `Default`, `Link`, `Nav`, узкий и широкий родитель.

## Done when (verification handle — the CONDUCTOR checks these, not the worker)
- [ ] `grep -n "buttonHover" packages/ui/src/components/Button/Button.css.ts` и `grep -n "motion.duration" packages/ui/src/components/Button/Button.css.ts` находят строки (AC-4)
- [ ] `grep -nE "href|<a " packages/ui/src/components/Button/Button.astro` находит ветку ссылки (AC-4)
- [ ] `grep -cE "export const" apps/storybook/stories/Button.stories.ts` ≥ 3 (AC-4)
- [ ] `grep -nE "[0-9]px|#[0-9a-fA-F]{3,}" packages/ui/src/components/Button/Button.css.ts` пуст
- [ ] `pnpm lint` зелёный

## Must not
- добавлять `margin` или фиксированную ширину на корень
- задавать размеры литералами вместо токенов
- править `packages/design-system`: если токена не хватает, вернуть NEEDS_CONTEXT

## Report
Write the full result to `plans/004-designer-components/tasks/reports/03-report.md`. Return to the conductor ONLY:
status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT) + one-line summary + files touched (must be
within `owns`) + `contract: <digest>` copied from the contract file's frontmatter.
