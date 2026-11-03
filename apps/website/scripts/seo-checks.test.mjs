import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { checkDist, pngSize } from './seo-checks.mjs';

const SITE = 'https://css.moscow';

const png = (width, height) => {
  const bytes = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(bytes);
  bytes.writeUInt32BE(width, 16);
  bytes.writeUInt32BE(height, 20);
  return bytes;
};

const page = ({ lang = 'ru', path, alternates = [], noindex = false, omit = [], ogWidth = 1200, ogHeight = 630, ogLocale = lang === 'en' ? 'en_US' : 'ru_RU', links = '' }) => {
  const url = `${SITE}${path}`;
  const img = `${SITE}/og${path.endsWith('/') ? `${path}index` : path}`;
  const tags = [
    ['name', 'description', 'Описание'],
    ['property', 'og:title', 'T'],
    ['property', 'og:description', 'D'],
    ['property', 'og:type', 'website'],
    ['property', 'og:url', url],
    ['property', 'og:locale', ogLocale],
    ['property', 'og:site_name', 'S'],
    ['property', 'og:image', `${img}.png`],
    ['property', 'og:image:type', 'image/png'],
    ['property', 'og:image:width', String(ogWidth)],
    ['property', 'og:image:height', String(ogHeight)],
    ['property', 'og:image:alt', 'A'],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', 'T'],
    ['name', 'twitter:description', 'D'],
    ['name', 'twitter:image', `${img}.twitter.png`],
    ['name', 'twitter:image:alt', 'A'],
  ]
    .filter(([, key]) => !omit.includes(key))
    .map(([attr, key, value]) => `<meta ${attr}="${key}" content="${value}">`)
    .join('\n');
  const alts = alternates.map(([l, h]) => `<link rel="alternate" hreflang="${l}" href="${h}">`).join('\n');
  return noindex
    ? `<!doctype html><html lang="${lang}"><head><title>t</title><meta name="robots" content="noindex, follow"></head><body></body></html>`
    : `<!doctype html><html lang="${lang}"><head><title>t</title>\n${tags}\n<link rel="canonical" href="${url}">\n${alts}${links}</head><body></body></html>`;
};

let dist;
const put = async (file, content) => {
  const full = join(dist, file);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, content);
};
const cards = async (name) => {
  await put(`og/${name}.png`, png(1200, 630));
  await put(`og/${name}.twitter.png`, png(1200, 600));
};

const pair = [
  ['ru', `${SITE}/`],
  ['en', `${SITE}/en/`],
  ['x-default', `${SITE}/`],
];
const enPair = [
  ['ru', `${SITE}/`],
  ['en', `${SITE}/en/`],
];

async function validSite() {
  await put('index.html', page({ path: '/', alternates: pair }));
  await put('en/index.html', page({ lang: 'en', path: '/en/', alternates: enPair }));
  await cards('index');
  await cards('en/index');
}

beforeEach(async () => {
  dist = await mkdtemp(join(tmpdir(), 'seo-checks-'));
});
afterEach(() => rm(dist, { recursive: true, force: true }));

describe('pngSize', () => {
  it('читает размеры из IHDR', () => expect(pngSize(png(1200, 630))).toEqual({ width: 1200, height: 630 }));
  it('не PNG — undefined', () => expect(pngSize(Buffer.from('not a png at all, definitely'))).toBeUndefined());
});

