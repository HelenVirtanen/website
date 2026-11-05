---
id: "03"
title: pages-nav-seo
spec: "007"
criteria: ["AC-1", "AC-3", "AC-6"]
status: done
depends_on: ["01", "02"]
owns: ["apps/website/src/pages/[...locale]/events/index.astro", "apps/website/src/pages/[...locale]/talks/index.astro", "apps/website/src/pages/[...locale]/speakers/index.astro", "apps/website/src/components/ArchivePage*", "apps/website/src/archive/**", "apps/website/src/layouts/**", "apps/website/src/i18n/ui.ts", "apps/website/src/seo/**", "apps/website/src/agents/markdown*", "apps/website/src/agents/discovery*", "apps/website/src/sections/PastEventsSection*", "apps/website/scripts/**", "packages/ui/src/components/NavBar/**"]
model: opus
risk: contract
attempts: 0
---

## Goal
Три страницы списков на двух языках с фильтром, новой шапкой и полным SEO-набором.

## Context
- `apps/website/src/seo/pages.ts`: `publicPagesOf`, виды страниц; `layouts/nav.ts`: ссылки шапки.
- `agents/markdown.ts`, `agents/discovery.ts`, `seo/og.ts`, `seo/jsonld.ts`, `scripts/seo-checks.mjs`.

## Steps
1. Вид страницы `list` в `publicPagesOf`; маршруты `index.astro` трёх разделов; клиентский фильтр.
2. Шапка из пяти ссылок с `aria-current`; ссылки на списки под прошлыми митапами.
3. OG, JSON-LD `CollectionPage`, Markdown-версии, `llms.txt`, `check:seo`.

## Done when
- [ ] `pnpm build && pnpm --filter website check:seo` зелёные, в `dist` есть шесть страниц списков с `index.md`: AC-1.
- [ ] Ссылки шапки в `dist/index.html` и `dist/en/index.html` — пять, без `#`: AC-6.
- [ ] Карточки спикеров в `dist/speakers/index.html` ведут на `/speakers/<имя>/`, у каждой фото и не больше трёх меток: AC-3.

## Must not
- менять разметку секций главной, кроме блока прошлых митапов.
