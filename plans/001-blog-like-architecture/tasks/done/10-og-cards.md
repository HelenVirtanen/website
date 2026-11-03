---
id: "10"
title: og-package-and-meta-tags
spec: "001"
criteria: ["AC-16", "AC-17"]
status: done
depends_on: ["09"]
owns: ["packages/og/**", "packages/fonts/package.json", "packages/fonts/montserrat/*.ttf", "packages/design-system/package.json", "apps/website/src/seo/**", "apps/website/src/pages/og/**", "apps/website/src/layouts/BaseLayout.astro", "apps/website/src/i18n/ui.ts", "apps/website/package.json", "pnpm-workspace.yaml", "pnpm-lock.yaml"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Каждая индексируемая страница получает сгенерированные на сборке PNG-карточки 1200×630 (OpenGraph) и
1200×600 (Twitter) на своём языке и полный набор мета-тегов.

## Context (grounded)
- Образец пакета: `/home/r/common/0work/blog/packages/og/src/{index,render-card,fonts,logo}.ts`,
  `render-card.test.ts`. Ключевое: `CARD_SIZES` (`render-card.ts:20-23`), satori без React через
  `{type, props}` (`:38-50`), `onStyleError: throw` + `sharp(...).png()` (`:164-178`), каталог шрифтов от
  `package.json` пакета через `createRequire` (`fonts.ts:33-35`), кэш промиса шрифтов со сбросом на ошибке.
- Маршрут и метаданные в блоге: `apps/blog/src/pages/og/[...path].png.ts`, `apps/blog/src/seo/og.ts`
  (`cardParam`, суффикс `.twitter`, `cardPath`, `cardMetaOf`), теги — `apps/blog/src/layouts/BaseLayout.astro:200-216`.
- Шрифты: `packages/fonts/montserrat/Montserrat-{Regular,SemiBold,Bold}.ttf` уже лежат (скачаны из
  `JulietaUla/Montserrat` @ `555facf`, OFL; sha256 в `plans/001-blog-like-architecture/plan.md`, решение 5).
  `@moscowcss/og` читает их через `createRequire(import.meta.url).resolve('@moscowcss/fonts/package.json')`.
- Цвета: `@moscowcss/design-system/theme-colors` (задача 03, чистый TS). НЕ импортировать корневой
  `@moscowcss/design-system` из Node — он тянет `.css.ts`.
- Логотип: `packages/icons/src/svg/Logo.svg` (viewBox 0 0 80 77) — вписать пути константами в `logo.ts`.
- Список страниц: `apps/website/src/seo/pages.ts` (`publicPages()`, задача 09).
- Хвост ревью: `BaseLayout.astro` берёт ссылку на Telegram из константы `TELEGRAM_HREF`, а в контенте есть
  обязательное `pages/<lang>/index.md` → `telegramUrl`. Брать ссылку из контента (каталог/`pages` по языку
  страницы), константу убрать.

## Steps
1. `packages/fonts/package.json` exports: `"./montserrat-regular.ttf"`, `"./montserrat-semibold.ttf"`,
   `"./montserrat-bold.ttf"`, `"./package.json"`.
2. `packages/og` (`@moscowcss/og`, `type: module`, exports `.` и `./package.json`):
   `pnpm --filter @moscowcss/og add satori sharp @moscowcss/fonts@workspace:* @moscowcss/design-system@workspace:*`,
   `-D vitest typescript eslint @moscowcss/eslint-config@workspace:* @moscowcss/typescript-config@workspace:*`.
   `renderCard({ title, kicker, meta, size })` — светлая тема, логотип, «MoscowCSS», kicker (тип/номер митапа),
   meta (дата и место / роль спикера), заголовок до 3 строк. В `pnpm-workspace.yaml` `allowBuilds.sharp: true`.
   `CLAUDE.md` = `AGENTS.md` пакета.
3. Тесты: PNG нужного размера (IHDR), кириллица и латиница, длинный заголовок не бросает.
4. `apps/website`: `pnpm --filter website add @moscowcss/og@workspace:*`; `src/seo/og.ts` (пути
   `/og/<путь>.png`, `/og/<путь>.twitter.png`, у главной `/og/index…`; содержимое карточки по виду страницы);
   `pages/og/[...path].png.ts` — `getStaticPaths` из `publicPages()`.
5. `BaseLayout`: `og:title`, `og:description`, `og:type` (`website`/`article`/`profile`), `og:url`,
   `og:locale` (`ru_RU`/`en_US`), `og:site_name` (словарь), `og:image` (+`:type`, `:width`, `:height`, `:alt`),
   `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`,
   `twitter:image:alt` — все абсолютные по `Astro.site`.

## Done when
- [ ] `pnpm --filter @moscowcss/og test` → pass (размер PNG, кириллица) (AC-17)
- [ ] `pnpm build` → `file apps/website/dist/og/events/31.png` содержит `1200 x 630`, `file apps/website/dist/og/en/events/31.twitter.png` содержит `1200 x 600` (AC-17)
- [ ] `grep -c 'property="og:\|name="twitter:' apps/website/dist/events/31/index.html` ≥ 16 и `twitter:card` = `summary_large_image` (AC-16)
- [ ] `cmp packages/og/CLAUDE.md packages/og/AGENTS.md` → молчит
- [ ] `pnpm lint && pnpm test && pnpm build` → exit 0

## Must not
- скачивать шрифты или ставить пакеты-шрифты из npm; копировать TTF в `packages/og`
- импортировать корневой `@moscowcss/design-system` в og; глушить `onStyleError`
- коммитить (коммит делает conductor); трогать файлы вне `owns`

## Report
`plans/001-blog-like-architecture/tasks/reports/10-report.md` (приложить путь к 1-2 карточкам для глаза).
Вернуть conductor-у ТОЛЬКО: статус + строка + файлы + `contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