describe('checkDist', () => {
  it('валидный сайт проходит', async () => {
    await validSite();
    expect(await checkDist(dist, SITE)).toEqual({ errors: [], htmlCount: 2, indexableCount: 2 });
  });

  it('ловит отсутствие twitter:image', async () => {
    await validSite();
    await put('index.html', page({ path: '/', alternates: pair, omit: ['twitter:image'] }));
    const { errors } = await checkDist(dist, SITE);
    expect(errors).toEqual(['index.html: нет <meta name="twitter:image">']);
  });

  it.each(['description', 'og:image:alt', 'og:locale', 'twitter:card'])('ловит отсутствие %s', async (tag) => {
    await validSite();
    await put('index.html', page({ path: '/', alternates: pair, omit: [tag] }));
    const { errors } = await checkDist(dist, SITE);
    expect(errors.some((e) => e.startsWith('index.html') && e.includes(tag))).toBe(true);
  });

  it('ловит PNG неверного размера у og:image', async () => {
    await validSite();
    await put('og/index.png', png(800, 600));
    const { errors } = await checkDist(dist, SITE);
    expect(errors.some((e) => e.startsWith('index.html') && e.includes('800×600'))).toBe(true);
  });

  it('ловит twitter:image не 1200×600', async () => {
    await validSite();
    await put('og/en/index.twitter.png', png(1200, 630));
    const { errors } = await checkDist(dist, SITE);
    expect(errors.some((e) => e.startsWith('en/index.html') && e.includes('нужно 1200×600'))).toBe(true);
  });

  it('ловит расхождение og:image:width/height с файлом', async () => {
    await validSite();
    await put('index.html', page({ path: '/', alternates: pair, ogWidth: 1000 }));
    const { errors } = await checkDist(dist, SITE);
    expect(errors.some((e) => e.includes('og:image:width/height'))).toBe(true);
  });

  it('ловит отсутствующий файл карточки', async () => {
    await validSite();
    await rm(join(dist, 'og/index.png'));
    const { errors } = await checkDist(dist, SITE);
    expect(errors).toEqual(['index.html: og:image /og/index.png: файла нет в dist']);
  });

  it('ловит og:image на чужом домене', async () => {
    await validSite();
    const html = page({ path: '/', alternates: pair }).replace(`${SITE}/og/index.png`, 'https://evil.example/og/index.png');
    await put('index.html', html);
    const { errors } = await checkDist(dist, SITE);
    expect(errors.some((e) => e.includes('не абсолютный адрес'))).toBe(true);
  });

  it('пустой dist — провал, а не зелёный гейт', async () => {
    const { errors, indexableCount } = await checkDist(dist, SITE);
    expect(indexableCount).toBe(0);
    expect(errors.some((e) => e.includes('нет ни одной индексируемой страницы'))).toBe(true);
  });

  it('ловит og:locale, не совпадающий с <html lang>', async () => {
    await validSite();
    await put('en/index.html', page({ lang: 'en', path: '/en/', alternates: enPair, ogLocale: 'ru_RU' }));
    const { errors } = await checkDist(dist, SITE);
    expect(errors.some((e) => e.startsWith('en/index.html') && e.includes('og:locale ru_RU'))).toBe(true);
  });

  it('noindex-страница не проверяется', async () => {
    await validSite();
    await put('search/index.html', page({ path: '/search/', noindex: true }));
    expect(await checkDist(dist, SITE)).toEqual({ errors: [], htmlCount: 3, indexableCount: 2 });
  });

  it('ловит невзаимный hreflang', async () => {
    await validSite();
    await put('en/index.html', page({ lang: 'en', path: '/en/', alternates: [['en', `${SITE}/en/`]] }));
    const { errors } = await checkDist(dist, SITE);
    expect(errors.some((e) => e.startsWith('index.html') && e.includes('не взаимный'))).toBe(true);
  });

  it('ловит hreflang на несуществующую страницу', async () => {
    await validSite();
    await put('index.html', page({ path: '/', alternates: [...pair, ['en', `${SITE}/en/nope/`]] }));
    const { errors } = await checkDist(dist, SITE);
    expect(errors.some((e) => e.includes('нет такой страницы'))).toBe(true);
  });

  describe('RSS', () => {
    const feedLink = (href, title = 'Митапы') =>
      `<link rel="alternate" type="application/rss+xml"${title ? ` title="${title}"` : ''} href="${href}">`;
    const feed = (...links) => feedIn('ru', ...links);
    const feedIn = (language, ...links) =>
      `<rss><channel><link>${SITE}/</link><language>${language}-XX</language>${links.map((l) => `<item><link>${l}</link></item>`).join('')}</channel></rss>`;

    it('ссылка на ленту сборки и записи на её страницы — проходит', async () => {
      await validSite();
      await put('index.html', page({ path: '/', alternates: pair, links: feedLink(`${SITE}/rss.xml`) }));
      await put('rss.xml', feed(`${SITE}/`));
      await put('en/rss.xml', feedIn('en', `${SITE}/en/`));
      expect((await checkDist(dist, SITE)).errors).toEqual([]);
    });

    it.each([
      ['без title', feedLink(`${SITE}/rss.xml`, ''), 'index.html: RSS https://css.moscow/rss.xml: нет title'],
      ['на несуществующую ленту', feedLink(`${SITE}/en/rss.xml`), 'index.html: RSS /en/rss.xml: в сборке нет такой ленты'],
      ['на HTML вместо ленты', feedLink(`${SITE}/en/`), 'index.html: RSS /en/: в сборке нет такой ленты'],
    ])('ссылка %s — ошибка', async (_name, links, error) => {
      await validSite();
      await put('index.html', page({ path: '/', alternates: pair, links }));
      await put('rss.xml', feed());
      expect((await checkDist(dist, SITE)).errors).toEqual([error]);
    });

    it('запись ленты без слэша или на несуществующую страницу — ошибка', async () => {
      await validSite();
      await put('en/rss.xml', feedIn('en', `${SITE}/en`, `${SITE}/en/events/99/`));
      expect((await checkDist(dist, SITE)).errors).toEqual([
        'en/rss.xml: ссылка https://css.moscow/en: нет такой страницы в сборке',
        'en/rss.xml: ссылка https://css.moscow/en/events/99/: нет такой страницы в сборке',
      ]);
    });

    it('английская лента с русским языком и русскими записями — ошибка', async () => {
      await validSite();
      await put('en/rss.xml', feedIn('ru', `${SITE}/`));
      expect((await checkDist(dist, SITE)).errors).toEqual([
        'en/rss.xml: <language>ru-XX</language>, ожидался en',
        'en/rss.xml: ссылка https://css.moscow/: страница языка ru в ленте en',
      ]);
    });
  });
});
