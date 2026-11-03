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
- 08 home-from-content: done (attempt 1 + conductor fix) — главная ru/en из контента и словаря, src/data удалён, Prose и LinkList; снимки с BUILD_NOW ≤0.0014% (FAQ), прод-сборка без регистрации и со ссылкой на /events/31/; 35 тестов.
Ruling: turbo.json build.env = [BUILD_NOW] (conductor) — strict env mode turbo отбрасывал переменную, снимки молча собирались с реальной датой; заодно переменная входит в ключ кэша.
Ruling: временные копии фото в apps/website/public/assets удалены — секции берут фото из контента.
Ruling: блоки «о митапе» и «прошлые митапы» стоят после Join — вставка выше сдвигала субпиксельную y секций и ломала паритет; порядок секций спека не задаёт — цена: «о митапе» внизу главной до редизайна.
Deferred → 09: JoinBlock/MapPlaceholder с русскими литералами на /en/, пустой href трансляции.
Deferred (вне спеки, отметить в итоге): внешние ссылки из Markdown без target/rel; логотип и QR партнёра зашиты под Звук; фото спикеров без оптимизации (photo.src).
- review checkpoint 2 (05–08): Block → исправлено conductor-ом (коммит после задачи 09, чтобы pre-commit собирал согласованное дерево):
  [HIGH] дата митапа: формат `date: 2026-07-09` + `time: "18:00"` по Москве (+03:00, без DST), дата со временем отклоняется — YAML молча читал время без пояса как UTC;
  [HIGH] /events/31/ → 404 до задачи 09: не вливать в master до её завершения;
  [MED] URL только https (javascript:/data:/http: отклоняются); тело файла: сырой HTML и javascript:-ссылки роняют сборку; пустое тело pages/talks/faq — ошибка;
  [MED] инварианты переводов + time, passportRequired, partners.url/handle, faq.order, pages.telegramUrl; README синхронизирован;
  [MED] title ≤70 / description 50–160 у pages; ЧЧ:ММ 00–23:59, интервал «наоборот» отклоняется;
  [MED] митап идёт ещё 4 ч после начала (EVENT_DURATION_MS) — пуш во время митапа не делает его прошедшим;
  [MED] apps/website/turbo.json build.cache=false — сборка зависит от текущей даты, turbo проигрывал вчерашний dist.
  Тесты: 41 (новые schema.test.ts + проверки тела/HTML/инвариантов/окна митапа).
Deferred → после 09: telegramUrl из контента вместо константы в BaseLayout; тег #вопросспикеру vs #moscowcss_questions (решает пользователь); битая ссылка https://t.me/@moscowcss в faq; pnpm test в deploy.yml — задача 14.
- 09 entity-pages: done (attempt 1 + conductor fixes) — /events/<n>/, /talks/<имя>/, /speakers/<имя>/ на ru/en, seo/pages.ts publicPages, JoinBlock/MapPlaceholder на пропсах; conductor: подписи карты из словаря в PartnerSection, строка трансляции без адреса — текст, дубль components/JoinSection слит в sections/JoinSection; тесты 54+11.
Ruling: Hero после исправления пустой ссылки сверяется с .visual/hero-09 (снят с этого состояния), AC-21 правлен на месте — diff задачи 09 показал отличие только в строке трансляции.
Deferred: фото спикеров обычным <img> — sharp не установлен у website; задача 10 ставит sharp (allowBuilds) — после неё можно перейти на <Image>, вне спеки.
- 10 og-cards: done (attempt 1) — @moscowcss/og (satori+sharp, Montserrat TTF из @moscowcss/fonts), карточки 1200×630/1200×600 для всех публичных страниц ru/en, 16 og/twitter-тегов, telegramUrl из контента; маршрут pages/og/[...path].ts (`.png` внутри параметра — Astro 7.0.6 с trailingSlash: 'always' ломал [...path].png.ts); sharp — прямая зависимость website.
- 11 pagefind-search: done (attempt 1) — pagefind после astro build, индекс ru+en, /search/ и /en/search/ (noindex, без pagefind-body); conductor проверил браузером: «Макушин» → /speakers/denis-makushin/ (+митап, доклад), en-выдача только /en/.
- 12 check-seo: done (attempt 1) — check:seo по dist: OK 18 HTML / 16 индексируемых; без карточки → exit 1 с путём страницы; 83 теста.
- 13 scaffolding: done (attempt 1 + conductor fix) — pnpm new:event|talk|speaker|partner|faq → черновики ru/en из packages/content/templates, конфликт → exit 1 без записи, plop-заглушки страниц убраны; заглушка фото спикера копируется из templates/placeholder-photo.jpg.
Ruling: conductor добавил draft в PartnerSchema и FaqSchema (+фильтр FAQ на главной, ошибка «опубликованный митап → партнёр-черновик», шаблоны с draft: true, README) — без этого `pnpm new:faq` + пуш выкатывал карточку-плейсхолдер на прод; 103 теста.
- review checkpoint 3 (09–12): Block → исправлено conductor-ом:
  [HIGH] XSS-фильтр Markdown обходился 4 формами (сноска, <javascript:>, [x](<javascript:>), &#106;avascript:) → hast-плагин satteri (интеграция markdownSafety): сырой HTML и href/src не https/mailto после разрешения URL роняют сборку; нарушения копятся и роняют build в astro:build:done (загрузчик контента ловит ошибку рендера и пишет только [ERROR]); loadCatalog требует rendered.html у непустых тел — иначе повторная сборка из кэша проходила с потерянным текстом. Проверено: все 5 форм → build 1 дважды подряд; `<dialog>` в коде проходит.
  [MED] ложное срабатывание RAW_HTML на коде — регулярки по исходнику удалены;
  [MED] описание в выдаче поиска: data-pagefind-meta="description[content]" на meta description (проверено по фрагментам индекса);
  [MED] сбой поиска: console.error + «поиск временно недоступен» на проде, текст про dev — только в DEV;
  [MED] check:seo: пустой dist / всё noindex → ошибка; og:locale сверяется с <html lang>;
  [MED] @moscowcss/og: ошибка типов satori исправлена, tsc --noEmit входит в test пакета.
Deferred (MED): несуществующая дата (2026-02-30) молча уезжает на соседний день — YAML разбирает дату до схемы; вне спеки, отметить в итоге. Minor: search.ts ищет input[name="q"] без учёта пропа name.
- 14 ci-deploy: done (attempt 1) — deploy.yml: push master/PR/dispatch, lint+test+build+check:seo+build:storybook, деплой Pages только не в PR, версии pnpm/Node из packageManager/.nvmrc (26 = LTS по nodejs.org/dist/index.json 2026-11-03), actions последних мажоров; docs/deploy.md (репо moscowcss-meetup/website, css.moscow, DNS); pre-commit + test; docs/ исключён из глобального gitignore.
- 15 agent-docs: done (attempt 1 + conductor fix) — корневые и пакетные CLAUDE/AGENTS под новую архитектуру, пары побайтно равны; conductor: !CLAUDE.md в .gitignore (глобальный ~/.gitignore_global прятал CLAUDE.md новых пакетов content и og). new:speaker в доках остаётся — команда существует.
