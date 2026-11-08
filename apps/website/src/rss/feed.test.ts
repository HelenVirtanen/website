import { describe, expect, it, vi } from 'vitest';
import { event, news, talk } from '../test/fixtures';
import { feedItemsOf, feedPath, isNewsPath, localeOfFeed, newestNewsDate, newsFeedItemsOf, newsFeedPath } from './feed';

vi.mock('astro:content', () => ({ getCollection: vi.fn() }));
vi.mock('astro:i18n', () => ({
  getRelativeLocaleUrl: (locale: string, path = '') =>
    `/${locale === 'ru' ? '' : `${locale}/`}${path === '' ? '' : `${path}/`}`,
}));

const events = [
  event('ru/10', { date: new Date('2024-03-14T18:00:00+03:00'), tagline: 'Десятый митап' }),
  event('ru/15', { date: new Date('2025-02-20T18:00:00+03:00'), tagline: 'Пятнадцатый митап' }),
  event('ru/16', { date: new Date('2025-06-01T18:00:00+03:00'), draft: true }),
  event('en/10', { date: new Date('2024-03-14T18:00:00+03:00'), tagline: 'Meetup 10' }),
];
const talks = [
  talk('ru/b', { event: '15', time: '19:40', title: 'Второй доклад' }),
  talk('ru/a', { event: '15', time: '19:10', title: 'Первый доклад' }),
];

describe('feedPath', () => {
  it('у языка по умолчанию лента в корне, у остальных — под префиксом, без слэша', () => {
    expect(feedPath('ru')).toBe('/rss.xml');
    expect(feedPath('en')).toBe('/en/rss.xml');
  });
});

describe('localeOfFeed', () => {
  it('язык берётся из префикса адреса, без префикса — язык по умолчанию', () => {
    expect(localeOfFeed('/en/rss.xml/')).toBe('en');
    expect(localeOfFeed('/rss.xml/')).toBe('ru');
    expect(localeOfFeed('/english/rss.xml')).toBe('ru');
  });
});

describe('feedItemsOf', () => {
  const items = feedItemsOf('ru', events, talks);

  it('только опубликованные митапы своего языка, новые сверху', () => {
    expect(items.map((item) => item.title)).toEqual(['Пятнадцатый митап', 'Десятый митап']);
  });

  it('ссылка на страницу митапа, дата — начало встречи', () => {
    expect(items[0]).toMatchObject({
      link: '/events/15/',
      pubDate: new Date('2025-02-20T18:00:00+03:00'),
    });
  });

  it('описание: когда, где и доклады по порядку времени', () => {
    expect(items[0]?.description).toBe(
      '20 февраля 2025 в 18:00, Звук, Москва. Доклады: Первый доклад; Второй доклад.',
    );
    expect(items[1]?.description).toBe('14 марта 2024 в 18:00, Звук, Москва.');
  });

  it('английская лента — свои записи и адреса под /en/', () => {
    expect(feedItemsOf('en', events, talks)).toMatchObject([{ title: 'Meetup 10', link: '/en/events/10/' }]);
  });
});

describe('лента новостей', () => {
  const entries = [
    news('ru/old', { date: new Date('2025-04-09T00:00:00Z'), title: 'Старая', tags: [] }),
    news('ru/new', { date: new Date('2026-11-08T00:00:00Z'), title: 'Свежая', tags: ['Сайт'] }),
    news('ru/draft', { date: new Date('2026-12-01T00:00:00Z'), draft: true }),
    news('en/new', { date: new Date('2026-11-08T00:00:00Z'), title: 'Fresh' }),
  ];

  it('адрес под разделом новостей языка, без слэша', () => {
    expect(newsFeedPath('ru')).toBe('/news/rss.xml');
    expect(newsFeedPath('en')).toBe('/en/news/rss.xml');
    expect(localeOfFeed('/en/news/rss.xml/')).toBe('en');
  });

  it('опубликованные новости языка, свежие сверху, с темами и полным текстом', () => {
    const items = newsFeedItemsOf('ru', entries);
    expect(items.map((item) => item.title)).toEqual(['Свежая', 'Старая']);
    expect(items[0]).toMatchObject({ link: '/news/new/', categories: ['Сайт'], description: expect.any(String) });
    expect(items[1]?.categories).toBeUndefined();
    expect(newsFeedItemsOf('en', entries).map((item) => item.link)).toEqual(['/en/news/new/']);
  });

  it('дата сборки канала — самая свежая новость языка', () => {
    expect(newestNewsDate('ru', entries)?.toISOString()).toBe('2026-11-08T00:00:00.000Z');
    expect(newestNewsDate('ru', [])).toBeUndefined();
  });

  it('лента новостей объявлена только в разделе новостей', () => {
    expect(isNewsPath('ru', '/news/')).toBe(true);
    expect(isNewsPath('en', '/en/news/new-site/')).toBe(true);
    expect(isNewsPath('ru', '/events/')).toBe(false);
  });
});
