# Отчёт по задаче 01 · foundation-tokens

Статус: DONE_WITH_CONCERNS
contract: e65351fb

## Что сделано
- `scale.ts`: ступень `wide` в `widthSteps` (между `desktop` и `desktopLarge`); хелпер `px()` для записи значений макета в px; `blockTitle` = 36/40; 15 новых ролей `typeScale`; новая таблица `adaptiveScale` (44 токена) и тип `AdaptiveToken`. Значения переведены px/16 в rem.
- `scale.test.ts`: тест `wide` на 1439/1440 (`a`/`b`), `adaptiveScale` добавлена в проверки «всё в rem» и каскада, в список ширин каскада добавлены 1439 и 1440. Существующие проверки не ослаблены.
- `motion.ts` + `themes/motion.css.ts`: длительности и кривые; в `prefers-reduced-motion: reduce` три длительности равны `0ms`. `motion` экспортирован из `index.ts` как `{ contract, values }` (значения: `motion.values.motion.duration.fall` и т.д.).
- `adaptive.ts` + `themes/adaptive.css.ts`: `vars.adaptive.*` с базой на `:root` и `mediaOverrides` по ступеням.
- `fonts.ts`: `fontFamily.logo` (Jost), `fontFamily.text` (Golos Text), `fontWeight.logo.regular`, `text.regular`, `mono.light`.
- `palette.ts`: `inkA20`. `colors.ts`: `dividerSoft`, `link`, `buttonHover`, `onButtonHover`, `disabled`, `speakerAccent`, `pastNote`, пары `tagSky|Blue|Yellow|Red|Orange` / `onTag*`. Dark повторяет light автоматически.
- `typography.ts`: ключи `font.size` и `font.shorthand` теперь строятся из `typeScale` (тип `FontRole`), шорткаты проверяются `satisfies Record<FontRole, string>`; шорткаты 15 новых ролей; `cardTitle`/`cardBody` берут высоту строки из `var(--adaptive-cardTitleLine|cardBodyLine)`; новые трекинги в `font.letterSpacing`: `blockTitle`, `navLogo`, `menuLink`, `heroChip`, `heroDisplay`, `heroText` (lead и body), `ctaFloating`.
- `spacing.ts`: `size.hitTarget`, `size.organizerPhoto`, `size.organizerPadding`, `radius.large`. `zIndex.ts`: `floatingCta` = 50.
- `dimensions.ts`: `octagon` (clip-path polygon) и `octagonRoundedMask` (data-URI маска из `octagon-1920.svg`, чёрная заливка, `preserveAspectRatio="none"`).
- Иконки: новая `arrow-long.svg` (viewBox 60x22, stroke currentColor, `vector-effect="non-scaling-stroke"`, miter/butt по умолчанию); `Burger.svg` и `Close.svg` заменены путями из `temp/figma`, stroke currentColor, stroke-width 1.5.
- `ui.ts`: `hero.title` с обычным пробелом и 10 новых ключей в обоих языках.

## Проверки (мои)
- `pnpm --filter @moscowcss/design-system test` зелёный (12 тестов).
- `pnpm --filter @moscowcss/design-system lint`, `@moscowcss/icons lint` чисто; `vitest run src/i18n` в website зелёный, eslint по `src/i18n` чист.
- `pnpm --filter @moscowcss/icons build` проходит, `ArrowLong.astro` сгенерирован.
- Прогон `compile`/`processVanillaFile` из vanilla-extract по `themes/index.css.ts`: тема собирается, эмитятся `--motion-*` (и `@media (prefers-reduced-motion: reduce)` с `0ms`), `--adaptive-*` с переопределениями на `min-width: 90rem`, `--zIndex-floatingCta: 50`, шорткат `cardTitle` ссылается на `--adaptive-cardTitleLine`.
- `themes/root.css.ts` не менялся, строка `max(100%, 100vw / 120)` на месте.
- `pnpm lint` и `pnpm build` от корня не запускались (по правилам прогона): за дирижёром.

## Замечания (concerns)
1. Генератор иконок (`packages/icons/scripts/generate.mjs`, вне `owns`) переносит из исходного `<svg>` только `viewBox` и `fill`. `preserveAspectRatio="none"` из `arrow-long.svg` в `ArrowLong.astro` не попадает. Потребитель обязан передавать `preserveAspectRatio="none"` пропсом (он уходит через `...rest`) и ставить `overflow: visible` в CSS (острый кончик и обводка выходят за viewBox). `vector-effect` и `stroke-width` SVGO не срезал. Настройки SVGO и генератор не менялись.
2. Новый `Burger.svg` имеет viewBox 24x24 вместо 24x20, а `BurgerButton` задаёт иконке только ширину с `height: auto`: высота иконки в бургере вырастет с ~11.7px до 14px, и линии станут тоньше (stroke 1.5 из макета). Это следствие требования заменить иконку; визуальную проверку шапки сделает задача 06/11.
3. `tsc --noEmit` в design-system сообщает одну ошибку в `scale.test.ts:111` (`names[key]` при `noUncheckedIndexedAccess`). Строка была в тесте до задачи, скриптa typecheck у пакета нет, vitest её не замечает; не трогал, чтобы не менять каскадный тест.
4. `CLAUDE.md`/`AGENTS.md` пакета design-system (дерево файлов, список концернов) не обновлялись: файлы вне `owns`; обновление — в задаче 10 (cleanup-and-docs). Новые файлы-концерны: `motion.ts`, `adaptive.ts`, `themes/motion.css.ts`, `themes/adaptive.css.ts`.
5. Шрифты Jost и Golos Text в `@moscowcss/fonts` подключает другая задача (02); до неё новые шорткаты `navLogo`/`heroChip`/`heroDisplay`/`heroLead`/`heroBody` уйдут на `system-ui`, но их пока никто не использует.
6. «Значения в px» из таблицы задачи записаны в rem (px/16), как требует CLAUDE.md: таблицы масштабируются вместе с корневым кеглем выше 1920.

## Файлы
Изменены: `packages/design-system/src/{colors,contract,dimensions,fonts,index,palette,scale,scale.test,spacing,typography,zIndex}.ts`, `packages/design-system/src/themes/index.css.ts`, `packages/icons/src/svg/{Burger,Close}.svg`, `apps/website/src/i18n/ui.ts`.
Созданы: `packages/design-system/src/{motion,adaptive}.ts`, `packages/design-system/src/themes/{motion,adaptive}.css.ts`, `packages/icons/src/svg/arrow-long.svg`.
