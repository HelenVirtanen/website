---
id: "05"
title: verify
spec: "007"
criteria: ["AC-8"]
status: done
depends_on: ["03", "04"]
owns: ["apps/website/CLAUDE.md", "apps/website/AGENTS.md", "packages/ui/CLAUDE.md", "packages/ui/AGENTS.md"]
model: opus
risk: contract
attempts: 0
---

## Goal
Все проверки зелёные, документация агентов обновлена.

## Context
- Корневой `CLAUDE.md` §12, `tools/visual/README.md`.

## Steps
1. lint, test, build, check:seo, build:storybook, check:a11y, check-targets; визуальное сравнение главной.
2. Обновить `CLAUDE.md`/`AGENTS.md` сайта и ui.

## Done when
- [ ] Все команды AC-8 завершаются кодом 0.

## Must not
- ослаблять проверки ради зелёного прогона.
