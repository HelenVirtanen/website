# Plan: архитектура сайта по образцу блога (spec 001)

## Summary
Сайт MoscowCSS переходит на архитектуру блога `/home/r/common/0work/blog`. Сюда входят двуязычный роутинг
(ru без префикса, en под `/en/`), контент-пакет `@moscowcss/content` на `.md`, страницы митапов,
докладов и спикеров, поиск Pagefind, генерация OG- и Twitter-карточек, таблицы шкалы с растущим корнем
и деплой в `moscowcss-meetup/website`. Значения токенов и внешний вид до 1920px не меняются, это
доказывается сравнением скриншотов.

## Metadata
- Complexity: XL (архитектурная миграция; нарезано на 16 последовательных задач)
- Mode: PRP-PHASED + VERIFICATION-HEAVY для адаптива (меняется поведение существующих стилей)
- Source spec: `specs/001-blog-like-architecture.md` (approved) · ADR: `adr/001`, `adr/002`
- Estimated files: ~120 (создание ~85, правка ~30, удаление ~15)
- Confidence (single-pass): 7/10. Слабые места: паритет FAQ после перехода на Markdown и Storybook в
  `renderMode: 'server'` для скриншотов.

## Baseline (проверено 2026-11-03)
- `pnpm lint` → exit 0 (5 пакетов); `pnpm build` → exit 0 (website + icons).
- Node v24.22.0, pnpm 11.9.0 (`package.json:20` `packageManager`). Тестов в репо нет.
- Chromium: `/usr/bin/chromium` и `~/.cache/ms-playwright/chromium-1243` есть.
- Последние версии в npm на 2026-11-03: satori 0.63.2, sharp 0.35.5, pagefind 1.6.0, vitest 5.1.0,
  parse5 8.1.0. Ставим только через `pnpm add`, версии не вписываем руками.

---

## Mandatory Reading
| P | File | Lines | Why |
|---|---|---|---|
| P0 | `specs/001-blog-like-architecture.md` | all | авторитет: AC, планка, вне охвата |
| P0 | `adr/001-content-model-md-relations.md`, `adr/002-adaptive-scale-and-root-size.md` | all | принятые решения |
| P0 | `CLAUDE.md` (корень) | §2, §5, §6, §13, §14 | pnpm latest/exact, токены, Props/JSDoc, комментарии по-русски |
| P0 | blog `packages/design-system/src/scale.ts` | 1-140 | образец таблиц шкалы и `mediaOverrides` |
| P0 | blog `packages/content/src/collections.ts` | 1-35 | загрузчик по папкам языков, `generateId` по пути |
| P0 | blog `apps/blog/src/i18n/{config,index}.ts` | all | словарь, `useTranslations`, `localizePath` |
| P1 | blog `packages/og/src/{render-card,fonts}.ts` | all | satori без React, шрифты от `package.json` пакета |
| P1 | blog `apps/blog/src/seo/og.ts`, `src/pages/og/[...path].png.ts` | all | маршрут карточек, `cardParam`, `.twitter` суффикс |
| P1 | blog `apps/blog/src/layouts/BaseLayout.astro` | 80-225 | canonical, OG/Twitter, hreflang, x-default |
| P1 | blog `apps/blog/src/content/catalog.ts` | 60-170 | `validateLayout`: ошибка контента роняет сборку |
| P1 | blog `apps/blog/scripts/new-entry.mjs` | 1-107 | генератор заготовок по языкам, `flag: 'wx'` |
| P1 | blog `apps/blog/scripts/{check-seo,seo-checks}.mjs` | check-seo 1-18; seo-checks 93-175, 315-360, 493-530, 1178-1207 | гейт по `dist`, размеры PNG, hreflang |
| P1 | blog `apps/blog/src/search/pagefind.ts`, `src/pages/[...locale]/search.astro` | all | JS API Pagefind, `[...locale]` маршрут |
| P2 | blog `apps/blog/vitest.config.ts` | all | `getViteConfig` для `astro:*` в тестах |

## Discovery Table (grounded)
| Category | `file:line` | Pattern | Key snippet |
|---|---|---|---|
| Токены: контракт | `packages/design-system/src/contract.ts:12-23` | `createGlobalThemeContract`, имя = путь через `-` | `(_value, path) => path.join('-')` |
| Растущая шкала (убирается) | `packages/design-system/src/themes/spacing.css.ts:17-33` | m/l/xxl растут на desktop, xxl ещё на desktopLarge | `[pd.l]: '24px'` |
| Шкала в px | `packages/design-system/src/spacing.ts:5-14,45-48` | xs..4xl и radius в `px` | `l: '16px'` |
| Кегли по брейкпоинтам | `packages/design-system/src/themes/typography.css.ts:10-40` | переопределения size-переменных в теме | `[size.h1]: '2.75rem'` |
| Кегли база | `packages/design-system/src/typography.ts:110-137` | rem + комментарий px | `h1: '2rem', // 32px` |
| Бордеры в px | `packages/design-system/src/border.ts:20-23` | `thin: '1px'` … `superThick: '8px'` | |
| Брейкпоинты | `packages/design-system/src/breakpoints.ts:4-19` | rem + `media` map (идентичны блогу, без `print`) | |
| Цвета | `packages/design-system/src/colors.ts:34-66` | `colors = { contract, light, dark }`, dark = копия light | |
| Публичный вход DS | `packages/design-system/src/index.ts:1-6` | side-effect `./themes/index.css` | нельзя импортировать из Node (og) |
| Компонент: дом-стиль | `packages/ui/src/components/Card/Card.astro:1-25` | `const Tag`, `HTMLAttributes<typeof Tag>`, JSDoc на пропсах | |
| Захардкоженный текст | `packages/ui/src/components/NavBar/NavBar.astro:20-27` | `NAV_LINKS` с русскими подписями | i18n сломан |
| Текст в секциях | `apps/website/src/sections/HeroSection.astro:56-61`, `FAQSection.astro:13-40` | литералы «Регистрация», ответы FAQ | AC-11 |
| Данные в TS | `apps/website/src/data/{hero,schedule,partner}.ts` | конст-объекты | переезжают в контент |
| Страница | `apps/website/src/pages/index.astro:1-31` | `lang="ru"`, `<title>` без description/OG | |
| Конфиг сайта | `apps/website/astro.config.mjs:1-12` | `site: 'https://css.moscow'`, нет i18n | |
| Storybook | `apps/storybook/.storybook/main.ts:55-72` | `renderMode: 'server'`, VE-плагин в `viteFinal` | |
| Storybook init | `apps/storybook/.storybook/preview.ts:1-5` | импорт `@moscowcss/design-system` → `:root` vars | рост корня попадёт и сюда |
| Генераторы | `plopfile.mjs:35-50` | plop `speaker/event/report` → `apps/website/src/pages/*s/*.astro` | удаляются |
| CI | `.github/workflows/deploy.yml:1-60` | Pages через Actions, pnpm `version: 11.9.0`, node 20 литералы | AC-23 |
| Turbo | `turbo.json:8-22` | нет задачи `test`; outputs `dist/**` | |

