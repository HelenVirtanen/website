---
id: "02"
title: remove-legacy-root-layout
spec: "001"
criteria: ["AC-1"]
status: pending
depends_on: ["01"]
owns: ["src/**", "public/**", "scripts/**", "astro.config.mjs", "tsconfig.json", "gitignore", "npmrc", "apps/website/src/Новая папка/**", "moscowcss-site.code-workspace"]
model: sonnet
risk: migration
attempts: 0
---

## Goal
В корне репозитория нет файлов старой одностраничной раскладки и мусора; сборка и линт остаются зелёными.

## Context (grounded)
- Дубли старой раскладки в корне: `src/` (data, pages, sections, styles — устаревшие копии
  `apps/website/src`, сверено `diff -rq src apps/website/src`), `public/assets/partner-cards-wave.svg`,
  `scripts/extract-partner-cards-wave.mjs` (читает несуществующий `packages/icons/src/svg/menucards.svg` —
  мёртвый), `astro.config.mjs` (корневой Astro-конфиг без сайта), `tsconfig.json` (для корневого `src`).
- `gitignore` и `npmrc` без точки — копии `.gitignore`/`.npmrc` (`.npmrc` и `.gitignore` остаются!).
- `apps/website/src/Новая папка/` — три jpg-дубля фото спикеров из `apps/website/public/assets/`.
- Корневой `eslint.config.js` ОСТАЁТСЯ (линтит `tools/`).
- `apps/website/src/data/` в этой задаче НЕ удаляется — он переезжает в контент позже.

## Steps
1. `git rm -r --quiet src public scripts astro.config.mjs tsconfig.json gitignore npmrc "apps/website/src/Новая папка"`.
2. Проверить `moscowcss-site.code-workspace`: если ссылается на удалённые пути — убрать эти записи.
3. `grep -rn "extract-partner-cards-wave\|menucards" --exclude-dir=node_modules --exclude-dir=plans --exclude-dir=specs .` — убедиться, что ссылок не осталось.

## Done when
- [ ] `git ls-files src public scripts astro.config.mjs tsconfig.json gitignore npmrc "apps/website/src/Новая папка"` → пусто — старая раскладка убрана (AC-1)
- [ ] `test -f .gitignore && test -f .npmrc && test -f eslint.config.js && test -f apps/website/public/assets/partner-cards-wave.svg` → exit 0
- [ ] `pnpm lint && pnpm build` → exit 0

## Must not
- удалять `.gitignore`, `.npmrc`, `eslint.config.js`, `apps/website/public/**`, `apps/website/src/data/**`
- трогать файлы вне `owns`; коммитить (коммит делает conductor)

## Report
Полный результат — в `plans/001-blog-like-architecture/tasks/reports/02-report.md`. Вернуть conductor-у
ТОЛЬКО: статус + одна строка + изменённые файлы + `contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
