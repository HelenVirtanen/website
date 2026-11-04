---
id: "05"
title: faq-block
spec: "004"
criteria: ["AC-6", "AC-11", "AC-12", "AC-13"]
status: done
depends_on: ["01"]
owns: ["packages/ui/src/components/Card/**", "packages/ui/src/components/BlockTitle/**", "apps/storybook/stories/Card.stories.ts", "apps/storybook/stories/CardSlider.stories.ts", "apps/storybook/stories/CardSlider.astro", "apps/storybook/stories/BlockTitle.stories.ts", "apps/website/src/sections/FAQSection.astro", "apps/website/src/sections/FAQSection.css.ts", "packages/content/src/faq/**"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Блок и карточка ЧАВО соответствуют макету на всех ступенях, стрелки слайдера получили три состояния, заготовка про афтапати заменена.

## Context (grounded — executor needs NO extra search)
- `packages/ui/src/components/Card/CardSlider.astro:21-27` — стрелки с литералами `aria-label`, заменить пропами `prevLabel`, `nextLabel` и добавить именованный слот `header` рядом со стрелками.
- `packages/ui/src/components/Card/CardSlider.css.ts`, `CardSlider.client.ts:27-31,61-68` — колонки сейчас считает `slidesPerView(laptop, desktop)`; новая модель `slidesPerView: 'auto'`, ширину слайда задаёт CSS `vars.adaptive.cardWidth`. `GAP_VAR` перевести на `vars.adaptive.sliderGap`. Сравнение перед `swiper.update()` сохранить: без него секция дрожит (коммит 7002ee4).
- `packages/ui/src/components/Card/Card.css.ts:20-30` — карточка: `vars.adaptive.cardPaddingBlock/Inline`, между заголовком и текстом `vars.adaptive.cardGap`, рамка `thin` `vars.color.border`, `width: 100%`. Заголовок `vars.font.shorthand.cardTitle` + `lineHeight: vars.adaptive.cardTitleLine`, `uppercase`. Текст `cardBody` + `cardBodyLine`, `overflow-wrap: anywhere`. Ссылки в тексте: цвет `vars.color.link`, подчёркнуты.
- `packages/ui/src/components/BlockTitle/BlockTitle.css.ts:4` — один шрифт `vars.font.shorthand.blockTitle` на все ширины (мобильная ветка убирается); рамка 4px пунктиром уже есть. Компонент используют `FAQSection.astro` и `ProgramSection.astro`.
- `apps/website/src/sections/FAQSection.astro:29-46` — разметка секции; секция передаёт заголовок в слот `header` слайдера и подписи `t('slider.prev')`, `t('slider.next')`.
- Иконка `ArrowLong` из `@moscowcss/icons`: `width`/`height` `vars.adaptive.arrowWidth/arrowHeight`, `stroke-width` `vars.adaptive.arrowStroke`.
- Раскладка: мобильный — заголовок, стрелки ниже; планшет — заголовок и стрелки в одну строку с `justify-content: space-between` в полосе шириной 26.5625rem; от `media.wide` снова колонка. Промежуток до ленты `vars.adaptive.sliderHeaderGap`, между заголовком и стрелками на мобильном `vars.padding.xxxl` (32), на `wide` 2.5rem.
- `packages/content/src/faq/ru/afterparty.md` и `en/afterparty.md` — заготовка; текст «AfterParty в PIVBAR», «1-я Тверская-Ямская ул., 2, стр. 1, Москва, 125047». `en`: «AfterParty at PIVBAR» с тем же адресом.
- `packages/content/src/faq/ru/duration.md:7` и `en/duration.md:7` — «на афтапати» и «for the after-party» заменить на AfterParty.

## Steps
1. Переделать стрелки: кнопка минимум `vars.size.hitTarget` по обеим осям и не уже стрелки, пара с промежутком `vars.adaptive.arrowPairGap`. Цвет `vars.color.text`, наведение `vars.color.link`, недоступная `vars.color.disabled` с `cursor: not-allowed`, переход `vars.motion.*`, `:focus-visible` контур `thin` `vars.color.focus`. Левая стрелка зеркалится `transform: scaleX(-1)`.
2. Карточка, заголовок, секция и лента по Context; карточки одной высоты через уже существующий `stretch` в `CardSlider.css.ts`.
3. Заменить текст про AfterParty и слово в `duration.md` на обоих языках.
4. Обновить истории: подписи пропами, карточка с длинным текстом, все три состояния стрелок.

## Done when (verification handle — the CONDUCTOR checks these, not the worker)
- [ ] `grep -n "not-allowed" packages/ui/src/components/Card/CardSlider.css.ts` и `grep -n "color.link" packages/ui/src/components/Card/CardSlider.css.ts` находят строки; `grep -n "Предыдущий\|Следующий" packages/ui/src/components/Card/CardSlider.astro` пуст (AC-6)
- [ ] `grep -n "cardWidth" packages/ui/src/components/Card/CardSlider.css.ts` и `grep -n "cardTitleLine\|cardBodyLine" packages/ui/src/components/Card/Card.css.ts` находят строки (AC-11)
- [ ] `grep -n "overflow-wrap\|overflowWrap" packages/ui/src/components/Card/Card.css.ts` находит правило переноса длинного текста (AC-11)
- [ ] `grep -n "blockTitle" packages/ui/src/components/BlockTitle/BlockTitle.css.ts` находит шрифт, `grep -n "subtitle" packages/ui/src/components/BlockTitle/BlockTitle.css.ts` пуст; `grep -n "media.wide" apps/website/src/sections/FAQSection.css.ts packages/ui/src/components/Card/CardSlider.css.ts` находит переключение раскладки (AC-12)
- [ ] `grep -l "PIVBAR" packages/content/src/faq/ru/afterparty.md packages/content/src/faq/en/afterparty.md` выводит оба файла; `grep -rniE "Я.карты|название|афтапати|after-party" packages/content/src/faq` пуст (AC-13)
- [ ] `pnpm lint` и `pnpm --filter website test` зелёные

## Must not
- удалять проверку перед `swiper.update()`
- заводить литеральные подписи и размеры
- менять `packages/design-system`: если токена не хватает, вернуть NEEDS_CONTEXT
- менять в ЧАВО что-либо, кроме слова AfterParty и текста про бар

## Report
Write the full result to `plans/004-designer-components/tasks/reports/05-report.md`. Return to the conductor ONLY:
status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT) + one-line summary + files touched (must be
within `owns`) + `contract: <digest>` copied from the contract file's frontmatter.