### Инвентарь `@media` в компонентах и секциях (AC-19, перечислено полностью)
| File | Lines | Что внутри `@media` | Действие |
|---|---|---|---|
| `packages/ui/src/components/TgLinkButton/TgLinkButton.css.ts` | 23-55 | `vars.size.*`, display | ок (токены), оставить |
| `packages/ui/src/components/BlockTitle/BlockTitle.css.ts` | 10-14 | смена шортката шрифта | ок |
| `packages/ui/src/components/SpeakerAvatar/SpeakerAvatar.css.ts` | 15-20 | **`'12.5rem'` литерал** | → `vars.size.speakerAvatarLaptop` |
| `packages/ui/src/components/Card/Card.css.ts` | 12-38 | direction, `flex`, `vars.size.cardWidthLaptop` | ок |
| `packages/ui/src/components/Button/Button.css.ts` | 12-15 | `vars.padding.xxl` | ок по форме; ступень → layout (см. ниже) |
| `packages/ui/src/components/NavBar/NavBar.css.ts` | 19-140 | токены, `gap: 0` | ок |
| `apps/website/src/sections/HeroSection.css.ts` | 53-191 | `dimensions.*`, `width: 'auto'`, `maxWidth: 'none'` | ок (ключевые слова, не размеры) |
| `apps/website/src/sections/ProgramSection.css.ts` | 65-72, 131-137 | **`'12.5rem minmax(16rem, 26rem) minmax(24rem, 1fr)'`, `'12.5rem 1fr'`** | → `vars.size.programTimeColumn` и т.п. |
| `apps/website/src/sections/sectionLayout.css.ts` | 7-11 | `vars.padding.l` | ок |
| `apps/website/src/sections/PartnerSection.css.ts` | 60-120, 156-159 | `dimensions.*`, `repeat(n, minmax(0, 1fr))` | ок (структура) |
| `apps/website/src/sections/FAQSection.css.ts` | 32-38 | direction + `vars.spacing.xxl` | ок |

### Растущие ступени (49 употреблений; все переезжают на layout-лестницы)
`vars.padding.{m,l,xxl}` и `vars.spacing.{m,l,xxl}` в: `FAQSection.css.ts` (2), `HeroSection.css.ts` (7),
`PartnerSection.css.ts` (5), `ProgramSection.css.ts` (10), `sectionLayout.css.ts` (3),
`BlockTitle.css.ts` (1), `Button.css.ts` (2), `CallToAction.css.ts` (1), `Card.css.ts` (3),
`CardSlider.css.ts` (2), `FeatureCard.css.ts` (3), `NavBar.css.ts` (9). Получить живой список можно
командой `grep -rnE "vars\.(padding|spacing)\.(m|l|xxl)\b" packages/ui/src apps/website/src`. После
T05 эта команда должна выдавать 0 строк.

## Patterns to Mirror

### SCALE TABLE: база и ступени, генерация медиазапросов
```ts
// SOURCE: blog packages/design-system/src/scale.ts:58-78
export function mediaOverrides<K extends string>(
  names: Readonly<Record<K, string>>,
  table: Readonly<Record<K, Steps>>,
): Record<string, { vars: Record<string, string> }> {
  const keys = Object.keys(table) as K[]
  const result: Record<string, { vars: Record<string, string> }> = {}
  for (const step of widthSteps) {
    const vars: Record<string, string> = {}
    for (const key of keys) {
      const override = table[key][step]
      if (override !== undefined) vars[names[key]] = override
    }
    if (Object.keys(vars).length > 0) result[media[step]] = { vars }
  }
  return result
}
```
```ts
// SOURCE: blog packages/design-system/src/themes/layout.css.ts:1-9
createGlobalTheme(':root', vars.layout, baseValues(layoutSpace))
globalStyle(':root', { '@media': mediaOverrides(vars.layout, layoutSpace) })
```

### ROOT SIZE
```ts
// SOURCE: blog packages/design-system/src/reset.css.ts:46
  fontSize: 'max(100%, 100vw / 120)',
```

### CONTENT LOADER по папкам языков
```ts
// SOURCE: blog packages/content/src/collections.ts:19-28
const localized = (dir: string) =>
  glob({
    pattern: '**/*.{md,mdx}',
    base: new URL(`./${dir}`, import.meta.url),
    generateId: ({ entry }) => entry.replace(/\.[^.]+$/, ''),
  })
```
У нас pattern `'**/*.md'` (MDX вне охвата).

### CONTENT ERROR роняет сборку
```ts
// SOURCE: blog apps/blog/src/content/catalog.ts:133-136
export function validateLayout(entries: readonly CatalogEntry[]): void {
  for (const entry of entries) {
    const problem = problemOf(entry)
    if (problem) throw layoutError(entry, problem)
```
В нашем сообщении всегда есть `entry.filePath` и имя поля или отсутствующего id (AC-4, AC-5, AC-6).

### I18N
```ts
// SOURCE: blog apps/blog/src/i18n/index.ts:20-28
export function useTranslations(locale: Locale) {
  return function t(key: keyof (typeof ui)[typeof defaultLocale]): string {
    return dictionaries[locale]?.[key] ?? dictionaries[defaultLocale]?.[key] ?? key
  }
}
```
```ts
// SOURCE: blog apps/blog/src/pages/[...locale]/search.astro:16-20
export const getStaticPaths = (() =>
  locales.map((locale) => ({
    params: { locale: locale === defaultLocale ? undefined : locale },
    props: { locale },
  }))) satisfies GetStaticPaths
```

### OG CARD
```ts
// SOURCE: blog packages/og/src/render-card.ts:20-23,164-178
export const CARD_SIZES: Record<CardSize, { width: number, height: number }> = {
  og: { width: 1200, height: 630 },
  twitter: { width: 1200, height: 600 },
}
...
  const svg = await satori(card({ ...input, size }), {
    width, height, fonts: await loadFonts(),
    onStyleError: (error) => { throw error },
  })
  return sharp(Buffer.from(svg)).png().toBuffer()
```
```ts
// SOURCE: blog packages/og/src/fonts.ts:33-35 — путь к шрифтам от package.json пакета, не от import.meta.url
const fontsDir = (): string =>
  join(dirname(createRequire(import.meta.url).resolve('@vzhyx/og/package.json')), 'fonts')
```

