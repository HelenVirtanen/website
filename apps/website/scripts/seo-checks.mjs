// Проверки собранного сайта: библиотека для CLI scripts/check-seo.mjs и тестов.
// Для каждой индексируемой страницы (без noindex) требуются теги карточки и ссылок,
// картинки лежат в dist и имеют заявленный размер, hreflang взаимен.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { parse } from 'parse5';

const LOCALES = new Set(['ru', 'en']);
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// Размеры карточек: og:image — 1200×630, twitter:image — 1200×600.
const OG_SIZE = { width: 1200, height: 630 };
const TWITTER_SIZE = { width: 1200, height: 600 };

const REQUIRED_NAME = [
  'description',
  'twitter:card',
  'twitter:title',
  'twitter:description',
  'twitter:image',
  'twitter:image:alt',
];
const REQUIRED_PROPERTY = [
  'og:title',
  'og:description',
  'og:type',
  'og:url',
  'og:locale',
  'og:site_name',
  'og:image',
  'og:image:type',
  'og:image:width',
  'og:image:height',
  'og:image:alt',
];

const relPosix = (from, to) => relative(from, to).split(sep).join('/');

function* walk(node) {
  yield node;
  for (const child of node.childNodes ?? []) yield* walk(child);
  if (node.content) yield* walk(node.content);
}
const attr = (el, name) => el?.attrs?.find((a) => a.name === name)?.value;
const textOf = (el) => (el?.childNodes ?? []).map((c) => c.value ?? textOf(c)).join('');

async function listFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listFiles(full)));
    else out.push(full);
  }
  return out;
}

function documentOf(html) {
  const els = [...walk(parse(html))].filter((n) => n.tagName);
  const meta = (key, value) => els.find((e) => e.tagName === 'meta' && attr(e, key) === value);
  const links = (rel) => els.filter((e) => e.tagName === 'link' && attr(e, 'rel') === rel);
  const title = textOf(els.find((e) => e.tagName === 'title')).trim();
  return { els, meta, links, title };
}

/** Ширина и высота PNG из заголовка IHDR; undefined — не PNG. */
export function pngSize(bytes) {
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) return undefined;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function createContext(dist, siteUrl) {
  const site = new URL(siteUrl);
  const errors = [];
  return {
    dist,
    site,
    errors,
    fail: (where, message) => errors.push(`${where}: ${message}`),
    readPublic: (path) => readFile(join(dist, decodeURIComponent(path))).catch(() => null),
    urlOfFile(file) {
      const rel = relPosix(dist, file);
      return new URL(rel.endsWith('index.html') ? rel.slice(0, -'index.html'.length) : rel, site).href;
    },
  };
}

const isIndexable = (doc) => !/noindex/i.test(attr(doc.meta('name', 'robots'), 'content') ?? '');

function checkRequiredTags(ctx, where, doc) {
  const content = (key, value) => attr(doc.meta(key, value), 'content')?.trim();
  for (const name of REQUIRED_NAME) {
    if (!content('name', name)) ctx.fail(where, `нет <meta name="${name}">`);
  }
  for (const property of REQUIRED_PROPERTY) {
    if (!content('property', property)) ctx.fail(where, `нет <meta property="${property}">`);
  }
  if (!attr(doc.links('canonical')[0], 'href')) ctx.fail(where, 'нет <link rel="canonical">');
  const card = content('name', 'twitter:card');
  if (card && card !== 'summary_large_image') ctx.fail(where, `twitter:card = ${card}, нужен summary_large_image`);
}

function checkAbsolute(ctx, where, url, value, label) {
  if (!value) return null;
  if (!URL.canParse(value, url)) {
    ctx.fail(where, `${label}: некорректный URL ${value}`);
    return null;
  }
  if (!value.startsWith(ctx.site.origin + '/')) {
    ctx.fail(where, `${label} не абсолютный адрес на ${ctx.site.origin}: ${value}`);
    return null;
  }
  return new URL(value);
}

