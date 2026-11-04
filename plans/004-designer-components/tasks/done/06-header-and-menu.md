---
id: "06"
title: header-and-menu
spec: "004"
criteria: ["AC-7", "AC-8"]
status: done
depends_on: ["01", "02", "03"]
owns: ["packages/ui/src/components/NavBar/**", "packages/ui/src/components/BurgerButton/**", "packages/ui/src/components/LocaleSwitcher/**", "packages/ui/src/components/TgLinkButton/**", "packages/ui/src/index.ts", "apps/storybook/stories/NavBar.stories.ts", "apps/storybook/stories/BurgerButton.stories.ts", "apps/storybook/stories/LocaleSwitcher.stories.ts", "apps/storybook/stories/TgLinkButton.stories.ts", "apps/website/src/layouts/BaseLayout.astro"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Шапка и полноэкранное меню соответствуют макету на всех ступенях, ссылки и поведение меню работают как раньше.

## Context (grounded — executor needs NO extra search)
- `packages/ui/src/components/NavBar/NavBar.astro:57-93`, `NavBar.css.ts`, `NavBar.client.ts` — разметка, стили, логика открытия. Атрибуты `data-navbar`, `data-nav-menu`, `data-nav-close`, `data-nav-links` читает клиентский скрипт: сохранить.
- `apps/website/src/layouts/BaseLayout.astro:47-51,149` — откуда берётся `telegramHref`; сюда добавить `telegramButtonLabel={t('nav.telegramButton')}`, подпись домена и адрес. Адрес: тот же митап, что на главной (`upcomingEvent` из `apps/website/src/content/catalog.ts`, момент `buildNow()` из `apps/website/src/content/now.ts`). Нет адреса — строка показывает только Telegram.
- `TgLinkButton` используется только в шапке: удалить компонент, историю и экспорт, если потребителей не осталось (`packages/ui/src/index.ts`).
- Логотип: текст `t('site.name')` или `homeLabel` в значении, шрифт `vars.font.shorthand.navLogo`, цвет `vars.color.link`, `uppercase`, ссылка на главную.
- Верхняя строка: поля `vars.adaptive.navPaddingTop/Inline`, снизу `vars.adaptive.navGap` до разделителя; разделитель 1px `vars.color.dividerSoft`, не на всю ширину окна, а внутри полей.
- Действия: промежуток `vars.adaptive.navActionsGap`. Язык: текущий обычный, разделитель `/` с `opacity 0.3`, другой язык с `opacity 0.4`, шрифт `navMono`, промежуток `navLangGap`.
- Пункты от `media.wide`: шрифт `navMeta`, промежуток `navLinksGap`, по центру между логотипом и действиями.
- Кнопка Telegram: `Button` с `href`, `size="nav"`, родитель задаёт `width: auto` от `wide`, ниже `wide` в шапке её нет.
- Строка под разделителем от `media.wide`: шрифт `navMeta`, адрес слева, `t.me/moscowcss` справа ссылкой, вне прилипшего блока, поэтому уезжает при прокрутке.
- Бургер: иконка 1.5rem (24px), кнопка минимум `vars.size.hitTarget`. Крестик на том же месте.
- Меню: фон `vars.color.background`, сверху шапка как обычно, пункты с полями 16, `paddingTop` 8; ряд 18 сверху и снизу, нижняя граница `dividerSoft`, шрифт `menuLink`, `uppercase`, стрелка `→` через `::after`, `opacity 0.4`. Низ `margin-top: auto`, поля 24/16/32, промежуток 16: `Button size="nav"`, адрес `navMeta`, `t.me/moscowcss` `navMeta` с `opacity 0.6`.
- Планшетного макета шапки нет: до `wide` действуют значения мобильного (`tablet` не переопределяет).

## Steps
1. Проп `addressLine?: string`, `telegramButtonLabel: string`, `telegramText: string` с JSDoc; `telegramLabel` убрать, если больше не нужен.
2. Переверстать по Context от мобильного к десктопу, заменив `media.mobile` на базовые стили и `media.wide`.
3. `min-width` и `min-height` `vars.size.hitTarget` на всех ссылках и кнопках шапки, меню и переключателя языка; контур `:focus-visible` `thin` `vars.color.focus`; плавные переходы через `vars.motion.*`.
4. Обновить истории: на широкой и узкой ширине, меню открыто; удалить историю `TgLinkButton`.

## Done when (verification handle — the CONDUCTOR checks these, not the worker)
- [ ] `pnpm --filter website build` зелёный; `grep -l "data-nav-menu" apps/website/dist/index.html` находит файл (AC-8)
- [ ] `grep -c "t.me/moscowcss" apps/website/dist/index.html` ≥ 2, `grep -n "navLogo" packages/ui/src/components/NavBar/NavBar.css.ts` и `grep -n "media.wide" packages/ui/src/components/NavBar/NavBar.css.ts` находят строки (AC-7)
- [ ] `grep -n "menuLink" packages/ui/src/components/NavBar/NavBar.css.ts` и `grep -n "'→'\|→" packages/ui/src/components/NavBar/NavBar.css.ts` находят строки; `grep -rn "data-nav-close" packages/ui/src/components/NavBar/NavBar.astro` находит крестик (AC-8)
- [ ] `grep -n "hitTarget" packages/ui/src/components/LocaleSwitcher/LocaleSwitcher.css.ts packages/ui/src/components/BurgerButton/BurgerButton.css.ts packages/ui/src/components/NavBar/NavBar.css.ts` находит все три файла (AC-7)
- [ ] `grep -rn "TgLinkButton" apps packages --include=*.astro --include=*.ts --exclude-dir=node_modules --exclude-dir=dist` пуст
- [ ] `pnpm lint` и `pnpm --filter website test` зелёные

## Must not
- менять `layouts/nav.ts`, состав пунктов и якоря
- ломать закрытие меню по Esc и по переходу
- писать в `packages/design-system`
- оставлять литеральный текст в компонентах

## Report
Write the full result to `plans/004-designer-components/tasks/reports/06-report.md`. Return to the conductor ONLY:
status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT) + one-line summary + files touched (must be
within `owns`) + `contract: <digest>` copied from the contract file's frontmatter.
