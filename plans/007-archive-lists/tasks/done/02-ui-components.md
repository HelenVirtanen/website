---
id: "02"
title: ui-components
spec: "007"
criteria: ["AC-3", "AC-5"]
status: done
depends_on: []
owns: ["packages/ui/src/components/SpeakerCard/**", "packages/ui/src/components/CardGrid/**", "packages/ui/src/components/ArchiveFilter/**", "packages/ui/src/components/SectionTabs/**", "packages/ui/src/components/ArchiveRow/**", "apps/storybook/stories/**", "packages/design-system/src/spacing.ts"]
model: opus
risk: contract
attempts: 0
---

## Goal
Компоненты списков в текущем дизайне: сетка карточек с общей рамкой, карточка спикера, строка архива, фильтр, переключатель списков.

## Context
- Макет: рамка 1px `color.border`, соседние рамки схлопываются, поля ~28px на 1920.
- Образцы: `packages/ui/src/components/LinkList`, `SearchField`, `Button`; правила `packages/ui/CLAUDE.md`.

## Steps
1. `CardGrid` + `SpeakerCard`; `ArchiveRow`; `ArchiveFilter` (форма, скрыта без JS); `SectionTabs`.
2. Сторис для каждого.

## Done when
- [ ] `pnpm lint` и `pnpm build:storybook` зелёные; сторис открываются: AC-3 (вид), AC-5 (фильтр `hidden` до скрипта).

## Must not
- сырые px, hex, брейкпоинты; текст-литералы в компонентах.