async function checkImage(ctx, where, url, doc, { tag, key, expected, declared }) {
  const content = attr(doc.meta(key, tag), 'content');
  const target = checkAbsolute(ctx, where, url, content, tag);
  if (!target) return;
  const bytes = await ctx.readPublic(target.pathname);
  if (!bytes) {
    ctx.fail(where, `${tag} ${target.pathname}: файла нет в dist`);
    return;
  }
  const size = pngSize(bytes);
  if (!size) {
    ctx.fail(where, `${tag} ${target.pathname}: не PNG`);
    return;
  }
  if (size.width !== expected.width || size.height !== expected.height) {
    ctx.fail(where, `${tag} ${target.pathname}: ${size.width}×${size.height}, нужно ${expected.width}×${expected.height}`);
  }
  if (declared) {
    const w = attr(doc.meta('property', 'og:image:width'), 'content');
    const h = attr(doc.meta('property', 'og:image:height'), 'content');
    if (w && h && (String(size.width) !== w || String(size.height) !== h)) {
      ctx.fail(where, `og:image:width/height ${w}×${h} ≠ размер файла ${target.pathname}: ${size.width}×${size.height}`);
    }
  }
}

async function checkPage(ctx, where, url, doc) {
  checkRequiredTags(ctx, where, doc);

  const canonical = attr(doc.links('canonical')[0], 'href');
  const canonicalUrl = checkAbsolute(ctx, where, url, canonical, 'canonical');
  if (canonicalUrl && canonicalUrl.href !== url) ctx.fail(where, `canonical ${canonical} ≠ адрес страницы ${url}`);
  const ogUrl = attr(doc.meta('property', 'og:url'), 'content');
  if (checkAbsolute(ctx, where, url, ogUrl, 'og:url') && ogUrl !== canonical) {
    ctx.fail(where, `og:url ${ogUrl} ≠ canonical ${canonical}`);
  }

  await checkImage(ctx, where, url, doc, { tag: 'og:image', key: 'property', expected: OG_SIZE, declared: true });
  await checkImage(ctx, where, url, doc, { tag: 'twitter:image', key: 'name', expected: TWITTER_SIZE });
}

function alternatesOf(doc) {
  return new Map(doc.links('alternate').filter((l) => attr(l, 'hreflang')).map((l) => [attr(l, 'hreflang'), attr(l, 'href')]));
}

function checkHreflang(ctx, pages) {
  for (const [url, page] of pages) {
    if (!page.indexable) continue;
    for (const [lang, href] of page.alternates) {
      if (lang !== 'x-default' && !LOCALES.has(lang)) {
        ctx.fail(page.where, `hreflang ${lang} не из ${[...LOCALES]}`);
        continue;
      }
      if (!href?.startsWith(ctx.site.origin + '/')) {
        ctx.fail(page.where, `hreflang ${lang} не на ${ctx.site.origin}: ${href}`);
        continue;
      }
      const target = pages.get(href);
      if (!target) ctx.fail(page.where, `hreflang ${lang} → ${href}: нет такой страницы`);
      else if (!target.indexable) ctx.fail(page.where, `hreflang ${lang} → noindex-страница ${href}`);
      else if (lang !== 'x-default') {
        const back = [...target.alternates].filter(([l]) => l !== 'x-default').map(([, h]) => h);
        if (!back.includes(url)) ctx.fail(page.where, `hreflang ${lang} → ${href} не взаимный`);
      }
    }
  }
}

/** Проверяет собранный `dist`: `{ errors, htmlCount, indexableCount }`. */
export async function checkDist(dist, siteUrl) {
  const ctx = createContext(dist, siteUrl);
  const files = (await listFiles(dist)).filter((f) => f.endsWith('.html')).sort();
  const pages = new Map();

  for (const file of files) {
    const where = relPosix(dist, file);
    const doc = documentOf(await readFile(file, 'utf8'));
    pages.set(ctx.urlOfFile(file), { where, doc, indexable: isIndexable(doc), alternates: alternatesOf(doc) });
  }

  let indexableCount = 0;
  for (const [url, page] of pages) {
    if (!page.indexable) continue;
    indexableCount += 1;
    await checkPage(ctx, page.where, url, page.doc);
  }
  checkHreflang(ctx, pages);

  return { errors: ctx.errors, htmlCount: files.length, indexableCount };
}
