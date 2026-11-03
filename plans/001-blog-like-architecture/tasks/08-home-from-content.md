---
id: "08"
title: home-page-from-content-and-dictionary
spec: "001"
criteria: ["AC-1", "AC-3", "AC-11", "AC-12", "AC-21"]
status: pending
depends_on: ["07"]
owns: ["apps/website/src/pages/**", "apps/website/src/sections/**", "apps/website/src/data/**", "apps/website/src/i18n/ui.ts", "apps/website/src/styles/**", "apps/website/src/content/**", "packages/ui/src/components/Prose/**", "packages/ui/src/components/LinkList/**", "packages/ui/src/components/Card/**", "packages/ui/src/index.ts", "apps/storybook/stories/Prose.stories.ts", "apps/storybook/stories/LinkList.stories.ts"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Главная на обоих языках собирается из контента и словаря: «о митапе», ближайший митап нынешними секциями,
список прошлых; `apps/website/src/data` удалён; русская главная совпадает с эталоном.

## Context (grounded)
- Каталог: `apps/website/src/content/catalog.ts` (задача 06) — `loadCatalog`, `upcomingEvent(events, now)`,
  `pastEvents`, `scheduleOf`, `talksOfEvent`. Словарь: `apps/website/src/i18n/ui.ts`.
- Секции сейчас читают `../data/*` (`HeroSection.astro:1-4`, `ProgramSection.astro`, `PartnerSection.astro`)
  и держат литералы: `HeroSection.astro:56-61` («Регистрация», «Для онлайн просмотра регистрация не нужна»,
  «Смотри трансляцию»), `FAQSection.astro:10-45` («ЧАВО», ответы), `JoinSection.astro`, `ProgramSection.astro`.
- Строка даты должна остаться ровно «9 июля 2026 в 18:00»: шаблон словаря `'{day} {year} в {time}'`,
  `day` = `Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', timeZone: 'Europe/Moscow' })`,
  `time` — `HH:MM` в Europe/Moscow; en — свой шаблон.
- `.md` в Astro не поддерживает подмену тегов компонентами (`components` — только MDX), поэтому стили
  тела задаёт контейнер-рендерер: новый компонент `Prose` (`pnpm new:component`), `globalStyle` для
  `${root} p`, `a`, `ol`, `ul`, `li`, `strong` на токенах. Подобрать так, чтобы FAQ-карточки совпали с
  эталоном (сейчас ответы — инлайн-текст с `<br>` прямо в `Card`, `Card.astro:18-24`).
- Митап 31 прошёл (сегодня 2026-11-03), по AC-12 главная показывает его как прошедший. Для снимков паритета
  сборка читает `BUILD_NOW` (ISO-дата; по умолчанию — реальное время): `BUILD_NOW=2026-07-01 pnpm build`.
- Тело `events/<lang>/31.md` сейчас: строка-подсказка про тег `#вопросспикеру` + раздел «Как добраться». Подсказка одинакова для всех митапов — conductor уже убрал её из тел обоих языков; текст для словаря (`program.hint`) взять из `git show HEAD~0:apps/website/src/data/schedule.ts` (`scheduleHint`) и его перевода. Тело митапа = «Как добраться», его рендерит партнёрская секция там, где сейчас `partnerDirectionsHint` (проверить `PartnerSection.astro`), через `Prose`.
- Фото спикеров лежат в `packages/content/src/speakers/assets/` (через `image()`); копии в `apps/website/public/assets/*.jpg` временные и удаляются conductor-ом после этой задачи — секции должны брать фото из контента.
- Новые компоненты — `pnpm new:component` (`LinkList` для прошлых митапов: заголовок + ссылки с подписью-датой).

## Steps
1. `pages/[...locale]/index.astro`: `now = process.env.BUILD_NOW ? new Date(BUILD_NOW) : new Date()` (с
   проверкой валидности даты, русским комментарием «только для визуальных снимков»), блок «о митапе»
   (`<Content />` страницы в `Prose`), секции с пропами из `upcomingEvent`, `LinkList` прошлых митапов.
2. Секции получают данные пропсами (типы из схем контента), строки — из `t()`. При `past` — без
   `CallToAction` регистрации, ссылка на запись, если `recordingUrl` есть.
3. FAQ: файлы `faq/<lang>/*.md` по `order`, тело каждого — `<Content />` внутри `Prose` внутри `Card`.
4. `git rm -r apps/website/src/data`.
5. `BUILD_NOW=2026-07-01 pnpm build`, превью + Storybook, `capture` в `.visual/t08`, `compare` с базой.

## Done when
- [ ] `git ls-files apps/website/src/data` → пусто (AC-1)
- [ ] `grep -rnP "[А-Яа-яЁё]" apps/website/src/sections apps/website/src/pages apps/website/src/layouts --include='*.astro' | grep -v '//\|{/\*'` → пусто — текст только из словаря и контента (AC-11)
- [ ] `BUILD_NOW=2026-07-01 pnpm build` + снимки → `node tools/visual/compare.mjs --ignore site/navbar@ --ignore stories/components-localeswitcher .visual/baseline .visual/t08` exit 0, каждая доля ≤ 0.1% — русская главная показывает тот же текст и вид (AC-3, AC-21)
- [ ] `pnpm build` (реальная дата) → `grep -c "timepad" apps/website/dist/index.html` = 0 и в `dist/index.html` есть ссылка на `/events/31/` в списке/блоке прошедшего митапа — прошедший митап без регистрации (AC-12)
- [ ] `apps/website/dist/en/index.html` содержит английские строки секций (например, перевод «Регистрация» нет, т.к. прошёл; заголовок FAQ на английском)
- [ ] `pnpm lint && pnpm test && pnpm build:storybook` → exit 0

## Must not
- менять значения токенов или стили секций ради паритета (кроме стилей нового `Prose`)
- поднимать порог сравнения; использовать `BUILD_NOW` где-либо кроме выбора `now`
- коммитить (коммит делает conductor); трогать файлы вне `owns`

## Report
`plans/001-blog-like-architecture/tasks/reports/08-report.md` (таблица долей). Вернуть conductor-у ТОЛЬКО:
статус + строка + файлы + `contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
