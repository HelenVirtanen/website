import { describe, expect, it } from 'vitest';
import { robotsOf, sitemapOf } from './sitemap';
import { xml } from './xml';

const site = new URL('https://css.moscow');
const alternates = [
  { locale: 'ru' as const, path: '/events/31/' },
  { locale: 'en' as const, path: '/en/events/31/' },
];

describe('sitemapOf', () => {
  const text = sitemapOf(
    [
      { path: '/en/events/31/', alternates },
      { path: '/events/31/', alternates },
    ],
    site,
  );

  it('каждая страница — абсолютный адрес, по порядку пути', () => {
    const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locs).toEqual(['https://css.moscow/en/events/31/', 'https://css.moscow/events/31/']);
  });

  it('у страницы её языковые версии и x-default на языке по умолчанию', () => {
    expect(text).toContain('hreflang="en" href="https://css.moscow/en/events/31/"');
    expect(text).toContain('hreflang="x-default" href="https://css.moscow/events/31/"');
  });

  it('без lastmod: даты правки у контента нет', () => {
    expect(text).not.toContain('lastmod');
  });
});

describe('xml', () => {
  it('экранирует спецсимволы текста и атрибутов', () => {
    expect(xml(`a&b<c>"d'`)).toBe('a&amp;b&lt;c&gt;&quot;d&apos;');
  });
});

describe('robotsOf', () => {
  it('открывает сайт и ведёт на карту по абсолютному адресу', () => {
    expect(robotsOf(site)).toBe('User-agent: *\nAllow: /\n\nSitemap: https://css.moscow/sitemap.xml\n');
  });
});
