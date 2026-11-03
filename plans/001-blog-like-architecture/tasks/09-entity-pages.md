---
id: "09"
title: event-talk-speaker-pages
spec: "001"
criteria: ["AC-7", "AC-13"]
status: pending
depends_on: ["08"]
owns: ["apps/website/src/pages/**", "apps/website/src/seo/**", "apps/website/src/components/**", "apps/website/src/i18n/ui.ts", "packages/ui/src/components/**", "packages/ui/src/index.ts", "apps/storybook/stories/**"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Для каждого опубликованного митапа, доклада и спикера на каждом языке есть страница, а единый список
публичных страниц — источник маршрутов, OG-карточек и проверок.

## Context (grounded)
- Образец единого списка: `/home/r/common/0work/blog/apps/blog/src/seo/pages.ts:1-80` (`PublicPage`
  { entry, locale, path, slugParam, alternates }, `publicPages()`, `trimTrailingSlashes`).
- Каталог: `apps/website/src/content/catalog.ts` (`loadCatalog`, `scheduleOf`, `talksOfEvent`,
  `talksOfSpeaker`); i18n: `apps/website/src/i18n/index.ts` (`localizePath`, `useTranslations`).
- Маршруты с языком — как `apps/blog/src/pages/[...locale]/search.astro:16-20` (`locale` = `undefined` для ru).
- Компоненты для сборки страниц: `packages/ui/src/components/{H1,H2,H3,Paragraph,SpeakerAvatar,Card,LinkList,Prose,BlockTitle}`;
  новый компонент — только `pnpm new:component` (+стори, JSDoc). Стили страниц — `.css.ts` в
  `apps/website/src/components/` (НЕ в `src/pages`: `.ts` в pages Astro считает эндпоинтом), только
  `vars`/`media`, без `px`. Макетов у страниц нет — композиция из существующих компонентов.
- Фото — `<Image>` из `astro:assets`, `alt` из `photoAlt`.
- Хвосты задачи 08, которые закрывает эта задача (AC-11 на /en/): `packages/ui/src/components/JoinBlock` и
  `MapPlaceholder` содержат русский текст литералами — перевести на пропсы (JSDoc), строки передавать из
  словаря сайта; стори передают прежние русские значения (снимки стори не должны измениться). В Hero ссылка
  «Смотри трансляцию» рендерится с `href=""`, когда `streamUrl` нет, — не рендерить ссылку без адреса.
- Сравнение снимков после правок: `node tools/visual/compare.mjs --ignore site/navbar@ --ignore stories/components-localeswitcher --ignore stories/components-prose --ignore stories/components-linklist .visual/baseline .visual/<run>`
  при сборке `BUILD_NOW=2026-07-01 pnpm build` (в эталоне ссылка трансляции видна — если её скрытие
  меняет hero, это ожидаемо: зафиксировать в отчёте долю и причину, а не подгонять).

## Steps
1. `src/seo/pages.ts`: `publicPages()` для главной, митапов (`/events/<номер>/`), докладов
   (`/talks/<имя>/`), спикеров (`/speakers/<имя>/`) на каждом языке, без черновиков; `alternates` —
   версии того же пути в других языках. `pages.test.ts`: пути с `/en/`, alternates, черновик исключён.
2. `pages/[...locale]/events/[event].astro`: заголовок, дата, место, тело, расписание `scheduleOf`
   (доклад → ссылка на доклад и спикеров; перерыв — строкой).
3. `pages/[...locale]/talks/[talk].astro`: название, тело, митап (ссылка), спикеры (ссылки), запись/слайды.
4. `pages/[...locale]/speakers/[speaker].astro`: фото, имя, роль, био, все доклады `talksOfSpeaker` с
   митапами (ссылки).
5. Главная: элементы списка прошлых митапов ведут на их страницы. Все контентные страницы:
   `<main data-pagefind-body>` (для задачи 11), кроме главной.
6. Строки страниц — в словарь (обе локали).

## Done when
- [ ] `pnpm build` → существуют `apps/website/dist/events/31/index.html`, `dist/en/events/31/index.html`, `dist/talks/*/index.html` и `dist/en/talks/*/index.html` по числу докладов, `dist/speakers/daria-egorova/index.html` и `dist/en/speakers/daria-egorova/index.html` (AC-13)
- [ ] страница спикера в `dist` содержит ссылки на все его доклады и их митапы; тест `catalog.test.ts`/`pages.test.ts` со спикером на митапах 10 и 15 проходит (AC-7)
- [ ] `pnpm --filter website test` → pass
- [ ] `grep -rnE "[0-9]px" apps/website/src/components --include='*.css.ts' | grep -v '//'` → пусто
- [ ] `pnpm lint && pnpm build && pnpm build:storybook` → exit 0

## Must not
- писать стили литералами или в `style=""`; создавать компоненты руками
- дублировать связи (держать списки докладов у спикера/митапа во frontmatter)
- коммитить (коммит делает conductor); трогать файлы вне `owns`

## Report
`plans/001-blog-like-architecture/tasks/reports/09-report.md`. Вернуть conductor-у ТОЛЬКО: статус + строка +
файлы + `contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
