---
id: "07"
title: hero-and-tag-pile
spec: "004"
criteria: ["AC-5", "AC-9", "AC-10"]
status: pending
depends_on: ["01", "02", "04", "06"]
owns: ["packages/ui/src/components/TagPile/**", "packages/ui/package.json", "packages/ui/src/index.ts", "apps/storybook/stories/TagPile.stories.ts", "apps/website/src/sections/HeroSection.astro", "apps/website/src/sections/HeroSection.css.ts", "apps/website/src/pages/[...locale]/index.astro", "packages/content/src/schema.ts", "packages/content/src/events/ru/31.md", "packages/content/src/events/en/31.md", "packages/content/README.md"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Hero по макету с падающими плашками, а плавающая кнопка появляется на главной только у будущего митапа со ссылкой на регистрацию.

## Context (grounded — executor needs NO extra search)
- `apps/website/src/sections/HeroSection.astro` — данные уже здесь: `eventWhen` (`../content/format`), `tagline`, `venue.address`, `modes`, `passportRequired`, `registrationUrl`, `streamUrl`, `recordingUrl`, ключи `hero.*`. Звезда `Logo` и `CallToAction` отсюда уходят; `id="registration"` и `data-visual="hero"` остаются.
- `apps/website/src/pages/[...locale]/index.astro:49-52` — сюда после `<main>`-содержимого `CallToAction` с условием `featured && !featured.past && featured.event.data.registrationUrl`, текст `t('hero.register')`, `aria-label={t('hero.registerLabel')}`.
- `packages/content/src/schema.ts:92` — `modes`; рядом `tags: z.array(z.string().min(1)).default([])`. `tags` переводимое поле, в `catalog.ts:74` его не добавлять.
- `packages/content/src/events/ru/31.md` — темы из макета: `popover api`, `state of css 2025`, `геймификация`, `anchor positioning`, `#вопрос_спикеру`, `css`; в `en` те же, `#вопрос_спикеру` → `#ask_the_speaker`, `геймификация` → `gamification`.
- Номер митапа: `event.id` без языка, показывать чип только если это число (`online-2021` без чипа), `fillTemplate(t('hero.meetupNumber'), { number })`.
- Раскладка, токены `vars.adaptive.hero*`: секция поля `heroPaddingTop/Bottom/Inline`, промежуток `heroGap`; группа `heroGroupGap`. Мобильный: зона плашек `heroTagsHeight`, ниже строка «чип + дата» (`space-between`, `align-items: end`), ниже заголовок, режимы. От `media.tablet`: чип и дата лежат внутри зоны плашек поверх неё, чип снизу слева, дата снизу справа, плашки `pointer-events: none`.
- Чип: рамка `thin dashed vars.color.border`, шрифт `heroChip`, `uppercase`, поля и радиус из токенов.
- Дата: колонка `align-items: end`, промежуток `heroDateGap`. Строка «Митап уже прошёл» (`t('hero.pastNote')`, только у прошедшего) шрифт `navMeta`, цвет `vars.color.pastNote`; дата `heroDate`, цвет `vars.color.link`; время `navMono`. Разделить вывод `eventWhen`: день и год отдельно от времени, новые ключи не вводить, если хватает `date.long`; иначе вернуть NEEDS_CONTEXT.
- Заголовок `h1`: шрифт `heroDisplay`, `uppercase`; на мобильном `width: min-content`, от `media.tablet` `width: auto; white-space: nowrap`.
- Режимы: `/ оффлайн` шрифт `heroMeta`, промежуток `heroMetaGap`.
- Эталон 1920 (узел 829:4886): поля 80, чип слева и дата справа на одной нижней линии с нижним рядом плашек, куча между ними, плашки высотой 82, сразу под ними заголовок на всю ширину 1760, ниже режимы и описание шириной 709.
- Низ: колонка `heroAboutGap`, `tagline` шрифт `heroLead`, адрес и паспорт `heroBody` с `opacity: 0.7`; ниже ссылка на запись (у прошедшего) или текст про онлайн и трансляцию (у будущего) шрифтом `heroBody`. Правый край на мобильном оставляет место под кнопку: `padding-inline-end` равен `vars.adaptive.ctaSize` плюс `vars.spacing.l`.
- `TagPile` — новый компонент (`pnpm new:component`). Пропы: `tags: string[]`, `label` для `aria-label`. Без JS и при `prefers-reduced-motion`: `display: flex; flex-wrap: wrap-reverse; justify-content: center; align-content: flex-start; gap: vars.spacing.s`. Цвета пяти пар `vars.color.tag*`/`onTag*` классами вариантов.
- У `packages/ui` нет тестов: добавить `vitest` командой `pnpm --filter @moscowcss/ui add -D vitest` и скрипт `"test": "vitest run"`.

## Steps
1. Чистый модуль `packages/ui/src/components/TagPile/pile.ts`: `shuffled(list, random)`, `colorsFor(count, random)` (соседние плашки не одного цвета), `layoutPile({ widths, tagHeight, zoneWidth, zoneHeight, random })` → для каждой плашки `{ x, y, rotation, order, delay }`. Раскладка: ряды снизу вверх, нижний ряд без наклона, верхние ±5–24°, самый верхний до ±68° для коротких плашек; ряд центрируется; ничего не выходит за зону, при нехватке места плашки ложатся внахлёст.
2. Тест `pile.test.ts`: одинаковый сид → одинаковый результат, разные сиды → разный порядок и цвета, все индексы встречаются один раз, границы соблюдены на 1, 9 и 30 плашках, узкая и широкая зона.
3. `TagPile.client.ts`: измерить плашки, разместить абсолютно внутри зоны фиксированной высоты, анимировать `element.animate` от `translateY(-zoneHeight)` с нулевой прозрачностью, длительность и кривая из экспорта `motion`, задержка случайная, вся куча падает за 3.5 секунды, как в референсе. При `prefers-reduced-motion` не анимировать и оставить ряды. На смену ступени разложить заново без анимации, сравнивая ширину зоны, чтобы не заводить петлю ресайза.
4. Переписать `HeroSection.astro` и стили по Context, подключить `CallToAction` на странице.
5. Истории: мало плашек, много плашек, длинные темы. README контента: поле `tags`.

## Done when (verification handle — the CONDUCTOR checks these, not the worker)
- [ ] `pnpm --filter @moscowcss/ui test` зелёный, в `pile.test.ts` есть случаи с разными сидами и с 1, 9, 30 плашками (AC-10)
- [ ] `grep -n "prefers-reduced-motion\|reducedMotion" packages/ui/src/components/TagPile/TagPile.client.ts` находит проверку; `grep -n "wrap-reverse\|wrapReverse" packages/ui/src/components/TagPile/TagPile.css.ts` находит запасную раскладку (AC-10)
- [ ] `pnpm build` зелёный; `grep -c "митап" apps/website/dist/index.html` ≥ 1, `grep -c "Logo\|heroCta" apps/website/src/sections/HeroSection.astro` = 0; `grep -n "heroDisplay" apps/website/src/sections/HeroSection.css.ts` находит шрифт (AC-9)
- [ ] `grep -n "min-content\|minContent" apps/website/src/sections/HeroSection.css.ts` находит правило двух строк; `grep -n "recordingUrl\|streamUrl" apps/website/src/sections/HeroSection.astro` находит обе ссылки (AC-9)
- [ ] Без `BUILD_NOW`: `grep -c "position: в" apps/website/dist/index.html` = 0. С `BUILD_NOW=2026-07-01 pnpm build` и ссылкой на регистрацию у 31-го: > 0, затем пересобрать без `BUILD_NOW` (AC-5)
- [ ] `pnpm lint`, `pnpm test`, `pnpm --filter website check:seo` зелёные

## Must not
- подключать физический движок или библиотеку анимации
- переносить абсолютные координаты плашек из макета
- убирать ссылки на запись и трансляцию
- менять `catalog.ts`, правила проверки контента и чужие митапы
- коммитить сборку с `BUILD_NOW`

## Report
Write the full result to `plans/004-designer-components/tasks/reports/07-report.md`. Return to the conductor ONLY:
status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT) + one-line summary + files touched (must be
within `owns`) + `contract: <digest>` copied from the contract file's frontmatter.