### META TAGS
Брать из blog `apps/blog/src/layouts/BaseLayout.astro:200-222`: `og:*`, `twitter:*`, `hreflang`, `x-default`.
Отличие: карточка есть у каждой индексируемой страницы, поэтому ветки «без карточки» нет.

### SCAFFOLD
```js
// SOURCE: blog apps/blog/scripts/new-entry.mjs:96-100 — wx: существующий файл не перезаписывается
    mkdirSync(dirname(file.path), { recursive: true })
    writeFileSync(file.path, file.content, { flag: 'wx' })
```
Перед записью все конфликты проверяются через `planEntry`: при любом совпадении не создаётся ничего.

### COMPONENT (дом-стиль, обязателен для новых компонентов)
```astro
// SOURCE: packages/ui/src/components/Card/Card.astro:1-14
const Tag = 'article';
interface Props extends HTMLAttributes<typeof Tag> {
  /** Заголовок карточки */
  title: string;
```
Плюс `/home/r/.claude/plugins/cache/vzhyx/vzhyx/0.26.0/conventions/ui-component-house-style.md`: без внешних
`margin`, a11y-состояния, rem и токены, стори с крайними случаями. Новые компоненты создаются только
командой `pnpm new:component`.

---

## Решения плана (детали без проигравшей альтернативы уровня ADR)
1. **Растущие ступени переходят в layout-лестницы.** Появляются `vars.layout.inset.{m,l,xxl}` (бывшие
   `padding.*`) и `vars.layout.gap.{m,l,xxl}` (бывшие `spacing.*`). Таблица `layoutSpace` повторяет
   нынешние значения: m 12→16 (desktop), l 16→24 (desktop), xxl 24→32 (desktop)→40 (desktopLarge).
   `vars.padding.*` и `vars.spacing.*` становятся постоянными, с базовыми значениями в rem. Имена по
   ролям узлов не вводим: без макета роль не установить, а лестница сохраняет поведение один в один.
   Переименование по ролям относится к редизайну (вне охвата).
2. **Литеральные размеры из `@media`** (SpeakerAvatar, ProgramSection) переносятся в `vars.size.*` со
   значением в rem.
3. **Ссылки контента пишутся коротким именем файла** (`speakers: [daria-egorova]`, `event: "31"`), а не
   полным id `ru/daria-egorova`. Так удобнее с телефона. Для этого используется `z.string()` с
   regex-слагом, а `astro:content` `reference()` не используется: тот требует id с префиксом языка.
   Существование цели в своём языке проверяет `validateCatalog` с `filePath` в сообщении (AC-4).
4. **Номер митапа берётся из имени файла** (`events/ru/31.md` → 31), во frontmatter его нет, как `slug`
   в блоге.
5. **Шрифты карточки.** Satori не читает WOFF2. TTF Montserrat Regular/SemiBold/Bold скачаны
   2026-11-03 из официального репозитория `JulietaUla/Montserrat` (`fonts/ttf/`, коммит `555facf`) и
   лежат рядом с woff2 в `packages/fonts/montserrat/` под той же OFL (`LICENSE.txt` рядом). Решение
   пользователя: скачивать сами файлы, а не npm-пакеты. `@moscowcss/fonts` экспортирует их
   (`./montserrat-regular.ttf` и т.д.). `@moscowcss/og` читает их через
   `createRequire(...).resolve('@moscowcss/fonts/package.json')`, копий шрифтов в og нет. Карточка
   набирается одним Montserrat (кириллица есть), Inter и JetBrains не нужны.
   sha256: Regular `3e8abe50…cfb2`, SemiBold `b4e15633…2fd0`, Bold `bc6e8549…ec61`.
6. **Скриншот-тулинг** лежит в `tools/visual/` (не в `scripts/`, AC-1). Он на `playwright-core` с
   системным Chromium (`CHROMIUM_PATH`, по умолчанию `/usr/bin/chromium`), браузеры не скачиваются.
   Снимки пишутся в `.visual/` и в git не попадают.

## Files to Change
| File | Action | Justification |
|---|---|---|
| `src/`, `public/`, `scripts/`, `astro.config.mjs`, `tsconfig.json`, `gitignore`, `npmrc` (корень) | DELETE | AC-1, дубли старой раскладки |
| `apps/website/src/Новая папка/`, `apps/website/src/data/` | DELETE | AC-1 (data — после переезда в контент) |
| `tools/visual/{capture,compare}.mjs`, `tools/visual/README.md` | CREATE | AC-21 |
| `apps/website/src/sections/*.astro`, `NavBar.astro` | UPDATE | атрибуты `data-visual`, потом i18n/контент |
| `packages/design-system/src/{scale.ts,scale.test.ts,theme-colors.ts,reset.css.ts}` | CREATE | AC-18, AC-20, цвета для og |
| `packages/design-system/src/{spacing,border,typography,contract,index}.ts`, `themes/*.css.ts` | UPDATE | rem, таблицы, layout-лестницы |
| `packages/ui/src/components/**/*.css.ts`, `apps/website/src/sections/*.css.ts` | UPDATE | AC-19 |
| `packages/content/**` | CREATE | AC-2, AC-3, AC-9 |
| `apps/website/src/{content.config.ts,content/catalog.ts,content/*.test.ts,test/fixtures.ts}` | CREATE | AC-4..AC-7, AC-12 |
| `apps/website/src/i18n/{config,index,ui}.ts`, `ui.test.ts` | CREATE | AC-10, AC-11 |
| `apps/website/src/layouts/BaseLayout.astro` | CREATE | мета-теги, AC-10, AC-16 |
| `apps/website/src/pages/[...locale]/{index,search}.astro`, `events/[event].astro`, `talks/[talk].astro`, `speakers/[speaker].astro`, `og/[...path].png.ts` | CREATE | AC-12, AC-13, AC-15, AC-17 |
| `apps/website/src/pages/index.astro` | DELETE | заменяется `[...locale]/index.astro` |
| `apps/website/src/seo/{pages,og}.ts` (+tests) | CREATE | единый список страниц, карточки |
| `apps/website/src/search/pagefind.ts` (+test) | CREATE | AC-15 |
| `apps/website/scripts/{check-seo,seo-checks,new-entry}.mjs` (+tests) | CREATE | AC-8, AC-16, AC-17 |
| `packages/og/**` | CREATE | AC-17 |
| `packages/ui/src/components/{LocaleSwitcher,LinkList,…}` | CREATE через `pnpm new:component` | переключатель, списки митапов/докладов |
| `plopfile.mjs`, `plop-templates/content/` | UPDATE / DELETE | AC-8 |
| `package.json`, `turbo.json`, `apps/website/package.json`, `apps/website/astro.config.mjs`, `.gitignore` | UPDATE | test, pagefind, i18n, `.visual/` |
| `.github/workflows/deploy.yml`, `.nvmrc`, `docs/deploy.md` | UPDATE / CREATE | AC-22, AC-23 |
| `CLAUDE.md`/`AGENTS.md` (корень, `apps/website`, `packages/{design-system,ui}`, новые `packages/{content,og}`) | UPDATE / CREATE | AC-2 |

