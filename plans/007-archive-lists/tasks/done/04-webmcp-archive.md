---
id: "04"
title: webmcp-archive
spec: "007"
criteria: ["AC-7"]
status: done
depends_on: ["01", "03"]
owns: ["apps/website/src/agents/webmcp.ts", "apps/website/src/agents/webmcp.test.ts", "apps/website/src/pages/[...locale]/archive.json.ts"]
model: opus
risk: none
attempts: 0
---

## Goal
`/archive.json` на язык и WebMCP-инструмент `list_archive`, фильтрующий его той же функцией.

## Context
- `apps/website/src/agents/webmcp.ts`: `siteTools`, `ToolEnvironment`.
- Эндпоинт с расширением под `[...locale]` берёт язык из `url.pathname` (баг Astro 7, как `rss.xml.ts`).

## Steps
1. Эндпоинт `archive.json`; инструмент `list_archive` с `inputSchema`; тесты на фейках.

## Done when
- [ ] `pnpm --filter website test -- webmcp` зелёный; `dist/archive.json` и `dist/en/archive.json` разного языка: AC-7.

## Must not
- выходить за свой origin; добавлять в JSON поля, которых нет на страницах.
