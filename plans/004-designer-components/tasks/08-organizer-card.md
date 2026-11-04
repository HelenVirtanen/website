---
id: "08"
title: organizer-card
spec: "004"
criteria: ["AC-14", "AC-19"]
status: pending
depends_on: ["01", "07"]
owns: ["packages/ui/src/components/OrganizerCard/**", "packages/ui/src/index.ts", "apps/storybook/stories/OrganizerCard.stories.ts", "apps/website/src/sections/OrganizersSection.astro", "apps/website/src/sections/OrganizersSection.css.ts", "apps/website/src/pages/[...locale]/index.astro", "apps/website/src/content/catalog.ts", "apps/website/src/content/organizers.ts", "apps/website/src/content/**/*.test.ts", "apps/website/src/test/fixtures.ts", "apps/website/scripts/new-entry.mjs", "apps/website/scripts/*.test.*", "package.json", "packages/content/src/schema.ts", "packages/content/src/collections.ts", "packages/content/src/organizers/**", "packages/content/src/assets/organizer-*", "packages/content/templates/**", "packages/content/README.md"]
model: sonnet
risk: data
attempts: 0
---

## Goal
Организаторы собираются при сборке из Markdown-файлов новой коллекции с полями `status` и `contacts`, а на главной после ЧАВО выводятся карточки текущих.

## Context (grounded — executor needs NO extra search)
- `packages/content/src/schema.ts:133-141` — образец схемы с картинкой (`createSpeakerSchema(image)`, `photo`, `photoAlt` и `.refine`), `url` — проверенный `https`-адрес; `collections.ts:28-31` — регистрация.
- `apps/website/src/content/catalog.ts:48,74-77,211-223,305-311` — тип, независимые от языка поля, проверка перевода, загрузка. Независимые поля организатора: `status`, `photo`, `contacts`, `order`.
- `apps/website/scripts/new-entry.mjs:21-27` `KINDS`, `package.json:14-19` — новый вид `organizer` и скрипт `new:organizer`; шаблоны `packages/content/templates/{ru,en}/organizer.md`, `draft: true`.
- Поля записи: `name`, `status: z.enum(['current', 'past'])` (обязательно), `photo` и `photoAlt` (фото необязательно, без него карточка с инициалами не нужна: блок фото не выводится), `regalia: string[]` (необязательно), `contacts: { telegram?, github?, website? }` (все `url`, объект необязателен), `order`, `draft`.
- Запись `packages/content/src/organizers/{ru,en}/roman-troitsky.md`. `ru`: Роман Троицкий; `руководитель направления исследования данных в ПАО Сбербанк`, `ex-Senior Frontend Developer`, `член программного комитета HolyJS`. `en`: Roman Troitsky; `Head of data research at Sberbank`, `ex-Senior Frontend Developer`, `HolyJS program committee member`. `status: current`; `contacts.telegram: https://t.me/DreamShaded`, `contacts.website: https://vzhyx.io`, `github` не заполнять.
- Фото: `temp/figma/org-photo.png` (813×630, RGBA), маски `temp/figma/org-mask-1.svg`, `org-mask-2.svg`; из макета: картинка 406.481×314.637 в кадре со смещением `left -63.61, top 2.89`, маска 1 размером 249.231 в `66.955, 0.436`, маска 2 размером 244.295×293.006 в `95.313, 29.306` (координаты картинки, обе маски применяются разом), поворот кадра 0.61°. Собрать один раз через `sharp` в `packages/content/src/assets/organizer-roman-troitsky.png` с прозрачностью и размером кадра 249.231 ×2. Скрипт сборки не коммитить.
- Новый модуль `apps/website/src/content/organizers.ts` без зависимости от `astro:content`:
  - `organizersByStatus(entries, status)` — без черновиков, по `order`; им позже воспользуется страница о митапе;
  - `contactsOf(contacts)` → список `{ kind, href, text }` в порядке `telegram`, `github`, `website`, только заполненные. Текст: `t.me/x` → `@x`; `github.com/x` → `x`; сайт → хост без `www.` и без последнего слэша.