## NOT Building (scope guard)
- CMS, YML-файлы, MDX, третий язык, RSS, `llms.txt`, Markdown-версии страниц, MCP, агентские каталоги,
  JSON-LD, sitemap, тема-переключатель, страницы ошибок и 404, workshop, cron-пересборка.
- Новые значения токенов и смена внешнего вида до 1920px. Переименование layout-лестниц по ролям.
- Наполнение прошлых митапов 1–30 (кроме тестовых фикстур).
- Push в `moscowcss-meetup/website`, настройка Pages и DNS: это делают люди.
- Апгрейд Astro, Storybook и других существующих зависимостей сверх необходимого для новых пакетов.

---

## Step-by-Step Tasks

Все задачи идут последовательно: почти каждая трогает `apps/website` или дизайн-систему. Общие
команды проверки (`pnpm lint`, `pnpm build`) входят в VALIDATE каждой задачи.

### T01: Скриншот-тулинг и базовые снимки (до любых правок)
- ACTION: добавить `tools/visual/capture.mjs` и `compare.mjs`, разметить секции, снять базу.
- IMPLEMENT: `pnpm add -Dw playwright-core pixelmatch pngjs`. Скрипт `capture.mjs <out-dir>` делает три
  вещи. (a) Поднимает `astro preview` сайта (`apps/website/dist`) и снимает элементы `[data-visual]` на
  ширинах 375/768/1024/1280/1920. (b) Читает `index.json` Storybook-dev-сервера (порт 6006, базовый URL
  из `STORYBOOK_URL`) и снимает `#storybook-root` каждой стори на тех же ширинах. (c) Пишет PNG
  `<out>/<kind>/<id>@<w>.png`. `compare.mjs <base> <next>` прогоняет pixelmatch, выводит долю
  отличающихся пикселей и падает при >0.1% или отсутствующем файле. На корневые элементы секций
  (`HeroSection`, `ProgramSection`, `PartnerSection`, `FAQSection`, `JoinSection`) и `NavBar` в
  `index.astro` добавить `data-visual="hero|program|partner|faq|join|navbar"`: атрибут пиксели не меняет.
  Добавить `.visual/` в `.gitignore`. Снять базу в `.visual/baseline/`.
- MIRROR: стиль скриптов `scripts/extract-partner-cards-wave.mjs:1-20` (ESM, `node:` импорты); русские
  комментарии.
- GOTCHA: стори в `renderMode: 'server'` (`apps/storybook/.storybook/main.ts:61-66`) рендерятся
  асинхронно, поэтому ждать появления потомка у `#storybook-root` и `document.fonts.ready`. Снимать
  через `playwright-core` с `executablePath`, `playwright install` не запускать. Анимации отключать
  `reducedMotion: 'reduce'`.
- VALIDATE: `node tools/visual/capture.mjs .visual/baseline` → ≥ 6×5 PNG секций и ≥ (число стори)×5
  PNG стори. Повторный снимок в `.visual/check` и `node tools/visual/compare.mjs .visual/baseline
  .visual/check` дают 0 отличий: тулинг детерминирован.

### T02: Чистка корня (AC-1, часть)
- ACTION: удалить корневые `src/`, `public/`, `scripts/`, `astro.config.mjs`, `tsconfig.json`,
  `gitignore`, `npmrc` и `apps/website/src/Новая папка/`.
- IMPLEMENT: `git rm -r`. Корневой `eslint.config.js` остаётся: он линтит `tools/`. Проверить, что
  `moscowcss-site.code-workspace` не ссылается на удалённое.
- GOTCHA: `scripts/extract-partner-cards-wave.mjs` читает несуществующий `menucards.svg`. Скрипт
  мёртвый, а результат `apps/website/public/assets/partner-cards-wave.svg` остаётся.
- VALIDATE: `git ls-files src public scripts astro.config.mjs tsconfig.json gitignore npmrc
  "apps/website/src/Новая папка"` → пусто; `pnpm lint && pnpm build` → 0.

### T03: Таблицы шкалы, rem, рост корня, цвета для Node (AC-18, AC-20)
- ACTION: перевести дизайн-систему на модель блога с сохранением значений.
- IMPLEMENT: `scale.ts` по образцу блога (`widthSteps`, `Steps`, `resolveAt`, `baseValues`,
  `mediaOverrides`, `remToPx`). Значения нынешние:
  - `typeScale` строится из `typography.ts:110-137` и `themes/typography.css.ts:10-40`.
  - `space` (постоянная) содержит xs..4xl в rem: 0.25/0.5/0.75/1/1.25/1.5/2/5rem.
  - `layoutSpace` содержит `inset.{m,l,xxl}` и `gap.{m,l,xxl}` по решению 1.
  - `radius` и `border` переводятся в rem (`1px` → `0.0625rem` и т.д.).

  `themes/spacing.css.ts` больше не держит растущих переопределений. `themes/typography.css.ts` и
  новый `themes/layout-space.css.ts` (или расширенный `layout.css.ts`) генерируются из таблиц.
  `reset.css.ts` (или `themes/root.css.ts`) задаёт `html { font-size: max(100%, 100vw / 120) }`.
  `theme-colors.ts` экспортирует чистые значения `colors.light.color` без side-effects: export
  `./theme-colors` в `package.json`, плюс `./scale` для тестов. Добавить vitest:
  `pnpm --filter @moscowcss/design-system add -D vitest`, скрипт `test`, задачу `test` в `turbo.json`
  и корневой `"test": "turbo run test"`.
