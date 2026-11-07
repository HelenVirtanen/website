---
id: "01"
title: reviews-wall
spec: "008"
criteria: ["AC-1", "AC-2", "AC-3", "AC-4", "AC-5", "AC-6", "AC-7", "AC-8", "AC-9", "AC-10"]
status: done
depends_on: []
owns: ["packages/content/src/reviews/**", "packages/ui/src/components/Review*/**", "apps/website/src/components/ReviewsPage*", "apps/website/src/content/reviews*", "apps/website/src/pages/[...locale]/reviews/**"]
model: opus
risk: none
attempts: 0
---

## Goal
Стена отзывов: коллекция, генератор, стикеры, окно с адресом `?review=`, страница, ссылки, SEO и Markdown для агентов.

## Context
Задачи связаны одной поверхностью записи (каталог, список страниц, словарь), поэтому выполнены одной задачей и одним исполнителем.

## Steps
Реализовано и проверено в браузере и в шлюзах проекта.

## Done when
- `pnpm lint`, `pnpm test`, `pnpm build`, `check:seo`, `build:storybook`, `check:a11y`, `check-targets` зелёные.

## Must not
Придуманные отзывы на сайте; правка русского текста авторов; ослабление шлюзов.
