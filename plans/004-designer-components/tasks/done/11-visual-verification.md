---
id: "11"
title: visual-verification
spec: "004"
criteria: ["AC-1", "AC-10", "AC-18"]
status: done
depends_on: ["10"]
owns: ["tools/visual/capture.mjs", "tools/visual/README.md"]
model: sonnet
risk: none
attempts: 0
---

## Goal
Снимки главной на 375, 768, 1440 и 1920 совпадают с макетом, а падение плашек, масштаб корня и плавающая кнопка проверены в браузере.

## Context (grounded — executor needs NO extra search)
- `tools/visual/capture.mjs:11` — `WIDTHS`, добавить 1440. `tools/visual/README.md` — список ширин и запуск серверов.
- Эталоны Figma в чате дирижёра: эту задачу выполняет сам дирижёр встроенным браузером.

## Steps
1. Добавить ширину 1440 в инструмент и README.
2. `pnpm build`, `pnpm --filter website preview`, снять главную на четырёх ширинах, сверить шапку, Hero, ЧАВО, карточку организатора с макетом, поправить расхождения в компонентах отдельным коммитом.
3. Перезагрузить страницу дважды и сравнить порядок и цвета плашек; проверить отсутствие горизонтальной прокрутки на 375.
4. Эмулировать `prefers-reduced-motion` и отключённый JS: плашки на месте.
5. Вычислить кегль корня на 1024 и на 3840 окне.
6. `BUILD_NOW=2026-07-01` со ссылкой на регистрацию: кнопка на белом чёрная, на тёмной секции белая, при наведении синяя. Пересобрать без `BUILD_NOW`.

## Done when (verification handle — the CONDUCTOR checks these, not the worker)
- [ ] `grep -n "1440" tools/visual/capture.mjs` находит ширину (AC-18)
- [ ] Снимки на 375, 768, 1440, 1920 сверены с макетом, расхождения исправлены или вынесены в итог (AC-18)
- [ ] Две загрузки дают разный порядок или цвета плашек, при сниженной анимации плашки статичны (AC-10)
- [ ] В браузере корень на 1024 равен кеглю браузера и 32px на окне 3840 (AC-1)

## Must not
- коммитить `.visual/` и сборку с `BUILD_NOW`
- подгонять снимки вместо кода

## Report
Write the full result to `plans/004-designer-components/tasks/reports/11-report.md`. Return to the conductor ONLY:
status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT) + one-line summary + files touched (must be
within `owns`) + `contract: <digest>` copied from the contract file's frontmatter.
