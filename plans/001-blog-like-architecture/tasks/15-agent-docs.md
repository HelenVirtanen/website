---
id: "15"
title: update-agent-and-package-docs
spec: "001"
criteria: ["AC-2"]
status: pending
depends_on: ["14"]
owns: ["CLAUDE.md", "AGENTS.md", "apps/*/CLAUDE.md", "apps/*/AGENTS.md", "packages/*/CLAUDE.md", "packages/*/AGENTS.md", "packages/fonts/README.md"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Корневые и пакетные `CLAUDE.md`/`AGENTS.md` описывают новую архитектуру (контент-пакет, og, i18n,
модель шкалы, тесты, команды), пары пакетных файлов побайтно одинаковы.

## Context (grounded)
- Корневой `CLAUDE.md`: §1 (дерево репо), §4 (таблица скриптов: `new:speaker|event|report` — устарели),
  §5 (описывает «t-shirt scale … bumps `m`/`l`/`xxl` on wide screens» — больше не так; модель — ADR-002:
  таблицы `scale.ts`, постоянные `padding`/`spacing`, лестницы `layout.inset/gap`, корень `max(100%, 100vw / 120)`,
  rem вместо px), §7-§10, §12 (добавить `pnpm test`, `check:seo`). Корневой `AGENTS.md` — короткий указатель
  на `CLAUDE.md` (не близнец), обновить список пакетов и команд.
- Пакетные пары: `apps/{website,storybook}`, `packages/{design-system,ui,icons,fonts,eslint-config,typescript-config,content,og}`.
- Источник правды по решениям: `specs/001-blog-like-architecture.md`, `adr/001-*.md`, `adr/002-*.md`,
  `plans/001-blog-like-architecture/plan.md`. `packages/fonts/README.md` — упомянуть TTF для og и их источник.
- Markdown — по-английски (корневой `CLAUDE.md` §14).

## Steps
1. Прочитать текущий текст каждого раздела, затем править; ссылки на ADR/спеку вместо пересказа.
2. Пакетные файлы: править `CLAUDE.md`, затем `cp CLAUDE.md AGENTS.md` (заголовок в обоих одинаков).

## Done when
- [ ] `for d in apps/* packages/*; do [ -f $d/CLAUDE.md ] && { cmp -s $d/CLAUDE.md $d/AGENTS.md || echo "DIFF $d"; }; done` → ничего не печатает, и у `packages/content`, `packages/og` пары есть (AC-2)
- [ ] `grep -n "packages/content\|packages/og\|i18n" CLAUDE.md` → есть в дереве §1 (AC-2)
- [ ] `grep -n "bumps\|new:report\|new:speaker" CLAUDE.md AGENTS.md` → пусто
- [ ] `grep -n "pnpm test\|check:seo\|100vw / 120" CLAUDE.md` → все есть
- [ ] `pnpm lint` → exit 0

## Must not
- менять правила, не связанные с архитектурой спеки (зависимости, комментарии, коммиты)
- коммитить (коммит делает conductor); трогать файлы вне `owns`

## Report
`plans/001-blog-like-architecture/tasks/reports/15-report.md`. Вернуть conductor-у ТОЛЬКО: статус + строка +
файлы + `contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
