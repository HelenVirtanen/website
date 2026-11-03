---
id: "01"
title: visual-regression-tooling-and-baseline
spec: "001"
criteria: ["AC-21"]
status: done
depends_on: []
owns: ["tools/visual/**", "package.json", "pnpm-lock.yaml", ".gitignore", "apps/website/src/sections/*.astro", "apps/website/src/pages/index.astro"]
model: sonnet
risk: contract
attempts: 0
---

## Goal
Воспроизводимые скриншоты секций главной и всех стори Storybook на 375/768/1024/1280/1920 и
базовый набор снимков текущего (неизменённого) сайта — эталон для всех последующих задач.

## Context (grounded)
- Репозиторий `/home/r/common/0work/website-2.0`, Turborepo + pnpm 11.9.0, Node 24. Правила — корневой
  `CLAUDE.md` (pnpm only, `pnpm add` без ручных версий, комментарии по-русски, коммиты НЕ делать).
- Главная: `apps/website/src/pages/index.astro:1-31` — `NavBar` + секции `HeroSection`, `ProgramSection`,
  `PartnerSection`, `FAQSection`, `JoinSection` (`apps/website/src/sections/*.astro`).
- `NavBar` пробрасывает атрибуты на корень (`packages/ui/src/components/NavBar/NavBar.astro:29-38`,
  `{...attrs}`), поэтому `data-visual="navbar"` ставится в `index.astro` на `<NavBar>`.
- Storybook: `apps/storybook`, `pnpm storybook` → dev на порту 6006 (`apps/storybook/package.json`
  scripts). `renderMode: 'server'` (`apps/storybook/.storybook/main.ts:61-66`) — стори рендерятся
  асинхронно в `#storybook-root`; список стори — `GET http://localhost:6006/index.json`, iframe —
  `/iframe.html?id=<id>&viewMode=story`.
- Сайт собирается `pnpm build` в `apps/website/dist`; превью — `pnpm --filter website preview`
  (`astro preview`, порт 4321 по умолчанию).
- Браузер: системный `/usr/bin/chromium` (есть). Браузеры НЕ скачивать (`playwright install` запрещён).
- Стиль node-скриптов: ESM, `node:`-импорты (пример — бывший `scripts/extract-partner-cards-wave.mjs:1-20`).
- Подробности задачи — `plans/001-blog-like-architecture/plan.md`, раздел «T01» и «Решения плана» п.6.

## Steps
1. `pnpm add -Dw playwright-core pixelmatch pngjs` (последние версии, exact — их пишет pnpm).
2. Добавить `data-visual="hero|program|partner|faq|join"` на корневой элемент каждой секции и
   `data-visual="navbar"` на `<NavBar>` в `index.astro`. Атрибуты не влияют на пиксели.
3. `tools/visual/capture.mjs <out-dir>`: (a) сайт — открывает `SITE_URL` (по умолчанию
   `http://localhost:4321/`), для каждой ширины 375/768/1024/1280/1920 ставит viewport, ждёт
   `document.fonts.ready`, снимает каждый `[data-visual]` в `<out>/site/<name>@<w>.png`; (b) Storybook —
   читает `${STORYBOOK_URL}/index.json` (по умолчанию `http://localhost:6006`), для каждой записи с
   `type: 'story'` открывает iframe, ждёт непустой `#storybook-root` и `fonts.ready`, снимает
   `#storybook-root` в `<out>/stories/<id>@<w>.png`. Браузер — `chromium.launch({ executablePath:
   process.env.CHROMIUM_PATH ?? '/usr/bin/chromium' })`, контекст с `reducedMotion: 'reduce'`,
   `deviceScaleFactor: 1`. Ошибки (нет сервера, таймаут стори) — ненулевой код с понятным сообщением.
   Скрипт сам серверы НЕ поднимает: их запускают перед ним (это описать в README).
4. `tools/visual/compare.mjs <base> <next>`: для каждого PNG базы ищет одноимённый в `next`;
   отсутствие или разный размер — ошибка; иначе pixelmatch (threshold 0.1), доля отличающихся пикселей;
   >0.1% — ошибка. Печатает таблицу файл → доля, итог; код выхода 1 при любой ошибке. Опционально пишет
   diff-PNG в `<next>/diff/`.
5. `tools/visual/README.md` (по-английски, Markdown): назначение, как поднять серверы, команды,
   переменные `SITE_URL`, `STORYBOOK_URL`, `CHROMIUM_PATH`.
6. `.visual/` в `.gitignore`. Собрать сайт (`pnpm build`), поднять превью и Storybook в фоне, снять
   `.visual/baseline`, затем повторный снимок в `.visual/check` и сравнить. Серверы погасить.

## Done when
- [ ] `ls .visual/baseline/site/*.png | wc -l` ≥ 30 и `ls .visual/baseline/stories/*.png | wc -l` ≥ 5 × число стори из `index.json` — эталон снимков секций и стори снят до изменений (AC-21)
- [ ] `node tools/visual/compare.mjs .visual/baseline .visual/check` → exit 0, все доли 0 — тулинг детерминирован (AC-21)
- [ ] `git status --short` показывает изменения только в `owns` и `.visual/` не отслеживается (`git check-ignore .visual` → `.visual`)
- [ ] `pnpm lint && pnpm build` → exit 0

## Must not
- менять стили, значения токенов или разметку секций, кроме добавления атрибутов `data-visual`
- скачивать браузеры (`playwright install`, пакет `playwright` с postinstall) или ставить зависимости через npm/yarn
- вписывать версии в `package.json` руками; коммитить (коммит делает conductor)
- трогать файлы вне `owns`

## Report
Полный результат — в `plans/001-blog-like-architecture/tasks/reports/01-report.md` (число снимков,
команды запуска серверов, замечания по стабильности стори). Вернуть conductor-у ТОЛЬКО: статус (DONE /
DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT) + одна строка + список изменённых файлов + `contract: <digest>`
из `plans/001-blog-like-architecture/contract.md`.
