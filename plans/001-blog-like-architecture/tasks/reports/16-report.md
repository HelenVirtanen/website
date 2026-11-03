# 16 — финальная верификация (ветка feat/blog-like-architecture, b7fcc93)

Логи: scratchpad/logs/. Код не правился, не коммитилось; рабочее дерево чистое. Порты 4321/6006/24678 свободны, dist пересобран обычным `pnpm build` (прод, без BUILD_NOW).

## Шаг 1 (чистый прогон; также с --force, чтобы не брать из кэша turbo)
| команда | exit |
|---|---|
| pnpm install --frozen-lockfile | 0 |
| pnpm lint (--force тоже) | 0 |
| pnpm test (--force: design-system 1 файл, website 10, og 1) | 0 |
| pnpm build (--force) | 0 |
| pnpm --filter website check:seo | 0: "OK — 18 HTML, индексируемых 16" |
| pnpm build:storybook (--force) | 0 |

## Снимки (AC-21)
- capture .visual/final: сайт 30 снимков, Storybook 220 снимков / 44 стори.
- Команда из Done-when дословно: exit 1, "файлов: 190, ошибок: 30". Все 30 ошибок = "НЕТ В БАЗЕ": новые стори SearchField (4) и SearchResults (2) x 5 ширин, которых не было до изменений (AC-21 требует только стори, существовавшие до). Ни одного расхождения пикселей, максимум среди сравнённых 0.0014% (faq@375).
- Та же команда + `--ignore stories/components-searchfield --ignore stories/components-searchresults`: exit 0, "файлов: 160, ошибок: 0, порог 0.1%".
- Hero: `compare --exact .visual/hero-09 .visual/final-hero` exit 0, 5 файлов, 0.0000%.

