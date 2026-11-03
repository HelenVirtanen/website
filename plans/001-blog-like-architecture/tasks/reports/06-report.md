# Задача 06 — отчёт

Статус: BLOCKED по одному пункту Done when (остальное выполнено).

Сделано (в owns):
- apps/website/vitest.config.ts (getViteConfig), скрипт "test", vitest 5.0.5 (pnpm add -D), pnpm-lock.yaml
- apps/website/src/content/catalog.ts: validateCatalog (CatalogError собирает все проблемы),
  loadCatalog (единственный getCollection), talksOfEvent, scheduleOf, talksOfSpeaker, upcomingEvent, pastEvents
- apps/website/src/test/fixtures.ts, apps/website/src/content/catalog.test.ts (22 теста, pass)
- packages/content/src/schema.ts не менялся.

Проверки:
- pnpm --filter website test: 22 passed (AC-4 логика, AC-5, AC-7, AC-12)
- AC-6: удаление title в talks/ru/anchor-and-popover.md -> build exit 1, вывод содержит путь
  packages/content/src/talks/ru/anchor-and-popover.md и "title: Required"; обёртка не нужна. Откачено.
- pnpm lint, pnpm build: exit 0.

НЕ выполнено: Done when п.2 (speakers: [nobody] роняет build). Сейчас loadCatalog() нигде не вызывается
при сборке (pages/index.astro не использует контент), поэтому build с `nobody` проходит (проверено, exit 0).
Нужна правка вне owns: `await loadCatalog()` в странице (apps/website/src/pages/index.astro или, после
задачи 07/08, в [...locale]/index.astro). Хук owns-guard отклонил правку index.astro; в обход не писал.
Решение: добавить вызов в owns задачи 06 (правка нарезки) или проверить п.2 после задачи 08.

Допущения/замечания (запись, не правки):
- Перевод без оригинала ru — ошибка; ru без en — не ошибка (языки публикуются независимо).
- Добавлены сверх спеки: проверка партнёра митапа в своём языке; публикованный доклад + черновой спикер — ошибка;
  сверка venue.coordinates (по уточнению в задаче).
- talksOfEvent/talksOfSpeaker/scheduleOf отдают только опубликованные доклады своего языка.
- В рабочем дереве есть чужие изменения (design-system, ui, tools/visual, sections/*.css.ts) — не мои.
- Контент после проверок откачен: git diff --quiet packages/content/src -> чисто.
