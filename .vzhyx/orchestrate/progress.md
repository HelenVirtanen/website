# flow ledger — spec 001 blog-like-architecture

Workspace: shared tree /home/r/common/0work/website-2.0, branch feat/blog-like-architecture (no worktree: waves are width 1, conductor commits each verified task on the branch).
Engine: direct agent dispatch (sequential, width 1); script engine not used — layout has no parallelism to gain.
Baseline: pnpm lint → 0, pnpm build → 0 (2026-11-03, before task 01).
Consent: spec 001 layout 240589bd agents 20
Ruling: reviewer at 4 checkpoints (after 04, 08, 12, 15) instead of per-task — user chose at Gate 3 — a defect may survive up to 4 tasks before review; per-task Done-when still verified by conductor.
Ruling: plans/ committed via !plans/ in repo .gitignore — user chose at Gate 3 — none.
Ruling: no CI cron (former AC-14) — user — past meetup shown as upcoming until next push.

## Tasks
- 01 visual-baseline: done (attempt 1) — 160 снимков, повтор 0%; concerns: ResizeObserver заглушён в capture (дрожь Swiper), чужие origin блокируются (карта пустая), стори mediatile placeholder высотой 1px.
Ruling: отчёты исполнителей пишутся в scratchpad и переносятся conductor-ом — owns-guard не пускает reports/ вне owns, а правка owns сделала бы согласие устаревшим — цена: один cp на задачу.
- 02 root-cleanup: done (attempt 1) — 20 файлов старой раскладки удалены.
- 03 scale-tables: done (attempt 1) — scale.ts + 12 тестов, корень max(100%,100vw/120), layout.inset/gap; визуал на desktop временно сдвинут до 04.
- 04 components-on-tokens: done (attempt 1 + conductor fix) — 49 замен на layout.inset/gap, size-токены колонок программы и аватара; снимки 160/160 = 0%.
Ruling: conductor сам заменил `--spacing-l` → `--layout-gap-l` в packages/ui/src/components/Card/CardSlider.client.ts:58 (вне owns 04, рантайм-чтение CSS-переменной по имени, план его не увидел) — правка в 1 строку, без перенарезки — цена: если таких чтений больше, их поймают снимки (grep '--spacing-|--padding-' пуст).
- 05 content-package: done (attempt 1 + conductor fixes) — @moscowcss/content: 6 коллекций ru/en на .md, схема zod, README для редакторов; en и «о митапе» написаны агентом — на вычитку.
Ruling: копии фото спикеров возвращены в apps/website/public/assets до задачи 08 — секции ещё читают /assets/*.jpg, без копий промежуточные коммиты дают 404 — conductor удалит копии после 08.
Ruling: подсказка «#вопросспикеру» убрана из тел events/{ru,en}/31.md conductor-ом — она общая для всех митапов, место ей в словаре (задача 08) — owns 08 не покрывает packages/content.
Ruling: venue.coordinates добавлено исполнителем 05 в схему (карта) — включено в инварианты перевода задачи 06.
- 06 catalog-validation: done (attempt 1 + conductor fix) — catalog.ts + 22 теста; conductor подключил `await loadCatalog()` в pages/index.astro (вне owns 06): без вызова валидатор не участвовал в сборке; проверено: битый спикер → build 1 с путём и именем, нет title → build 1 с путём и полем.
- review checkpoint 1 (01–04): Block → исправлено conductor-ом: [HIGH] Swiper пороги через matchMedia(media.*) + пересчёт gap/колонок на ресайзе (проверено 2560→1500/1280/1100/800: 4/4/3/1); [HIGH] capture.mjs пишет только внутрь .visual/; [MED] AC-19 — размеры hero/partner из dimensions в vars.size; [MED] тулинг: manifest.json, «НЕТ В БАЗЕ», режим --exact; [MED] тавтологичные тесты заменены сверкой каскада mediaOverrides с resolveAt. Снимки 160/160 — 0 пикселей (--exact).
Ruling: промежуточный коммит 1ba6d1a визуально сдвигает desktop до 3afe459 — не переписываем опубликованную историю ветки; рекомендовать squash-merge — цена: bisect внутри ветки неточен.
Ruling: SpeakerAvatar/Button меняют ступень токеном в собственном @media — допустимо (смена узла макета на брейкпоинте, как правило блога); AC-19 запрещает только литералы.
Deferred: устаревшая §5 в CLAUDE.md про растущие padding — задача 15; tools/visual не линтится turbo — отмечено, вне спеки.
- 07 i18n-layout: done (attempt 1) — ru `/` + en `/en/`, BaseLayout (canonical, 3 абсолютных hreflang), LocaleSwitcher, NavBar на пропсах; 27 тестов.
Ruling: AC-21 изменён в спеке на месте — шапка сайта исключена (AC-10 требует переключатель), секции снимаются со скрытой липкой шапкой; эталон переснят с dad0413 в отдельном worktree (manifest: dad0413, clean), старый эталон — .visual/baseline-v1. Снимки 07: все прежние 0 пикселей, расходятся только новые стори LocaleSwitcher (нет в базе).
Ruling: plop-шаблон component.css.ts.hbs исправлен conductor-ом (vars.padding.medium/vars.font.body не существуют) — иначе каждый new:component генерирует неcобираемый css.
