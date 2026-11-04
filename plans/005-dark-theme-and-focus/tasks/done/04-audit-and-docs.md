---
id: "04"
title: audit-and-docs
spec: "005"
criteria: ["AC-2", "AC-11", "AC-12"]
status: done
depends_on: ["03"]
owns: ["packages/ui/src/components/**/*.css.ts", "apps/website/src/**/*.css.ts", "apps/storybook/**", "**/CLAUDE.md", "**/AGENTS.md"]
model: opus
risk: contract
attempts: 0
---

## Goal
Все типы страниц читаемы в тёмной теме, в Storybook есть переключатель темы, документация обновлена.

## Context
- Страницы: главная, митап, доклад, спикер, поиск, 404. Плавающая кнопка видна только при `BUILD_NOW` до даты митапа.

## Steps
1. Просмотреть страницы на 375 и 1440 в тёмной теме, исправить найденное через токены.
2. Добавить тему в панель Storybook и истории кнопок.
3. Обновить документацию.

## Done when
- [ ] `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm --filter website check:seo`, `pnpm build:storybook` проходят.
- [ ] Просмотр страниц не показал нечитаемых элементов, QR остаётся тёмным на светлом.
- [ ] Закрыты AC-2, AC-11, AC-12: проверено тестами, гейтом и просмотром в браузере.

## Must not
- перекрашивать QR, OpenGraph-карточки и значки сайта;
- писать цвета мимо токенов.