- MIRROR: SCALE TABLE, ROOT SIZE; тесты как в blog `packages/design-system/src/scale.test.ts`.
- GOTCHA: `contract.ts` собирает все слайсы, поэтому новые `layout.inset/gap` нужно добавить в
  контракт, иначе `vars.layout.*` будет undefined. Имена переменных станут `--layout-inset-l`.
  Медиазапросы в rem считаются от браузерного кегля (ADR-002), их не трогать. На этом шаге
  компоненты ещё ссылаются на `vars.padding.l`, который стал постоянным, и визуал на desktop временно
  разъедется. Это ожидаемо, паритет восстанавливает T04, и T03 сам паритет не проверяет.
- VALIDATE: `pnpm --filter @moscowcss/design-system test` → резолвер даёт на 1280 `inset.l` = 1.5rem,
  на 1920 `gap.xxl` = 2.5rem, `h1` = 3.25rem. `grep -nE "[0-9]px'" packages/design-system/src -r` →
  только комментарии. `pnpm lint && pnpm build` → 0.

### T04: Компоненты и секции на новые токены, паритет (AC-19, AC-21)
- ACTION: заменить 49 употреблений растущих ступеней на layout-лестницы, литералы из `@media` на
  `vars.size.*`.
- IMPLEMENT: `vars.padding.X` → `vars.layout.inset.X`, `vars.spacing.X` → `vars.layout.gap.X` для
  X∈{m,l,xxl} во всех файлах инвентаря (в том числе внутри `@media [media.mobile]`: значения на мобиле
  равны базе). `SpeakerAvatar.css.ts:17-18` → `vars.size.speakerAvatarLaptop` (12.5rem).
  `ProgramSection.css.ts:68,134` → токены колонок в `spacing.ts` size (`programTimeColumn: '12.5rem'`,
  `programTitleColumnMin/Max`, `programDescriptionColumnMin`). Сетка собирается из них в `.css.ts`.
- MIRROR: инвентарь выше.
- GOTCHA: `calc(${vars.size.tgLinkButtonCompact} + ${vars.spacing.l})` в `NavBar.css.ts:138` — тоже
  замена на `vars.layout.gap.l`. Литералов `0`, `'auto'`, `'none'`, `'100%'` правило не касается.
- VALIDATE: `grep -rnE "vars\.(padding|spacing)\.(m|l|xxl)\b" packages/ui/src apps/website/src` → 0
  строк. `grep -rnE "[0-9]px" --include='*.css.ts' packages/ui/src apps/website/src` → 0 строк вне
  комментариев. `pnpm build && node tools/visual/capture.mjs .visual/t04 && node
  tools/visual/compare.mjs .visual/baseline .visual/t04` → все снимки ≤0.1%.

### T05: Пакет `@moscowcss/content`: схема, коллекции, перенос контента ru+en (AC-2, AC-3, AC-9)
- ACTION: создать пакет и перенести весь текст из `apps/website/src/data/*.ts`, `FAQSection.astro`,
  `HeroSection.astro`.
