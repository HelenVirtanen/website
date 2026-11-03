# Отчёт по задаче 04 (спека 001) — NEEDS_CONTEXT
contract: 621371f0

## Сделано
- 49 употреблений vars.padding|spacing.{m,l,xxl} -> vars.layout.inset|gap.* в 11 файлах (packages/ui, sections).
- spacing.ts: добавлены size-токены speakerAvatarLaptop, programTimeColumn, programTitleColumnMin/Max,
  programDescriptionColumnMin (по заданию) + speakerAvatar ('10.5rem') и programHintMaxWidth ('36rem'):
  без них третий grep из «Done when» не даёт 0 (строки width: '10.5rem' и maxWidth: '36rem' совпадают
  с шаблоном '[0-9.]+rem). Значения не менялись, это существующие литералы.
- gridTemplateColumns собраны шаблонными строками из токенов; SpeakerAvatar на токенах.

## Done when
- grep padding/spacing m|l|xxl -> 0 строк: OK
- grep px -> 0 строк: OK
- grep '[0-9.]+rem в SpeakerAvatar/ProgramSection -> 0 строк: OK
- pnpm lint && pnpm build && pnpm build:storybook -> exit 0: OK
- compare.mjs baseline t04 -> exit 1: НЕ ВЫПОЛНЕНО (4 из 160 файлов)

## Таблица долей расхождений (.visual/t04, порог 0.1%)
Остальные 156 файлов: 0.0000%.

| файл | доля |
| --- | --- |
| site/faq@1280.png | 1.8601% |
| site/faq@1920.png | размер 1920x721 -> 1920x693 |
| stories/components-card--slider@1280.png | 3.6817% |
| stories/components-card--slider@1920.png | 2.7876% |

## Причина (ошибка замены токенов, не значений)
packages/ui/src/components/Card/CardSlider.client.ts:58 читает CSS-переменную по имени строкой:
cssVarToPx('--spacing-l') -> spaceBetween для Swiper. После задачи 03 --spacing-l постоянна (16px),
а прежнее растущее значение (24px на >=1280) теперь в --layout-gap-l. Расстояние между слайдами
уменьшилось на 8px на 1280 и 1920, отсюда сдвиг карточек и другая высота FAQ на 1920 (diff это подтверждает).
Лечится одной правкой: --spacing-l -> --layout-gap-l.

## Блокер
Файл .client.ts вне owns задачи (только *.css.ts и spacing.ts); owns-guard отклонил запись
(заявка "04" подана, поверхность не расширилась). Обход через shell не делался.
Нужна правка нарезки: добавить packages/ui/src/components/Card/CardSlider.client.ts в owns задачи 04
(или отдельная задача), затем: заменить строку, pnpm build, поднять превью+Storybook, capture.mjs .visual/t04,
compare.mjs .visual/baseline .visual/t04 (ожидается 0 расхождений).
Других строковых ссылок на --padding-*/--spacing-* в .ts/.astro нет (grep).
Серверы остановлены.