## AC → команда → факт
| AC | проверка | факт | итог |
|---|---|---|---|
| 1 | git ls-files src public scripts astro.config.mjs tsconfig.json gitignore npmrc apps/website/src/data "apps/website/src/Новая папка" | пусто | PASS |
| 2 | ls пакетов; cmp CLAUDE.md AGENTS.md в packages/content и packages/og; workspace:* в apps/website/package.json; ls apps/website/src | cmp молчит; content и og через workspace:*; есть i18n, seo, content, layouts; корневые CLAUDE.md/AGENTS.md описывают content/og/i18n (корневые файлы различаются заголовком, как и до изменений в dad0413; требование побайтности относится к пакетам) | PASS |
| 3 | git ls-files packages/content/src; ls src/data | только .md (+ схема .ts, jpg), по ru/en; apps/website/src/data нет; секции Program/Partner/FAQ/Join совпадают со снимками базы | PASS |
| 4 | копия репозитория в scratchpad, правка доклада, astro build | спикер "ghost-speaker": exit 1, `talks/ru/anchor-and-popover.md: speakers → нет записи «ghost-speaker» в speakers/ru`; митап "99": exit 1, `event → нет записи «99» в events/ru` | PASS |
| 5 | в копии en-доклад time "22:30" | exit 1, `talks/en/anchor-and-popover.md: поле time отличается от ru/anchor-and-popover` | PASS |
| 6 | в копии удалён title из доклада | exit 1, `InvalidContentEntryDataError talks → ru/anchor-and-popover ... title: Required`, путь файла назван; контроль без правок exit 0 | PASS |
| 7 | dist страницы спикера и митапа; catalog.test.ts | спикер: доклад + ссылка на /events/31/; митап: 3 доклада и ПЕРЕРЫВ одним расписанием; фикстура митапов 10 и 15 — тест `talksOfSpeaker: доклады на митапах 10 и 15` зелёный | PASS |
| 8 | node apps/website/scripts/new-entry.mjs event/talk/speaker/partner/faq в копии; ls plop-templates | создание exit 0, файлы в ru/ и en/; повтор exit 1 "Ничего не создано"; plop-templates содержит только component, generators speaker/event/report удалены | PASS |
| 9 | grep заголовков packages/content/README.md | разделы: раскладка, поля по коллекциям (обязательность), связи, черновик, правка с телефона, новые файлы | PASS |
| 10 | grep dist/index.html, dist/en/index.html | `<html lang="ru">` / `lang="en"`; по три hreflang (ru, en, x-default), абсолютные https://css.moscow/…; переключатель Русский/English в навигации | PASS |
| 11 | grep кириллицы и английского текста между тегами в *.astro | совпадения только в throw new Error и комментариях, пользовательского текста нет | PASS |
| 12 | dist при BUILD_NOW=2026-07-01 и в проде; catalog.test.ts | до даты: митап 31 как ближайший с регистрацией; в проде (2026-11-03): "Митап уже прошёл", кнопки регистрации нет; тесты выбора ближайшего зелёные | PASS (замечание 2) |
| 13 | find dist -path events/talks/speakers | /events/31, /talks/ x3, /speakers/ x3 для ru и для en | PASS |
| 15 | pagefind в dist; robots; запрос pagefind.search в Chromium на статике dist | индексы pagefind.ru и pagefind.en; /search/ и /en/search/ `noindex, follow`; "Анна"/"тултипов" на /search/ → /speakers/anna-rastorgueva/, /talks/anchor-and-popover/, /events/31/; "Anna"/"tooltips" на /en/search/ → только /en/…; кросс-языковые запросы пусты | PASS |
| 16 | check:seo | OK, 18 HTML, 16 индексируемых | PASS |
| 17 | file dist/og/*.png; check:seo | events/31.png 1200x630, .twitter.png 1200x600, en 1200x630 (проверку размеров делает check:seo) | PASS |
| 18 | packages/design-system/src/scale.ts + themes/*; scale.test.ts | таблицы шкалы и генерация переменных в themes/, scale.test.ts зелёный в pnpm test | PASS |
| 19 | grep -rnE "[0-9]px" --include='*.css.ts' packages/ui/src apps/website/src \| grep -v '//'; скрипт по 30 блокам '@media' в 36 файлах | пусто; литеральных размеров внутри @media: 0 | PASS |
| 20 | playwright-core, getComputedStyle(documentElement).fontSize | 1920 → 16px; 3840 → 32px | PASS |
| 21 | см. раздел «Снимки» | 160 сравнённых файлов ≤0.1% (макс 0.0014%); Hero точно со снимком hero-09; буквально команда Done-when даёт exit 1 из-за 30 новых-в-спеке снимков, которых нет в базе | PASS (замечание 1) |
| 22 | шаг 1 + deploy.yml | все пять команд exit 0; workflow гоняет lint, test, build, check:seo, build:storybook и выкладывает apps/website/dist (с pagefind и og) | PASS |
| 23 | только файлы | deploy.yml: push в master, pull_request, workflow_dispatch; deploy-job только при master и не PR; pnpm из packageManager (action-setup без версии), Node из .nvmrc; astro site https://css.moscow; docs/deploy.md: Pages Source «GitHub Actions», custom domain css.moscow, A 185.199.108-111.153 и AAAA | PASS |

AC-14 снят. Итого: 22 PASS, 0 FAIL (AC-1…AC-13, 15…23).

## Замечания
1. Done-when п.2 буквально: exit 1 из-за 30 снимков новых стори SearchField/SearchResults (в базе их нет, AC-21 их не требует). Ни одного реального расхождения. Либо добавить в команду два --ignore, либо снять базу новых стори; решать conductor-у.
2. В прошедшем состоянии главной пункт навигации «Регистрация» (#registration) остаётся; якорь id="registration" на странице есть, кнопки регистрации нет. По спеке допустимо, но пункт ведёт к блоку «прошёл». Не провал.
3. Прямой запрос pagefind API проверен через JS API, а не через UI-компонент /search/.
