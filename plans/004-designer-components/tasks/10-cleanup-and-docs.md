---
id: "10"
title: cleanup-and-docs
spec: "004"
criteria: ["AC-15", "AC-17"]
status: pending
depends_on: ["09"]
owns: ["packages/design-system/src/**", "apps/website/src/i18n/ui.ts", "apps/storybook/stories/**", "CLAUDE.md", "AGENTS.md", "packages/design-system/CLAUDE.md", "packages/design-system/AGENTS.md", "packages/ui/CLAUDE.md", "packages/ui/AGENTS.md", "packages/fonts/CLAUDE.md", "packages/fonts/AGENTS.md", "packages/content/CLAUDE.md", "packages/content/AGENTS.md", "apps/website/CLAUDE.md", "apps/website/AGENTS.md"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Неиспользуемые токены и ключи словаря удалены, истории есть у всех изменённых компонентов, документация описывает новые токены и коллекцию.

## Context (grounded — executor needs NO extra search)
- Кандидаты на удаление в `packages/design-system/src/spacing.ts`: `tgLinkButton*`, `burgerIconCompact`, `navLogo*`, `heroLogo*`, `heroCta*`, `cardWidthMobile`, `cardWidthLaptop`, `cardPadding*`, `cardSliderArrow`; в `scale.ts`: `heroTitle`, `heroLightLabel`, `heroMeetupLine`, `heroInfoLine`, `heroCtaLabel`, `navLink`, `registration`; в `ui.ts`: `nav.telegram`, `hero.registration`, если нет потребителей.
- Перед удалением проверять потребителя: `grep -rn "<имя>" packages apps --include=*.ts --include=*.astro --exclude-dir=node_modules --exclude-dir=dist`.
- `CLAUDE.md:§5` — описание токенов, `§9` — коллекции, `§4` — `new:*`, `§8` — шрифты. У каждого `CLAUDE.md` есть байт-идентичный `AGENTS.md`.
- Требуемые истории: `Button`, `CallToAction`, `CardSlider`, `Card`, `BlockTitle`, `NavBar`, `TagPile`, `OrganizerCard`.

## Steps
1. Удалить неиспользуемое, проверив каждого потребителя.
2. Добрать недостающие истории; в них текст пропами.
3. Обновить документы: срезы `motion` и `adaptive`, ступень `wide`, коллекция `organizers`, `pnpm new:organizer`, поле `tags`, шрифты Jost и Golos Text, новые компоненты. Держать пары `CLAUDE.md` и `AGENTS.md` одинаковыми.

## Done when (verification handle — the CONDUCTOR checks these, not the worker)
- [ ] `pnpm build:storybook` зелёный и `ls apps/storybook/stories/{Button,CallToAction,CardSlider,Card,BlockTitle,NavBar,TagPile,OrganizerCard}.stories.ts` находит все файлы (AC-15)
- [ ] `grep -rn "/\*\*" packages/ui/src/components/TagPile/TagPile.astro packages/ui/src/components/OrganizerCard/OrganizerCard.astro` находит JSDoc каждого пропа (AC-15)
- [ ] `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm --filter website check:seo` зелёные (AC-17)
- [ ] `git status --short Components.md design temp` показывает их только как неотслеживаемые или игнорируемые, `git log main..HEAD --name-only` их не содержит (AC-17)
- [ ] `for f in CLAUDE.md packages/design-system/CLAUDE.md packages/ui/CLAUDE.md apps/website/CLAUDE.md; do cmp "$f" "${f%CLAUDE.md}AGENTS.md"; done` без различий
- [ ] `grep -rn "heroCtaWidth\|tgLinkButton\|cardWidthLaptop" packages apps --include=*.ts --include=*.astro --exclude-dir=node_modules --exclude-dir=dist` пуст (AC-17)

## Must not
- удалять токен, у которого есть потребитель
- менять поведение компонентов
- коммитить `Components.md`, `design/`, `temp/`

## Report
Write the full result to `plans/004-designer-components/tasks/reports/10-report.md`. Return to the conductor ONLY:
status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT) + one-line summary + files touched (must be
within `owns`) + `contract: <digest>` copied from the contract file's frontmatter.
