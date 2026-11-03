---
id: "04"
title: migrate-component-styles-to-scale-tokens
spec: "001"
criteria: ["AC-19", "AC-21"]
status: done
depends_on: ["03"]
owns: ["packages/ui/src/components/**/*.css.ts", "apps/website/src/sections/*.css.ts", "packages/design-system/src/spacing.ts"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Компоненты и секции берут растущие отступы из layout-лестниц, внутри `@media` нет литеральных размеров,
и визуал на 375–1920 совпадает с эталоном.

## Context (grounded)
- После задачи 03: `vars.padding.*`/`vars.spacing.*` постоянны; растущие значения — `vars.layout.inset.{m,l,xxl}`
  и `vars.layout.gap.{m,l,xxl}` (проверить точные имена в `packages/design-system/src/contract.ts` и
  `scale.ts`).
- 49 употреблений растущих ступеней (живой список — `grep -rnE "vars\.(padding|spacing)\.(m|l|xxl)\b" packages/ui/src apps/website/src`):
  `FAQSection.css.ts` 2, `HeroSection.css.ts` 7, `PartnerSection.css.ts` 5, `ProgramSection.css.ts` 10,
  `sectionLayout.css.ts` 3, `BlockTitle.css.ts` 1, `Button.css.ts` 2, `CallToAction.css.ts` 1,
  `Card.css.ts` 3, `CardSlider.css.ts` 2, `FeatureCard.css.ts` 3, `NavBar.css.ts` 9 (включая
  `calc(${vars.size.tgLinkButtonCompact} + ${vars.spacing.l})` на `NavBar.css.ts:138`).
- Литеральные размеры внутри `@media`: `packages/ui/src/components/SpeakerAvatar/SpeakerAvatar.css.ts:17-18`
  (`'12.5rem'`), `apps/website/src/sections/ProgramSection.css.ts:68` (`'12.5rem minmax(16rem, 26rem) minmax(24rem, 1fr)'`)
  и `:134` (`'12.5rem 1fr'`).
- Размерные токены живут в `packages/design-system/src/spacing.ts:22-61` (`size.*`, контракт + значения в rem).
- Эталон снимков: `.visual/baseline` (задача 01); тулинг: `tools/visual/{capture,compare}.mjs`, README там же.

## Steps
1. Заменить каждое `vars.padding.X` → `vars.layout.inset.X`, `vars.spacing.X` → `vars.layout.gap.X` для
   X ∈ {m, l, xxl} во всех файлах списка (включая внутри `@media`).
2. Добавить в `spacing.ts` size-токены `speakerAvatarLaptop: '12.5rem'`, `programTimeColumn: '12.5rem'`,
   `programTitleColumnMin: '16rem'`, `programTitleColumnMax: '26rem'`, `programDescriptionColumnMin: '24rem'`
   (контракт + значения) и собрать из них `gridTemplateColumns` шаблонной строкой; `SpeakerAvatar` — на токен.
3. `pnpm build`, поднять превью и Storybook, снять `.visual/t04`, сравнить с базой; расхождения чинить до 0.

## Done when
- [ ] `grep -rnE "vars\.(padding|spacing)\.(m|l|xxl)\b" packages/ui/src apps/website/src` → 0 строк (AC-19)
- [ ] `grep -rnE "[0-9]px" --include='*.css.ts' packages/ui/src apps/website/src | grep -v '//'` → 0 строк (AC-19)
- [ ] `grep -rnE "'[0-9.]+rem" --include='*.css.ts' packages/ui/src/components/SpeakerAvatar apps/website/src/sections/ProgramSection.css.ts` → 0 строк — внутри `@media` размеры только токенами (AC-19)
- [ ] `node tools/visual/compare.mjs .visual/baseline .visual/t04` → exit 0, каждая доля ≤ 0.1% — визуал сохранён (AC-21)
- [ ] `pnpm lint && pnpm build && pnpm build:storybook` → exit 0

## Must not
- менять значения токенов или подгонять значения ради прохождения сравнения (расхождение = ошибка замены)
- поднимать порог `compare.mjs` или исключать снимки из сравнения
- трогать `.astro`-разметку, файлы вне `owns`; коммитить (коммит делает conductor)

## Report
Полный результат — `plans/001-blog-like-architecture/tasks/reports/04-report.md` (таблица долей). Вернуть
conductor-у ТОЛЬКО: статус + одна строка + изменённые файлы + `contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