- IMPLEMENT: `packages/content/{package.json,tsconfig.json,eslint.config.js,CLAUDE.md,AGENTS.md,README.md}`.
  Экспорты `.`, `./collections`, `./schema`. `src/schema.ts` содержит zod-схемы:
  - `PageSchema` (main: title, description, telegramUrl; тело — «о митапе»);
  - `EventSchema` (date как `z.coerce.date()` с временем и смещением `+03:00`, `tagline`,
    `venue{name,address,mapUrl?}`, `modes[]`, `passportRequired`, `registrationUrl?`, `streamUrl?`,
    `recordingUrl?`, `partner?`, `schedule[{time,title,kind:'break'|'activity'}]`, `draft`);
  - `TalkSchema` (event, speakers[] — слаги по regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`, `time` `HH:MM`,
    `title`, `slidesUrl?`, `videoUrl?`, `draft`);
  - `SpeakerSchema` (name, role, `photo` через `image()` с относительным путём в `assets/`,
    `photoAlt`, `links[]?`, `draft`);
  - `PartnerSchema` (name, handle, url?, tagline, `features[{title,description,footnote?}]`);
  - `FaqSchema` (title, order).

  `src/collections.ts` — `localized()` по образцу блога для `pages, events, talks, speakers, partners,
  faq`. Контент: `pages/{ru,en}/index.md`, `events/{ru,en}/31.md`, 2 доклада, 3 спикера (фото — в
  `speakers/assets/`, общие для языков), `partners/{ru,en}/zvuk.md`, по файлу на каждый вопрос FAQ.
  Английский — перевод агента, имена транслитерацией (открытые вопросы спеки). В
  `apps/website/src/content.config.ts` — `export { collections } from '@moscowcss/content/collections'`.
  `pnpm --filter website add @moscowcss/content@workspace:*`.
- MIRROR: CONTENT LOADER; README по структуре blog `packages/content/README.md` (раскладка, таблица
  полей, черновик, плюс раздел «С телефона: github.com → файл → карандаш → Commit changes»).
- GOTCHA: `image()` доступен только в форме схемы-функции `schema: ({ image }) => …`. Фото спикеров
  переезжают из `apps/website/public/assets/*.jpg`; пути в `<SpeakerAvatar>` поменяются в T08.
  Тексты в верхнем регистре (`'ЕСЛИ БИЗНЕС НЕ ИГРАЕТ — ЕМУ КАПЕЦ'`) переносятся как есть. Тело FAQ —
  Markdown, ответы с переносами строк пишутся жёстким переносом (`\` в конце строки), чтобы получить
  `<br>`, а не `<ol>`.
- VALIDATE: `pnpm build` → 0 (коллекции загружаются, `astro sync` без ошибок схемы); `cmp
  packages/content/CLAUDE.md packages/content/AGENTS.md` молчит; `find packages/content/src -type f !
  -name '*.md' ! -path '*/assets/*' ! -name '*.ts'` → пусто.

### T06: Каталог: валидация, связи, ближайший митап (AC-4..AC-7, AC-12 логика)
- ACTION: `apps/website/src/content/catalog.ts`, чистые функции поверх записей коллекций, и тесты.
- IMPLEMENT: функции модуля:
  - `validateCatalog(entries)` бросает `Error` с `filePath`:
    - неизвестный спикер или митап в своём языке;
    - расхождение инвариантов перевода с ru: event — `date, venue.mapUrl, registrationUrl,
      streamUrl, recordingUrl, partner, schedule[].time/kind`; talk — `event, speakers, time,
      slidesUrl, videoUrl`; speaker — `photo, links`;
    - опубликованный доклад в черновом митапе.
  - `loadCatalog()` — единственное место с `getCollection`.
  - `talksOfEvent`, `scheduleOf(event, talks)` — слияние докладов и перерывов по `HH:MM`.
  - `talksOfSpeaker`, `upcomingEvent(events, now)` — ближайший с `date >= now`, иначе последний
    прошедший с флагом `past: true`.
  - `pastEvents(events, now)`.

  Ошибка схемы (AC-6) — штатная ошибка Astro content: проверить, что её текст содержит путь и поле.
  Если не содержит, обернуть. `vitest` в `apps/website`: `pnpm --filter website add -D vitest`,
  `vitest.config.ts` через `getViteConfig`, фикстуры в `src/test/fixtures.ts` (митапы 10 и 15, один
  спикер с докладами на обоих).
- MIRROR: CONTENT ERROR; blog `apps/blog/vitest.config.ts`.
- GOTCHA: дата митапа сравнивается в UTC: `now` передаётся аргументом, в коде нет `new Date()`. Слаги
  в ссылках без префикса языка (решение 3).
- VALIDATE: `pnpm --filter website test` проверяет поведение: несуществующий спикер даёт ошибку с путём
  и именем; расхождение `time` в en даёт ошибку с путём и `time`; у спикера два доклада на 10 и 15;
  будущего митапа нет, значит выбран последний прошедший с `past`. Порча контента руками (временная
  правка `speakers: [nobody]` в `talks/ru/*.md`) даёт `pnpm build` ≠ 0 с путём файла в выводе; правку
  откатить.

### T07: i18n, маршрутизация, базовый layout, переключатель языка (AC-10, AC-11 часть)
- ACTION: `src/i18n/{config,index,ui}.ts`, `astro.config.mjs` i18n, `layouts/BaseLayout.astro`, компонент
  `LocaleSwitcher`.
- IMPLEMENT: `locales = ['ru','en']`, `defaultLocale = 'ru'`, `localeNames`, `localeSwitchHints`. В
  `astro.config.mjs`: `i18n: { defaultLocale: 'ru', locales: ['ru','en'], routing: {
  prefixDefaultLocale: false } }`, `trailingSlash: 'always'`. `BaseLayout` пишет `<html lang>`,
  `<title>`, `description`, `canonical`, `hreflang` для `alternates` и `x-default`. OG/Twitter
  добавляются в T10, но проп `card` закладывается сразу. Импорты `@moscowcss/fonts`,
  `@moscowcss/design-system` и `global.css` переезжают из `pages/index.astro` в layout. `pnpm
  new:component` → `LocaleSwitcher` (`Tag = 'nav'`, проп `options: {code,label,href,hint,current}[]`,
  `aria-current`, `lang`/`hreflang` на ссылках) со стори. `NavBar` получает проп `links:
  {href,label}[]` и подписи вместо `NAV_LINKS` (`NavBar.astro:20-27`), вставка переключателя идёт
  через слот. Стори `NavBar` передаёт русские значения, которые были зашиты, поэтому паритет стори
  сохраняется. `ui.test.ts`: у всех языков одинаковые ключи.
- MIRROR: I18N; blog `BaseLayout.astro:80-225`; COMPONENT.
- GOTCHA: `getRelativeLocaleUrl` с `trailingSlash: 'always'` даёт `/en/`. Ссылки якорей NavBar
  (`#registration`) на других страницах ведут на главную своего языка (`/en/#program`).
- VALIDATE: `pnpm --filter website test` (ключи словаря); `pnpm build` → есть `dist/index.html`
  (`lang="ru"`) и `dist/en/index.html` (`lang="en"`), в обоих три `hreflang` с абсолютными URL; `pnpm
  build:storybook` → 0.

### T08: Главная из контента, тексты из словаря (AC-3, AC-11, AC-12, AC-1 data)
- ACTION: `pages/[...locale]/index.astro`, секции получают данные пропсами, `apps/website/src/data/`
  удаляется.
- IMPLEMENT: главная = `BaseLayout` + блок «о митапе» (тело `pages/<lang>/index.md`) + нынешние секции
  для `upcomingEvent` + список прошлых митапов (`LinkList` через `pnpm new:component`: заголовок,
  ссылки с подписью-датой). Секции перестают импортировать `../data/*`. Строки интерфейса берутся из
  `ui.ts`:
  - «Регистрация» и «Для онлайн просмотра…»;
  - «Смотри трансляцию»;
  - «ЧАВО» и подписи NavBar;
  - префикс «Адрес:»;
  - строка даты: шаблон `'{day} {year} в {time}'`, `day` из `Intl.DateTimeFormat(locale, {day:'numeric',
    month:'long', timeZone:'Europe/Moscow'})`, чтобы ru-строка осталась ровно «9 июля 2026 в 18:00».

  Состояние `past` скрывает `CallToAction` регистрации и показывает ссылку на запись, если она есть.
  FAQ рендерит `<Content />` каждого файла внутри `Card`. `pages/index.astro` удалить.
- MIRROR: blog `[...slug].astro:56-80` (данные в компонент пропсами), I18N.
- GOTCHA: секция Hero на русской главной должна совпасть с базой пиксель-в-пиксель, хотя митап 31 уже
  в прошлом. Для паритета снимать в режиме, где `now` подменён датой до 2026-07-09: сборка читает
  `BUILD_NOW` (только для снимков; по умолчанию — реальное время). Тело `.md` рендерится
  `<Content />`. Подмена тегов компонентами (`components={{ p: … }}`) в Astro работает только для MDX,
  поэтому для `.md` стили прозы задаются на контейнере рендерера: компонент `Prose` (`pnpm
  new:component`) с `globalStyle(\`${root} p\`, …)`, `a`, `ol/ul`, `strong` на токенах. Отступы `p`
  подобрать так, чтобы FAQ-карточки совпали с базой; паритет проверяется снимками.
  Литеральный текст в `.astro` ловит ESLint-правило? Такого правила нет, поэтому проверка — grep в
  VALIDATE.
- VALIDATE: `git ls-files apps/website/src/data` → пусто. `grep -rnP "[А-Яа-яЁё]"
  apps/website/src/sections apps/website/src/pages apps/website/src/layouts --include='*.astro'` → 0
  (кроме комментариев). `BUILD_NOW=2026-07-01 pnpm build && node tools/visual/capture.mjs
  .visual/t08 && node tools/visual/compare.mjs .visual/baseline .visual/t08` → секции и стори ≤0.1%.
  `pnpm build` без `BUILD_NOW` → у Hero нет ссылки регистрации (`grep -c timepad dist/index.html` → 0).

### T09: Страницы митапа, доклада, спикера (AC-7, AC-13)
- ACTION: `pages/[...locale]/events/[event].astro`, `talks/[talk].astro`, `speakers/[speaker].astro` и
  `seo/pages.ts` — единый список публичных страниц.
- IMPLEMENT: `publicPages()` возвращает `{kind, locale, path, entry, alternates}` для главной, каждого
  опубликованного митапа, доклада и спикера. Его читают маршруты, OG и `check:seo`. Страницы
  собираются из `H1/H2/Paragraph/SpeakerAvatar/Card/LinkList` и токенов. Страница митапа содержит
  описание, дату, место и `scheduleOf`. Страница доклада — название, тело, митап, спикеры, ссылки.
  Страница спикера — фото, роль, био, `talksOfSpeaker` со ссылками на митапы. Корневой элемент
  контента: `<main data-pagefind-body>` (кроме главной и поиска). Тесты `seo/pages.test.ts`: пути,
  alternates, черновики не попадают.
- MIRROR: blog `apps/blog/src/seo/pages.ts:1-80`.
- GOTCHA: новые стили — только в `.css.ts` страниц через `vars`/`media`, без `px` (AC-19
  распространяется и на них). Фото — `<Image>` из `astro:assets` с `alt` из `photoAlt`.
- VALIDATE: `pnpm --filter website test`; `pnpm build` → существуют `dist/events/31/index.html`,
  `dist/en/events/31/index.html`, `dist/talks/<имя>/index.html`, `dist/speakers/daria-egorova/index.html`
  и их en-версии.

### T10: Пакет `@moscowcss/og` и мета-теги (AC-16, AC-17)
- ACTION: `packages/og` (satori + sharp), маршрут `pages/og/[...path].png.ts`, `seo/og.ts`, OG/Twitter в
  `BaseLayout`.
- IMPLEMENT: `pnpm --filter @moscowcss/og add satori sharp @moscowcss/design-system@workspace:*` и `-D
  vitest`. Компоненты пакета:
  - `CARD_SIZES` og 1200×630, twitter 1200×600.
  - `renderCard({title, kicker, meta, size, lang})` — в светлых цветах из `theme-colors`, с логотипом
    из `packages/icons/src/svg/Logo.svg`, вписанным путями как `logo.ts` блога.
  - Шрифты Montserrat Regular/SemiBold/Bold в TTF из `@moscowcss/fonts` (решение 5): добавить в
    `packages/fonts/package.json` exports на `.ttf` и `pnpm --filter @moscowcss/og add
    @moscowcss/fonts@workspace:*`.

  Карточки получают все страницы из `publicPages()` (главная, митапы, доклады, спикеры). Пути:
  `/og/<путь>.png` и `/og/<путь>.twitter.png`, у главной — `/og/index.png`. `BaseLayout` пишет полный
  набор тегов из AC-16, `og:locale` = `ru_RU`/`en_US`, `og:site_name` из словаря. В `pnpm-workspace.yaml`
  `allowBuilds` добавить `sharp: true` (как в блоге).
- MIRROR: OG CARD, META TAGS.
- GOTCHA: каталог шрифтов берётся от `@moscowcss/fonts/package.json` (как блог `fonts.ts:33-35`), иначе после
  бандла путь уводит в `dist/.prerender`. Для отсутствующих стилей satori нужен `onStyleError: throw`.
  Кириллицу проверить тестом.
- VALIDATE: `pnpm --filter @moscowcss/og test` (PNG нужного размера, кириллица не падает); `pnpm
  build` → `file dist/og/events/31.png` = `1200 x 630`, `dist/og/en/events/31.twitter.png` = `1200 x
  600`.

### T11: Поиск Pagefind (AC-15)
- ACTION: `pnpm --filter website add -D pagefind`, `"build": "astro build && pagefind --site dist"`,
  страница `pages/[...locale]/search.astro`, `src/search/pagefind.ts` (+test), компонент поля поиска в
  NavBar или на странице.
- IMPLEMENT: обёртка JS API (`import('/pagefind/pagefind.js')`, модуль передаётся аргументом для
  теста). Pagefind сам режет индекс по `<html lang>`, поэтому результаты относятся к языку страницы.
  Поиск — форма GET `?q=`, а выдача рисуется на токенах (компонент через `pnpm new:component`). Страница
  получает `noindex` и не имеет `data-pagefind-body`. Ссылку на поиск добавить в NavBar (словарь).
- MIRROR: blog `apps/blog/src/search/pagefind.ts:1-40`, `[...locale]/search.astro`.
- GOTCHA: `pagefind` нужен после `astro build`, иначе в dev индекса нет: страница должна показывать
  «поиск доступен после сборки», а не падать. `turbo.json` outputs уже включают `dist/**`.
- VALIDATE: `pnpm build` → `dist/pagefind/pagefind.js` существует, в логе pagefind есть языки `ru` и
  `en`. Скриптом на `playwright-core` (или вручную в превью) поиск фамилии спикера на `/search/?q=…`
  выдаёт его страницу, а на `/en/search/` выдача только с `/en/`.

### T12: `check:seo` (AC-16, AC-17)
- ACTION: `apps/website/scripts/{check-seo,seo-checks}.mjs` (+`seo-checks.test.mjs`), скрипт `check:seo`.
- IMPLEMENT: обходит `dist/**/*.html` и разбирает их через `pnpm --filter website add -D parse5`.
  Страница без `noindex` считается индексируемой. Для неё скрипт проверяет полный список тегов
  AC-16, абсолютные `og:url`/`og:image` на `https://css.moscow` и наличие файлов картинок в `dist`.
  Размеры PNG читаются из IHDR (blog `pngSize`, `seo-checks.mjs:315-358`) и сверяются с 1200×630 или
  1200×600. Ещё проверяется взаимность `hreflang` (`seo-checks.mjs:493-530`). Ошибки копятся, выход
  ненулевой.
- MIRROR: blog `check-seo.mjs:1-18`, `seo-checks.mjs` указанные строки.
- VALIDATE: `pnpm --filter website test` (фикстуры HTML ловят пропущенный `twitter:image` и PNG
  неверного размера); `pnpm build && pnpm --filter website check:seo` → `OK`.

### T13: Генераторы заготовок (AC-8)
- ACTION: `apps/website/scripts/new-entry.mjs` (+test), шаблоны `packages/content/templates/{ru,en}/{event,talk,speaker,partner,faq}.md`,
  корневые скрипты `new:event|new:talk|new:speaker|new:partner|new:faq`. Удалить plop-генераторы
  `speaker/event/report` (`plopfile.mjs:35-50`) и `plop-templates/content/`.
- IMPLEMENT: `planEntry` сначала проверяет все целевые файлы: при любом существующем бросает ошибку и
  ничего не пишет, код выхода 1. Имя проверяется regex (`event` — число). Заготовки создаются с
  `draft: true`.
- MIRROR: SCAFFOLD.
- VALIDATE: `pnpm --filter website test`. `pnpm new:event 99` создаёт два файла, повтор выдаёт exit 1 и
  не меняет файлы (`git status`). Созданные файлы удалить. `grep -n "speaker\|event\|report"
  plopfile.mjs` → нет генераторов страниц.

### T14: CI и деплой (AC-22, AC-23)
- ACTION: переписать `.github/workflows/deploy.yml`, добавить `.nvmrc`, `docs/deploy.md`.
- IMPLEMENT: триггеры `push: master`, `pull_request`, `workflow_dispatch`. Job `check`: install
  `--frozen-lockfile`, `lint`, `test`, `build`, `check:seo`, `build:storybook`. Job `deploy` (только
  `push`/`dispatch`, `needs: check`) выкладывает `apps/website/dist`. `pnpm/action-setup` без `version`
  (читает `packageManager`); `actions/setup-node` с `node-version-file: .nvmrc`. В `.nvmrc` — мажор
  текущего LTS по `https://nodejs.org/dist/index.json`, не ниже 20.16 (`package.json` `engines`). Версии
  actions — последние мажоры, проверить на страницах релизов. `docs/deploy.md`: репозиторий
  `moscowcss-meetup/website`, Pages → Source «GitHub Actions», custom domain `css.moscow`, DNS A
  185.199.108–111.153 и AAAA 2606:50c0:8000–8003::153. Файл CNAME не нужен (docs.github.com,
  проверено 2026-11-03).
- GOTCHA: артефакт Pages собирается из `dist` после pagefind, иначе поиск на проде пуст. В PR деплоя
  нет.
- VALIDATE: `actionlint .github/workflows/deploy.yml`, если установлен, иначе `pnpm dlx` версия
  [UNVERIFIED: наличие npm-обёртки]. Минимум — YAML валиден (`node -e` с `yaml`). Локально та же
  последовательность команд проходит.

### T15: Документация агентов и пакетов (AC-2)
- ACTION: обновить корневые `CLAUDE.md`/`AGENTS.md` (раскладка, контент, og, i18n, шкала, тесты,
  скрипты), `apps/website`, `packages/design-system`, `packages/ui`; создать twins для
  `packages/content` (если в T05 не полные) и `packages/og`.
- IMPLEMENT: §1 дерево, §4 скрипты (`test`, `new:*`, `check:seo`), §5 модель шкалы по ADR-002 вместо
  «t-shirt scale bumps m/l/xxl», §9 website. Перед правкой прочитать раздел, после — синхронизировать
  twin копированием.
- VALIDATE: `for d in . apps/* packages/*; do [ -f $d/CLAUDE.md ] && cmp $d/CLAUDE.md $d/AGENTS.md;
  done` молчит; `grep -n "bumps" CLAUDE.md` → 0.

### T16: Итоговая проверка (AC-21, AC-22, все)
- ACTION: полный прогон и финальное сравнение скриншотов.
- VALIDATE: `pnpm install --frozen-lockfile && pnpm lint && pnpm test && pnpm build && pnpm --filter
  website check:seo && pnpm build:storybook` → все 0. Финальный `capture` + `compare` к
  `.visual/baseline` (сборка с `BUILD_NOW`) → ≤0.1%. Снимок 3840px: `getComputedStyle(html).fontSize` =
  `32px`, на 1920 — `16px` (AC-20). `python3 …/artifact_lint.py --strict` → без ERROR.

---

## Testing Strategy
| Test | Input | Expected | Edge |
|---|---|---|---|
| scale resolver | `resolveAt(layout.gap.xxl, 1919/1920)` | 2rem / 2.5rem | граница порога |
| catalog refs | talk → `nobody` | Error c `filePath` и `nobody` | да |
| translation invariants | en `time` ≠ ru | Error c путём и `time` | да |
| speaker across events | фикстура 10 и 15 | 2 доклада, ссылки на оба митапа | да |
| upcoming | now после всех дат | последний, `past: true` | да |
| upcoming | два будущих | ближайший по дате | да |
| i18n keys | `ui.ru` vs `ui.en` | одинаковые ключи | |
| og render | кириллица, 3 строки заголовка | PNG 1200×630, без исключения | длинный заголовок |
| seo checks | HTML без `twitter:image` | ошибка с путём страницы | |
| new-entry | файл существует | exit 1, ничего не создано | частичный конфликт |

## Validation Commands
```bash
pnpm lint            # EXPECT: 0
pnpm test            # EXPECT: все пакеты с test зелёные
pnpm build           # EXPECT: 0, dist с pagefind и og
pnpm --filter website check:seo   # EXPECT: OK
pnpm build:storybook # EXPECT: 0
node tools/visual/compare.mjs .visual/baseline .visual/<run>  # EXPECT: ≤0.1% на снимок
```

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Storybook в `server`-режиме нестабилен для снимков (асинхронный рендер) | M | H | ждать содержимое `#storybook-root` и `fonts.ready`; T01 VALIDATE требует повторяемости 0% |
| Markdown FAQ даёт иной DOM, чем ручная разметка → паритет FAQ падает | H | M | жёсткие переносы, сброс отступа `p` в `Card`; паритет проверяется в T08 |
| Митап 31 уже прошёл → Hero без регистрации и не совпадает с базой | H | M | `BUILD_NOW` только для снимков (T08) |
| rem вместо px в бордерах даёт субпиксель при масштабе браузера | L | L | при 16px значение идентично; ≤1920 корень = 100% |
| TTF из master Montserrat чуть отличается метриками от woff2 сайта | L | L | карточка — отдельная картинка, сайт её не использует; версия зафиксирована sha256 |
| satori не поддерживает какой-то стиль карточки | M | L | `onStyleError: throw` + тест |
| Pagefind не различает языки без `lang` | L | M | `<html lang>` ставит `BaseLayout`; проверка в T11 |
| `pnpm add` latest тянет несовместимый satori/sharp с Node | L | M | тесты og в T10 |

## Acceptance Criteria (плана)
- [ ] Все задачи выполнены, их VALIDATE проходят; AC-1…AC-23 спеки (кроме снятого AC-14) закрыты.
- [ ] Нет литералов в px в `.css.ts` компонентов и секций, текста в `.astro` секций и страниц.
- [ ] Снимки ≤0.1% к базе на 375–1920.

## Unresolved Questions
- Нет блокирующих. Вычитка английских текстов и написание имён спикеров латиницей — за редакцией
  (открытые вопросы спеки).
