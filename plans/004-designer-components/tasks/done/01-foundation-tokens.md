---
id: "01"
title: foundation-tokens
spec: "004"
criteria: ["AC-1", "AC-2"]
status: done
depends_on: []
owns: ["packages/design-system/src/**", "packages/icons/src/svg/**", "apps/website/src/i18n/ui.ts"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Дизайн-система и словарь содержат все значения макета, на которых дальше строятся компоненты; ступень 1440 работает в таблицах шкалы; сайт при этом выглядит как раньше.

## Context (grounded — executor needs NO extra search)
- `packages/design-system/src/scale.ts:9` — `widthSteps`, в него добавить `'wide'` между `desktop` и `desktopLarge`; `Steps` выводится сам.
- `packages/design-system/src/scale.ts:147` `layoutSpace`, `layout.ts`, `themes/layout.css.ts` — образец новой группы «таблица + контракт + применитель с `mediaOverrides`».
- `packages/design-system/src/contract.ts:13` — сборка контракта; `themes/index.css.ts` — импорты применителей.
- `packages/design-system/src/typography.ts` — `size()`, `contract.font`, шорткаты; `themes/typography.css.ts` применяет `typeScale`.
- `packages/design-system/src/fonts.ts` — семейства и начертания; `palette.ts`, `colors.ts` — цвета; `zIndex.ts`; `dimensions.ts`; `spacing.ts` — `size`.
- `packages/design-system/src/scale.test.ts` — тест каскада.
- `temp/figma/arrows-1920.svg`, `burger.svg`, `close.svg`, `octagon-1920.svg` — исходники форм.
- `packages/icons/src/svg/` — исходники иконок; `Burger.svg`, `Close.svg`, новая `arrow-long.svg`. Настройки SVGO: `packages/icons/svgo.config.mjs`.
- `apps/website/src/i18n/ui.ts:9-39,112-142` — словарь, `ru` источник, покрытие проверяется тестом.

## Steps
1. Добавить `wide` в `widthSteps` и тест: таблица `{ base: 'a', wide: 'b' }` даёт `a` на 1439 и `b` на 1440.
2. Новый файл `motion.ts` (контракт + значения): `duration.fast 120ms`, `duration.base 200ms`, `duration.fall 900ms`, `easing.standard cubic-bezier(0.2, 0, 0, 1)`, `easing.fall cubic-bezier(0.33, 1.3, 0.6, 1)`; `themes/motion.css.ts` применяет на `:root`, а при `(prefers-reduced-motion: reduce)` ставит длительности `0ms`. Экспортировать `motion` из `index.ts` для клиентских скриптов.
3. `fonts.ts`: `fontFamily.logo '"Jost", system-ui, sans-serif'`, `fontFamily.text '"Golos Text", system-ui, sans-serif'`, в `fontWeight`: `logo.regular 400`, `text.regular 400`, `mono.light 300`.
4. `palette.ts`: `inkA20 '#0B040033'`, `gray300` уже есть. `colors.ts` (light, dark повторяет): `dividerSoft` = inkA20, `link` = blue, `buttonHover` = blue, `onButtonHover` = white, `disabled` = gray300, `speakerAccent` = pink, `pastNote` = orange, пары плашек `tagSky`/`onTagSky` (sky, ink), `tagBlue`/`onTagBlue` (blue, white), `tagYellow`/`onTagYellow` (yellow, ink), `tagRed`/`onTagRed` (red, white), `tagOrange`/`onTagOrange` (orange, white).
5. `typeScale` (rem от px/16; пустая ячейка — значение предыдущей ступени). Роли и шорткаты:

   | Роль | base | tablet | wide | desktopLarge | Шрифт, вес, высота строки, трекинг |
   |---|---|---|---|---|---|
   | buttonLabel | 12 | | 14 | 18 | mono 500, 0.994 |
   | navLogo | 20 | | 24 | 28 | logo 400, 1, 0.02em |
   | navMono | 13 | | 16 | 20 | mono 400, 1.5 |
   | navMeta | 12 | | 14 | 18 | mono 300, 1.4 |
   | menuLink | 22 | | | | mono 500, 1.4, -0.005em |
   | heroTag | 13 | 15 | 18 | 24 | mono 500, 1 |
   | heroChip | 12 | | 14 | 16 | logo 400, 1, 0.04em |
   | heroDate | 20 | | 26 | 29 | mono 700, 1.2 |
   | heroMeta | 13 | | 16 | 22 | mono 400, 1.5 |
   | heroDisplay | 75 | 106 | 201 | 266 | logo 400, 1, -0.01em |
   | heroLead | 16 | | 18 | 24 | text 400, 1.55, 0.005em |
   | heroBody | 14 | | 16 | 20 | text 400, 1.55, 0.005em |
   | ctaFloating | 12 | | 14 | 24 | mono 700, 1.349, 0.02em |
   | cardTitle | 24 | | 32 | | display 600, высоту строки задаёт `adaptive.cardTitleLine` |
   | cardBody | 18 | 22 | | | display 400, высоту строки задаёт `adaptive.cardBodyLine` |

   `blockTitle` заменить на base 36, tablet 40 (высота строки шорткатом 1.1, трекинг 0.02em, начертание display 400). Трекинги положить в `font.letterSpacing`.
6. Новый срез `adaptive.ts` + `themes/adaptive.css.ts` (`vars.adaptive.*`), значения в px:

   | Токен | base | tablet | wide | desktopLarge |
   |---|---|---|---|---|
   | buttonPaddingBlock | 12 | | 20 | |
   | buttonPaddingInline | 15 | | 30 | |
   | navButtonPaddingBlock | 13 | | 17 | 20 |
   | navButtonPaddingInline | 20 | | 28 | 36 |
   | navButtonRadius | 8 | | 10 | |
   | navPaddingTop | 14 | | 28 | 36 |
   | navPaddingInline | 16 | | 56 | 80 |
   | navGap | 14 | | 16 | |
   | navActionsGap | 20 | | 32 | 40 |
   | navLinksGap | 32 | | | 40 |
   | navLangGap | 6 | | 8 | 10 |
   | heroPaddingTop | 24 | | 40 | 52 |
   | heroPaddingBottom | 40 | | 72 | 96 |
   | heroPaddingInline | 16 | 24 | 56 | 80 |
   | heroGap | 28 | | 56 | 76 |
   | heroGroupGap | 12 | | 16 | 20 |
   | heroTagsHeight | 200 | | 264 | 352 |
   | heroTagPaddingBlock | 11 | 14 | 17 | 29 |
   | heroTagPaddingInline | 14 | 18 | 24 | 48 |
   | heroTagRadius | 17 | 21 | 26 | 41 |
   | heroChipPaddingBlock | 11 | | 18 | |
   | heroChipPaddingInline | 14 | | 24 | 28 |
   | heroChipRadius | 8 | | 10 | |
   | heroDateGap | 2 | | 4 | |
   | heroMetaGap | 16 | | 64 | 69 |
   | heroAboutGap | 8 | | 12 | 16 |
   | ctaSize | 112 | | 132 | 231 |
   | ctaOffsetInline | 16 | 24 | 56 | 80 |
   | ctaOffsetBlock | 16 | | 40 | 48 |
   | arrowWidth | 32 | | 43.5 | 60 |
   | arrowHeight | 14 | | | 22 |
   | arrowStroke | 2 | | | 3 |
   | arrowPairGap | 4 | | 14 | 39 |
   | cardWidth | 305 | | 425 | |
   | cardPaddingBlock | 20 | 40 | | |
   | cardPaddingInline | 16 | 24 | | |
   | cardGap | 20 | 40 | | |
   | cardTitleLine | 40 | | 48 | |
   | cardBodyLine | 28 | 32 | | |
   | sliderGap | 10 | 20 | | |
   | sliderHeaderGap | 16 | 40 | 20 | |
   | organizerGap | 24 | 19 | 24 | |

7. `spacing.ts`: `size.hitTarget 2.625rem` (42px), `size.organizerPhoto 15.577rem` (249.23px), `size.organizerPadding 2rem`, `radius.large 0.625rem` (10px). `zIndex.ts`: `floatingCta '50'` (ниже `navOverlay` и `navBar`).
8. `dimensions.ts`: `octagon` — строка `polygon(29.33% 0, 70.89% 0, 100% 29.11%, 100% 71.11%, 71.11% 100%, 28.89% 100%, 0 71.11%, 0 28.89%)`; `octagonRoundedMask` — `url("data:image/svg+xml,…")` из пути `temp/figma/octagon-1920.svg` с чёрной заливкой.
9. Иконки: `arrow-long.svg` из правой стрелки `arrows-1920.svg`, viewBox 60×22, `stroke="currentColor"`, `preserveAspectRatio="none"`, `vector-effect="non-scaling-stroke"`, кончик без скруглений; `Burger.svg` и `Close.svg` заменить путями из `temp/figma` со `stroke="currentColor"`. Проверить, что SVGO не срезал атрибуты: при необходимости поправить `arrow-long.svg`, не настройки для всех иконок.
10. Словарь, оба языка: `hero.title` с обычным пробелом; `hero.meetupNumber` `{number} митап` / `Meetup {number}`; `hero.register` `position: в зале` / `position: in-person`; `hero.registerLabel` `position: в зале — регистрация на митап` / `position: in-person — register for the meetup`; `nav.telegramButton` `Канал в Telegram` / `Telegram channel`; `slider.prev` `Предыдущая карточка` / `Previous card`; `slider.next` `Следующая карточка` / `Next card`; `organizers.title` `Организаторы` / `Organizers`; `organizer.contact.telegram` `TG:` / `TG:`; `organizer.contact.github` `GitHub:` / `GitHub:`; `organizer.contact.website` `Сайт:` / `Site:`.

## Done when (verification handle — the CONDUCTOR checks these, not the worker)
- [ ] `pnpm --filter @moscowcss/design-system test` зелёный, новый тест проверяет `resolveAt` на 1439 и 1440 → разные значения (AC-1)
- [ ] `grep -n "max(100%, 100vw / 120)" packages/design-system/src/themes/root.css.ts` находит строку, файл не менялся (AC-1)
- [ ] `grep -n "prefers-reduced-motion" packages/design-system/src/themes/motion.css.ts` находит правило с нулевыми длительностями; `packages/design-system/src/motion.ts` есть (AC-2)
- [ ] `pnpm lint` и `pnpm build` зелёные

## Must not
- менять уже существующие значения шкалы, кроме `blockTitle`
- удалять существующие токены: их ещё используют компоненты, чистка в задаче 10
- править компоненты и секции
- ослаблять тест каскада в `scale.test.ts`

## Report
Write the full result to `plans/004-designer-components/tasks/reports/01-report.md`. Return to the conductor ONLY:
status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT) + one-line summary + files touched (must be
within `owns`) + `contract: <digest>` copied from the contract file's frontmatter.
