---
id: "04"
title: floating-cta
spec: "004"
criteria: ["AC-5"]
status: pending
depends_on: ["01"]
owns: ["packages/ui/src/components/CallToAction/**", "apps/storybook/stories/CallToAction.stories.ts"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
`CallToAction` становится плавающим восьмиугольником, контрастным фону страницы, синим при наведении и фокусе.

## Context (grounded — executor needs NO extra search)
- `packages/ui/src/components/CallToAction/CallToAction.css.ts:7` — старая форма и слоистый контур фокуса: корень, два псевдоэлемента, грань.
- `apps/website/src/sections/HeroSection.astro:71` — текущий потребитель; его перепишет задача 07, пока кнопка остаётся рабочей по той же разметке (`href` и слот).
- Размеры: `vars.adaptive.ctaSize`, отступы от угла `vars.adaptive.ctaOffsetInline/Block`, шрифт `vars.font.shorthand.ctaFloating`, белый текст по центру.
- Форма: `dimensions.octagonRoundedMask` из `@moscowcss/design-system`.
- `position: fixed` создаёт контекст наложения, поэтому `mix-blend-mode` работает только на самом закреплённом элементе.

## Steps
1. Корень: `position: fixed`, `right`/`bottom` из токенов, `zIndex: vars.zIndex.floatingCta`, `width`/`height` `vars.adaptive.ctaSize`, `mix-blend-mode: difference`, `isolation` не задавать.
2. Грань (вложенный `span`): `mask-image: dimensions.octagonRoundedMask`, `mask-size: 100% 100%`, фон `vars.color.white`, текст `vars.color.blackText`, центрирование, перенос после двоеточия по обычному пробелу, переход цвета через `vars.motion.*`.
3. На `:hover` и `:focus-visible` корень `mix-blend-mode: normal`, грань фон `vars.color.buttonHover`, текст `vars.color.onButtonHover`.
4. Контур фокуса: псевдоэлемент корня той же маской, цвет `vars.color.focus`, больше грани на `vars.spacing.xs`, виден только на `:focus-visible`.
5. Истории: на белом и на чёрном родителе, со ссылкой, подпись `position: в зале` и `aria-label`; историю оборачивать так, чтобы `fixed` не уезжал за кадр документации.

## Done when (verification handle — the CONDUCTOR checks these, not the worker)
- [ ] `grep -n "mix-blend-mode\|mixBlendMode" packages/ui/src/components/CallToAction/CallToAction.css.ts` находит `difference` и `normal` (AC-5)
- [ ] `grep -n "ctaSize" packages/ui/src/components/CallToAction/CallToAction.css.ts` и `grep -n "position.fixed\|'fixed'" packages/ui/src/components/CallToAction/CallToAction.css.ts` находят строки (AC-5)
- [ ] `grep -nE "[0-9]ms|ease|[0-9]px" packages/ui/src/components/CallToAction/CallToAction.css.ts` пуст
- [ ] `pnpm lint` зелёный

## Must not
- рисовать форму отдельной SVG-картинкой: макет прямо разрешает CSS
- перекрывать шапку и открытое меню: только токен `floatingCta`
- зашивать текст кнопки в компонент

## Report
Write the full result to `plans/004-designer-components/tasks/reports/04-report.md`. Return to the conductor ONLY:
status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT) + one-line summary + files touched (must be
within `owns`) + `contract: <digest>` copied from the contract file's frontmatter.
