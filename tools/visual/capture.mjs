import { execFileSync } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './browser.mjs';

const SITE_URL = process.env.SITE_URL ?? 'http://localhost:4321/';
const STORYBOOK_URL = (process.env.STORYBOOK_URL ?? 'http://localhost:6006').replace(/\/$/, '');

const WIDTHS = [375, 768, 1024, 1280, 1440, 1920];
const VIEWPORT_HEIGHT = 900;
const STORY_TIMEOUT_MS = 30_000;
const PAGE_TIMEOUT_MS = 30_000;

const REPO_ROOT = fileURLToPath(new URL('../../', import.meta.url));
const VISUAL_ROOT = resolve(REPO_ROOT, '.visual');

const outDir = process.argv[2];
if (!outDir) {
  console.error('Использование: node tools/visual/capture.mjs <out-dir>');
  process.exit(2);
}
// Каталог снимков перед съёмкой стирается целиком, поэтому разрешаем только подкаталоги .visual/:
// опечатка в аргументе (`.`, `..`) иначе снесла бы рабочее дерево.
const outPath = resolve(outDir);
if (!outPath.startsWith(VISUAL_ROOT + sep)) {
  console.error(`ОШИБКА: каталог снимков должен лежать внутри ${relative(process.cwd(), VISUAL_ROOT) || '.visual'}/, получено ${outDir}`);
  process.exit(2);
}

// Код, с которого сняты снимки, может лежать в другом worktree (эталон со старого коммита).
const SOURCE_ROOT = process.env.VISUAL_SOURCE_DIR ?? REPO_ROOT;
const git = (...args) => execFileSync('git', args, { cwd: SOURCE_ROOT, encoding: 'utf8' }).trim();

const failures = [];
const fail = (message) => {
  failures.push(message);
  console.error(`ОШИБКА: ${message}`);
};

const safeName = (value) => value.replace(/[^a-zA-Z0-9._-]+/g, '_');

// Шрифты и lazy-картинки должны догрузиться, иначе снимки недетерминированы.
async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight, 1);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    window.scrollTo(0, 0);
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? undefined : new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        }),
      ),
    );
  });
  await page.evaluate(() => document.fonts.ready);
}

async function captureSite(page) {
  const dir = join(outDir, 'site');
  await mkdir(dir, { recursive: true });
  let count = 0;
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
    try {
      await page.goto(SITE_URL, { waitUntil: 'load', timeout: PAGE_TIMEOUT_MS });
    } catch (error) {
      throw new Error(`сайт недоступен по ${SITE_URL} (запущен ли astro preview?): ${error.message}`);
    }
    await settle(page);
    const names = await page.$$eval('[data-visual]', (nodes) => nodes.map((node) => node.dataset.visual));
    if (names.length === 0) throw new Error(`на ${SITE_URL} не найдено ни одного [data-visual]`);
    for (const name of names) {
      try {
        // Липкая шапка перекрывает верх соседних секций: на их снимках прячем её (место в потоке остаётся),
        // иначе любая правка шапки «ломала» бы снимки секций, которые не менялись.
        await page.evaluate((current) => {
          for (const node of document.querySelectorAll('[data-visual]')) {
            if (node instanceof HTMLElement) node.style.visibility = node.dataset.visual === current ? '' : 'hidden';
          }
        }, name);
        await page.locator(`[data-visual="${name}"]`).first().screenshot({
          path: join(dir, `${safeName(name)}@${width}.png`),
          animations: 'disabled',
          timeout: PAGE_TIMEOUT_MS,
        });
        count += 1;
      } catch (error) {
        fail(`снимок site/${name}@${width}: ${error.message}`);
      }
    }
  }
  return count;
}

async function loadStoryIds() {
  let response;
  try {
    response = await fetch(`${STORYBOOK_URL}/index.json`);
  } catch (error) {
    throw new Error(`Storybook недоступен по ${STORYBOOK_URL} (запущен ли pnpm storybook?): ${error.message}`);
  }
  if (!response.ok) throw new Error(`${STORYBOOK_URL}/index.json вернул HTTP ${response.status}`);
  const index = await response.json();
  return Object.values(index.entries ?? index.stories ?? {})
    .filter((entry) => entry.type === 'story')
    .map((entry) => entry.id)
    .sort();
}

