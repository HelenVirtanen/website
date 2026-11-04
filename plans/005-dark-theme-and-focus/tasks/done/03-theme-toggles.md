---
id: "03"
title: theme-toggles
spec: "005"
criteria: ["AC-3", "AC-4", "AC-5", "AC-6", "AC-7"]
status: done
depends_on: ["02"]
owns: ["packages/ui/src/components/**", "packages/icons/src/svg/**", "apps/website/src/layouts/**", "apps/website/src/i18n/**"]
model: opus
risk: contract
attempts: 0
---

## Goal
Тема выбирается без мелькания, кнопки темы и падающих фигур стоят в шапке значками, на телефоне в меню.

## Context
- `apps/website/src/layouts/BaseLayout.astro:98`: жёсткая светлая тема в разметке.
- `packages/ui/src/components/NavBar/NavBar.astro`, `DecorToggle/`, `FallingDecor/FallingDecor.client.ts`.

## Steps
1. Чистая логика темы с тестами и встроенный скрипт в `<head>`.
2. Компонент кнопки-значка, значки, подключение в шапку и меню.
3. Переключение фигур на кнопку, прежний ключ хранения.

## Done when
- [ ] `pnpm test` проходит, включая логику темы.
- [ ] В браузере выбор переживает перезагрузку, переполнения шапки нет на 375, 768, 1024, 1440, 1920.
- [ ] Закрыты AC-3, AC-4, AC-5, AC-6, AC-7: проверено тестами, гейтом и просмотром в браузере.

## Must not
- менять ключ `moscowcss-decor-off`;
- прятать пункты навигации или уменьшать зоны захвата ради места.