- Подписи контактов: `t('organizer.contact.telegram')`, `.github`, `.website`.
- Карточка: фон `vars.color.surfaceDark`, текст `vars.color.onSurfaceDark`, колонка по центру, поля сверху и снизу `vars.size.organizerPadding`, промежуток `vars.adaptive.organizerGap`. Фото: квадрат `vars.size.organizerPhoto`, подложка `vars.color.speakerAccent` с `clip-path: dimensions.octagon`, `img` поверх в том же квадрате, контур уже в маске файла.
- Контент: поля `vars.size.organizerPadding`, колонка; имя `/ {name}` шрифт `cardTitle`+`cardTitleLine`, `uppercase`; регалии списком с `>` через `::before`, шрифт `cardBody`+`cardBodyLine`, между именем и списком `vars.spacing.l`; контакты справа столбиком, ссылка цвета `speakerAccent`, цель не меньше `vars.size.hitTarget` по высоте. Карточка `width: 100%`, ширину даёт секция: до `tablet` 100%, от `tablet` до `wide` 25.8125rem (413px), от `wide` 35.8125rem (573px), карточки в строку с переносом.

## Steps
1. Схема, коллекция, каталог с тестом на расхождение полей между языками по фикстурам (`src/test/fixtures.ts`), генератор с тестом.
2. `organizers.ts` и `organizers.test.ts`: выборка по статусу, черновик исключён, порядок; контакты все, часть, ни одного; разбор всех трёх видов адреса.
3. Собрать фото, записи `ru` и `en`.
4. `pnpm new:component`, карточка с пропами `name`, `regalia`, `contacts: { href, label, text }[]` и слотом `photo`; JSDoc по-русски; истории: все контакты, один контакт, без контактов, без фото.
5. Секция с `BlockTitle` `t('organizers.title')`, `data-visual="organizers"`, после `FAQSection` в `index.astro`, только `status: current`; без текущих секции нет.

## Done when (verification handle — the CONDUCTOR checks these, not the worker)
- [ ] `pnpm build` зелёный; `grep -c "Роман Троицкий" apps/website/dist/index.html` ≥ 1 и `grep -c "Roman Troitsky" apps/website/dist/en/index.html` ≥ 1, порядок: `data-visual="faq"` раньше `data-visual="organizers"` (AC-14)
- [ ] `pnpm new:organizer test-org` создаёт два файла с `draft: true`, после удаления их `git status --short packages/content/src/organizers` показывает только настоящие записи (AC-14)
- [ ] `pnpm --filter website test`: тесты на выборку `current` и `past`, исключение черновика и расхождение `status` между языками зелёные (AC-14)
- [ ] `pnpm --filter website test`: тест `contactsOf` даёт `@DreamShaded`, `vzhyx.io` и пустой список без контактов (AC-19)
- [ ] `grep -c "t.me/DreamShaded" apps/website/dist/index.html` ≥ 1, `grep -c "vzhyx.io" apps/website/dist/index.html` ≥ 1, `grep -c "github.com" apps/website/dist/index.html` не вырос из-за карточки: контакта GitHub у записи нет (AC-19)
- [ ] `grep -n "dimensions.octagon" packages/ui/src/components/OrganizerCard/OrganizerCard.css.ts` находит форму, `ls packages/content/src/assets/organizer-roman-troitsky.png` есть (AC-14)
- [ ] `pnpm lint`, `pnpm test`, `pnpm --filter website check:seo` зелёные

## Must not
- выдумывать других организаторов и их данные
- создавать страницу о митапе или менять `documents/*/about.md`
- вызывать сетевые сервисы для фото: только файлы из `temp/figma`
- ослаблять существующие проверки каталога
- оставлять в коде литералы текста

## Report
Write the full result to `plans/004-designer-components/tasks/reports/08-report.md`. Return to the conductor ONLY:
status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT) + one-line summary + files touched (must be
within `owns`) + `contract: <digest>` copied from the contract file's frontmatter.
