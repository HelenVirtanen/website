# План: компоненты дизайнера (спека 004)

Сложность L, режим PRP-PHASED. Числа из макета лежат в файлах задач и в таблице токенов задачи 01:
исполнитель Figma не читает. Ассеты из Figma скачаны в `temp/figma/` (git-игнор, ссылки Figma живут
7 дней).

## Что нашли в коде

| Что | Где | Вывод |
|---|---|---|
| Ступени ширины | `packages/design-system/src/scale.ts:9` `widthSteps` | `wide` нет, добавляем между `desktop` и `desktopLarge`; существующие таблицы не меняются |
| Брейкпоинты | `packages/design-system/src/breakpoints.ts:5` | `wide` = 90rem уже есть, `media.wide` готов |
| Адаптивные значения | `packages/design-system/src/layout.ts`, `themes/layout.css.ts`, `scale.ts:147` `layoutSpace` | Образец новой группы `vars.adaptive.*` |
| Корень | `packages/design-system/src/themes/root.css.ts:6` | Уже `max(100%, 100vw / 120)`, не трогаем |
| Сборка контракта | `packages/design-system/src/contract.ts:13` | Новые срезы добавляются сюда и в `themes/index.css.ts` |
| Кнопка | `packages/ui/src/components/Button/Button.astro:5` | Только `button`, образец двух форм в `CallToAction.astro:6-28` |
| Форма восьмиугольника | `packages/ui/src/components/CallToAction/CallToAction.css.ts:7` | Тот же многоугольник, что `org-octagon.svg`: выносим в `dimensions` |
| Единственный потребитель CTA | `apps/website/src/sections/HeroSection.astro:71` | Переделываем `CallToAction` на месте |
| Шапка | `packages/ui/src/components/NavBar/NavBar.astro:57`, `apps/website/src/layouts/BaseLayout.astro:149`, `layouts/nav.ts:12` | Шесть пунктов уже есть; `TgLinkButton` уходит |
| Слайдер | `packages/ui/src/components/Card/CardSlider.astro:21`, `CardSlider.client.ts:31` | Литералы aria-label; колонки считаются числом, нужны слайды фиксированной ширины |
| Петля ресайза | `CardSlider.client.ts:61` и коммит 7002ee4 | Сравнение перед `swiper.update()` сохраняем |
| Карточка | `packages/ui/src/components/Card/Card.css.ts:20` | Единственный потребитель на сайте — `FAQSection.astro:3` |
| Заголовок блока | `packages/ui/src/components/BlockTitle/BlockTitle.css.ts:4`; потребители `FAQSection.astro:2`, `ProgramSection.astro:2` | Новый кегль дойдёт и до «Программы», это намеренно |
| Схема митапа | `packages/content/src/schema.ts:70` `EventFields` | Поле `tags` по образцу `modes:92` |
| Коллекции | `packages/content/src/collections.ts:23`, `apps/website/src/content/catalog.ts:48,74,211,305` | Образец новой коллекции — `speakers` и `faq` |
| Генератор | `apps/website/scripts/new-entry.mjs:21` `KINDS`, `packages/content/templates/{ru,en}/` | Новый вид `organizer` |
| Главная | `apps/website/src/pages/[...locale]/index.astro:49` | Сюда плавающая кнопка и блок организаторов |
| Снимки | `tools/visual/capture.mjs:11` `WIDTHS` | Добавляем 1440 |

## Принятые инженерные решения

- **Токены раньше компонентов.** Все новые значения добавляет задача 01 по одной таблице: иначе семь
  задач пишут в один файл шкалы и идут строго по очереди. Компонентные задачи только читают `vars`.
- **Контраст плавающей кнопки.** `mix-blend-mode: difference` на самом `position: fixed` элементе,
  потому что `fixed` создаёт контекст наложения и блендинг на ребёнке смешивался бы только внутри него.
  Фон белый, текст чёрный: на белой странице получается чёрная кнопка с белым текстом.
- **Форма и контур фокуса.** Скруглённый восьмиугольник задаётся `mask-image` с данными из
  `octagon-1920.svg` на вложенной грани: `clip-path: path()` не масштабируется, а маска на корне срезала
  бы контур. Контур рисует псевдоэлемент корня той же маской, как уже сделано в `CallToAction.css.ts:34`.
- **Падение плашек.** Чистая функция раскладки с инъекцией генератора случайных чисел плюс WAAPI.
  Без JS и при сниженной анимации плашки лежат строками через `flex-wrap`.
- **Заголовок на мобильном в две строки.** `width: min-content` на `h1` при обычном пробеле в словаре;
  от 768 `width: auto` и `white-space: nowrap`. Разметка одна на все ширины.
- **Стрелка.** Одна иконка с `preserveAspectRatio="none"` и `vector-effect: non-scaling-stroke`: у макета
  разные пропорции стрелки на разных ширинах, толщина задаётся токеном.

## Риски

| Риск | Вероятность | Влияние | Что делаем |
|---|---|---|---|
| Значения 768 и 1920 Hero выведены, а не сняты с макета | Средняя | Среднее | Всё в токенах, задача 11 сверяет снимками |
| `difference` на цветной секции даст неожиданный оттенок | Средняя | Низкое | Проверка на партнёрской секции в задаче 11 |
| Белый текст на оранжевых и красных плашках ниже 4.5:1 | Высокая | Среднее | Следуем макету, сообщаем дизайнеру в итоге |
| Новые шрифты замедляют первую отрисовку | Средняя | Низкое | `font-display: swap`, только нужные начертания и наборы |
| Ступень `wide` в `widthSteps` ломает порядок медиазапросов | Низкая | Высокое | Есть тест каскада в `scale.test.ts`, расширяем его |
| Сборка в общем дереве конфликтует при параллельных задачах | Средняя | Среднее | Исполнители не запускают `pnpm build`, сборку гоняет дирижёр после волны |

## Не строим

Смотри «Вне охвата» спеки. Дополнительно: не вводим общий компонент «секция», не трогаем
`packages/og`, не добавляем зависимостей, кроме файлов шрифтов.

## Неотвеченные вопросы

Ссылка Telegram на карточке организатора, см. спеку.