async function captureStories(page) {
  const dir = join(outDir, 'stories');
  await mkdir(dir, { recursive: true });
  const ids = await loadStoryIds();
  if (ids.length === 0) throw new Error(`в ${STORYBOOK_URL}/index.json нет ни одной стори`);
  let count = 0;
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
    for (const id of ids) {
      try {
        await page.goto(`${STORYBOOK_URL}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`, {
          waitUntil: 'load',
          timeout: STORY_TIMEOUT_MS,
        });
        // renderMode 'server': стори дорисовывается асинхронно после load.
        await page.waitForFunction(
          () => {
            const root = document.querySelector('#storybook-root');
            return root !== null && root.children.length > 0;
          },
          undefined,
          { timeout: STORY_TIMEOUT_MS },
        );
        await settle(page);
        const root = page.locator('#storybook-root');
        const path = join(dir, `${safeName(id)}@${width}.png`);
        const box = await root.boundingBox();
        if (box && (box.width === 0 || box.height === 0)) {
          // Стори с нулевым размером (height: 100% без высоты у родителя): элемент Playwright не снимает,
          // фиксируем полоску в 1px — появление ненулевого размера всё равно даст расхождение.
          await page.screenshot({
            path,
            clip: { x: box.x, y: box.y, width: Math.max(box.width, 1), height: Math.max(box.height, 1) },
            animations: 'disabled',
            timeout: STORY_TIMEOUT_MS,
          });
        } else {
          await root.screenshot({ path, animations: 'disabled', timeout: STORY_TIMEOUT_MS });
        }
        count += 1;
      } catch (error) {
        fail(`стори ${id}@${width}: ${error.message.split('\n')[0]}`);
      }
    }
  }
  return { count, stories: ids.length };
}

await rm(outPath, { recursive: true, force: true });
await mkdir(outPath, { recursive: true });

const browser = await launchBrowser({ args: ['--font-render-hinting=none'] }).catch((error) => {
  console.error(`ОШИБКА: ${error.message}`);
  process.exit(1);
});

try {
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
    viewport: { width: WIDTHS[0], height: VIEWPORT_HEIGHT },
  });
  // Swiper (CardSlider) гоняет ResizeObserver по кругу и каждый кадр меняет высоту на доли пикселя:
  // элемент «нестабилен» и снимки недетерминированы. Глушим наблюдатель только в тулинге.
  await context.addInitScript(() => {
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });
  // Внешние ресурсы (Яндекс.Карты в iframe) грузятся по сети и дают разные пиксели от запуска к запуску:
  // чужие origin отдаём пустыми, свои (сайт, Storybook) пропускаем.
  const ownOrigins = new Set([new URL(SITE_URL).origin, new URL(STORYBOOK_URL).origin]);
  await context.route('**/*', (route) => {
    const request = route.request();
    const { protocol, origin } = new URL(request.url());
    if (protocol === 'data:' || protocol === 'blob:' || ownOrigins.has(origin)) return route.continue();
    if (request.resourceType() === 'document') {
      return route.fulfill({ status: 200, contentType: 'text/html', body: '' });
    }
    return route.abort();
  });
  const page = await context.newPage();

  const siteCount = await captureSite(page);
  console.log(`сайт: ${siteCount} снимков`);
  const { count: storyCount, stories } = await captureStories(page);
  console.log(`Storybook: ${storyCount} снимков, стори: ${stories}`);
} catch (error) {
  fail(error.message);
} finally {
  // Манифест связывает снимки с кодом: compare показывает, с какого коммита и чистого ли дерева сняты база и проверка.
  await writeFile(
    join(outPath, 'manifest.json'),
    JSON.stringify(
      {
        commit: git('rev-parse', 'HEAD'),
        dirty: git('status', '--porcelain') !== '',
        capturedAt: new Date().toISOString(),
        chromium: browser.version(),
        siteUrl: SITE_URL,
        storybookUrl: STORYBOOK_URL,
      },
      null,
      2,
    ),
  );
  await browser.close();
}

if (failures.length > 0) {
  console.error(`\nИтого ошибок: ${failures.length}`);
  process.exit(1);
}
