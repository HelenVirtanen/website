---
id: "07"
title: i18n-routing-base-layout-locale-switcher
spec: "001"
criteria: ["AC-10", "AC-11"]
status: done
depends_on: ["06"]
owns: ["apps/website/src/i18n/**", "apps/website/src/layouts/**", "apps/website/astro.config.mjs", "apps/website/src/pages/**", "packages/ui/src/components/LocaleSwitcher/**", "packages/ui/src/components/NavBar/**", "packages/ui/src/index.ts", "apps/storybook/stories/LocaleSwitcher.stories.ts", "apps/storybook/stories/NavBar.stories.ts"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Сайт отдаётся на двух языках (`/` — ru, `/en/` — en) через общий `BaseLayout` с `lang`, `canonical`,
`hreflang`/`x-default` и переключателем языка; подписи NavBar приходят из словаря.

## Context (grounded)
- Образец: `/home/r/common/0work/blog/apps/blog/src/i18n/config.ts` (locales, defaultLocale, localeNames,
  localeSwitchHints), `i18n/index.ts:20-28` (`useTranslations` с фолбэком на defaultLocale),
  `i18n/ui.ts`, `i18n/ui.test.ts`; `apps/blog/astro.config.ts` (`i18n` + `trailingSlash: 'always'`);
  `apps/blog/src/layouts/BaseLayout.astro:80-225` (canonical, hreflang, x-default, переключатель через
  `alternates`); `apps/blog/src/pages/[...locale]/search.astro:16-20` (маршрут `[...locale]`, ru → `undefined`).
- Здесь: `apps/website/astro.config.mjs:1-12` (`site: 'https://css.moscow'`, VE-плагин — сохранить),
  `apps/website/src/pages/index.astro:1-31` (импорты fonts/design-system/global.css, `<html lang="ru" data-theme="light">`),
  `packages/ui/src/components/NavBar/NavBar.astro:20-27` (`NAV_LINKS` с русскими подписями — убрать в проп).
- Новый компонент — ТОЛЬКО `pnpm new:component` (plop, `plopfile.mjs:6-32`), дом-стиль `Card.astro:1-14`
  (`const Tag`, `HTMLAttributes<typeof Tag>`, русский JSDoc на каждом своём пропе), стори в
  `apps/storybook/stories/`. Чек-лист компонента: `/home/r/.claude/plugins/cache/vzhyx/vzhyx/0.26.0/conventions/ui-component-house-style.md`.
- Эталон снимков `.visual/baseline` (`tools/visual/README.md`): стори NavBar должна совпасть. Сравнивать
  `node tools/visual/compare.mjs --exact .visual/baseline .visual/t07` (рефакторинг без изменения вида);
  каталог снимков — только внутри `.visual/`. Серверы гасить по PID (`setsid` + `kill -- -PID`).
- `apps/website/src/pages/index.astro` сейчас вызывает `await loadCatalog()` (`apps/website/src/content/catalog.ts`) —
  так валидация контента участвует в сборке. Новая `pages/[...locale]/index.astro` ОБЯЗАНА сохранить этот вызов.

## Steps
1. `src/i18n/{config,index,ui}.ts` + `ui.test.ts` (у ru и en одинаковые ключи). Ключи: подписи навигации,
   переключателя, `site.name`, всё, что понадобится шапке.
2. `astro.config.mjs`: `i18n: { defaultLocale: 'ru', locales: ['ru','en'], routing: { prefixDefaultLocale: false } }`,
   `trailingSlash: 'always'` (комментарии по-русски, почему).
3. `src/layouts/BaseLayout.astro`: пропы `title`, `description`, `lang`, `alternates`, `noindex?`, `card?`
   (OG — задача 10, проп заложить); пишет `<html lang data-theme="light">`, `<title>`, description,
   canonical (абсолютный по `Astro.site`, нет у noindex), `hreflang` для каждой версии и `x-default` → ru.
   Импорты fonts/design-system/global.css переносятся сюда.
4. `pnpm new:component` → `LocaleSwitcher` (`Tag = 'nav'`, проп `options: {code,label,href,hint,current}[]`,
   `aria-current="page"` у текущего, `lang`/`hreflang` у ссылок); стори с двумя и одним языком.
5. `NavBar`: пропы `links: { href, label }[]` и подписи, которые сейчас зашиты (aria-подписи меню/закрытия),
   слот для переключателя; стори NavBar передаёт прежние русские значения.
6. `pages/[...locale]/index.astro` (временно — нынешняя главная внутри `BaseLayout`, данные пока из
   `src/data`), удалить `pages/index.astro`.

## Done when
- [ ] `pnpm build` → `grep -o '<html lang="[a-z]*"' apps/website/dist/index.html` = `<html lang="ru"` и `apps/website/dist/en/index.html` = `<html lang="en"` (AC-10)
- [ ] в обоих файлах `grep -c 'hreflang=' ` = 3 с абсолютными `https://css.moscow/` и `https://css.moscow/en/`, переключатель ведёт на другую версию (AC-10)
- [ ] `grep -n "Регистрация\|Программа\|Партнеры\|Адрес" packages/ui/src/components/NavBar/NavBar.astro` → пусто — подписи из пропов/словаря (AC-11)
- [ ] `pnpm --filter website test` → pass (ключи словаря совпадают)
- [ ] снимки стори NavBar в `node tools/visual/compare.mjs .visual/baseline .visual/t07` ≤ 0.1%
- [ ] `pnpm lint && pnpm build && pnpm build:storybook` → exit 0

## Must not
- создавать компонент руками вместо `pnpm new:component`; оставлять пропы без JSDoc
- захардкодить текст интерфейса в разметке; менять стили NavBar
- коммитить (коммит делает conductor); трогать файлы вне `owns`

## Report
`plans/001-blog-like-architecture/tasks/reports/07-report.md`. Вернуть conductor-у ТОЛЬКО: статус + строка +
файлы + `contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
