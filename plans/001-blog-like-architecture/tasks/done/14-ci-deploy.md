---
id: "14"
title: github-actions-pages-deploy
spec: "001"
criteria: ["AC-22", "AC-23"]
status: done
depends_on: ["13"]
owns: [".github/workflows/deploy.yml", ".nvmrc", "docs/deploy.md", ".husky/pre-commit"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Workflow для репозитория `moscowcss-meetup/website` гоняет все проверки на push и PR и деплоит сайт с
поиском и карточками на GitHub Pages под `css.moscow`; настройка на стороне GitHub и DNS описана.

## Context (grounded)
- Текущий `.github/workflows/deploy.yml:1-60`: push `master` + dispatch, `pnpm/action-setup@v4` с
  `version: 11.9.0`, `actions/setup-node@v4` с `node-version: 20`, `pnpm lint`, `pnpm build`,
  `upload-pages-artifact@v3` (`apps/website/dist`), `deploy-pages@v4`.
- `package.json`: `packageManager` (pnpm 11.9.0), `engines.node >=20.16`. Корневые скрипты: `lint`, `test`,
  `build`, `build:storybook`; `check:seo` — `pnpm --filter website check:seo`.
- GitHub Docs (проверено 2026-11-03, «Managing a custom domain for your GitHub Pages site»): при
  публикации через свой Actions-workflow файл CNAME игнорируется и не нужен; апекс — A на
  185.199.108.153, .109, .110, .111 и (опционально) AAAA 2606:50c0:8000::153 … 8003::153.
- `.husky/pre-commit` сейчас: `pnpm lint && pnpm build`.

## Steps
1. `.nvmrc` — мажор текущего Node LTS: определить по `https://nodejs.org/dist/index.json` (первая запись с
   `lts` ≠ false); не ниже 20.16.
2. `deploy.yml`: `on: push (master)`, `pull_request`, `workflow_dispatch`; job `check` — checkout,
   `pnpm/action-setup` БЕЗ `version` (берёт `packageManager`), `setup-node` с `node-version-file: .nvmrc`
   и `cache: pnpm`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm test`, `pnpm build`,
   `pnpm --filter website check:seo`, `pnpm build:storybook`, затем `upload-pages-artifact` (только не в PR);
   job `deploy` — `needs: check`, `if: github.event_name != 'pull_request'`, `deploy-pages`.
   Версии actions — последние мажоры по их страницам релизов (проверить, записать в отчёт).
   Комментарии в YAML — по-русски.
3. `.husky/pre-commit` → `pnpm lint && pnpm test && pnpm build`.
4. `docs/deploy.md` (английский): целевой репозиторий `moscowcss-meetup/website`, Settings → Pages →
   Source «GitHub Actions», Custom domain `css.moscow` + Enforce HTTPS, DNS-записи, что CNAME-файл не нужен
   (ссылка на docs), что деплой — каждый push в `master`.

## Done when
- [ ] `grep -n "version:\|node-version:" .github/workflows/deploy.yml` → нет литералов версий pnpm/Node (только `node-version-file`) (AC-23)
- [ ] `grep -n "pull_request\|check:seo\|pnpm test\|build:storybook" .github/workflows/deploy.yml` → все четыре есть (AC-22, AC-23)
- [ ] YAML валиден: `node -e "require('yaml')"`-недоступно → `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy.yml'))"` → exit 0 (или `actionlint`, если установлен)
- [ ] `grep -n "css.moscow\|moscowcss-meetup/website\|185.199.108.153" docs/deploy.md` → все три есть (AC-23)
- [ ] локально та же последовательность `pnpm install --frozen-lockfile && pnpm lint && pnpm test && pnpm build && pnpm --filter website check:seo && pnpm build:storybook` → exit 0 (AC-22)

## Must not
- пушить, создавать репозиторий, менять настройки GitHub
- хардкодить версии pnpm/Node в workflow; коммитить (коммит делает conductor); трогать файлы вне `owns`

## Report
`plans/001-blog-like-architecture/tasks/reports/14-report.md`. Вернуть conductor-у ТОЛЬКО: статус + строка +
файлы + `contract: <digest>` из `plans/001-blog-like-architecture/contract.md`.
