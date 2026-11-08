import { describe, expect, it, vi } from 'vitest';
import {
  archiveOf,
  filterArchive,
  filterFromSearch,
  newsNewestFirst,
  newsRowOf,
  relatedNews,
  searchOfFilter,
  topicsInArchive,
  EMPTY_FILTER,
} from './archive';
import { newsDateText, newsPlaceholder } from './news';
import { news } from '../test/fixtures';

vi.mock('astro:content', () => ({ getCollection: vi.fn() }));

const day = (value: string): Date => new Date(`${value}T00:00:00Z`);
const cover = { image: { src: '/c.jpg', width: 1, height: 1, format: 'jpg' as const }, alt: 'Стенд' };

describe('newsNewestFirst', () => {
  it('без черновиков, свежие первыми, в один день — по заголовку', () => {
    const entries = [
      news('ru/old', { date: day('2025-04-09') }),
      news('ru/b', { date: day('2026-11-08'), title: 'Б' }),
      news('ru/draft', { date: day('2026-12-01'), draft: true }),
      news('ru/a', { date: day('2026-11-08'), title: 'А' }),
    ];
    expect(newsNewestFirst(entries).map((entry) => entry.id)).toEqual(['ru/a', 'ru/b', 'ru/old']);
  });
});

describe('newsRowOf', () => {
  it('день по UTC, год числом, фото — если есть обложка или галерея', () => {
    expect(newsRowOf(news('ru/stand', { date: day('2026-05-17'), cover }))).toMatchObject({
      slug: 'stand',
      date: '2026-05-17',
      year: 2026,
      photos: true,
    });
    expect(newsRowOf(news('ru/text')).photos).toBe(false);
  });

  it('archiveOf кладёт новости языка в archive.json', () => {
    const catalog = { events: [], talks: [], speakers: [], news: [news('ru/a'), news('en/a'), news('ru/b', { draft: true })] };
    expect(archiveOf(catalog, 'ru').news.map((item) => item.slug)).toEqual(['a']);
  });
});

describe('relatedNews', () => {
  const self = news('ru/self', { date: day('2026-05-17'), tags: ['Команда'] });
  const entries = [
    self,
    news('ru/far-team', { date: day('2024-01-01'), tags: ['Команда'] }),
    news('ru/near', { date: day('2026-05-20'), tags: ['Сайт'] }),
    news('ru/far', { date: day('2023-01-01'), tags: ['Сайт'] }),
    news('en/self', { date: day('2026-05-17'), tags: ['Team'] }),
  ];

  it('сначала с общей темой, затем ближайшие по дате; без себя и других языков', () => {
    expect(relatedNews(self, entries, 3).map((entry) => entry.id)).toEqual(['ru/far-team', 'ru/near', 'ru/far']);
    expect(relatedNews(self, entries, 1)).toHaveLength(1);
  });
});

describe('фильтр новостей', () => {
  const rows = [
    newsRowOf(news('ru/stand', { date: day('2026-05-17'), title: 'Стенд на HolyJS', tags: ['Конференции', 'Команда'], cover })),
    newsRowOf(news('ru/site', { date: day('2026-11-08'), title: 'Новый сайт', tags: ['Сайт'] })),
    newsRowOf(news('ru/award', { date: day('2026-11-08'), title: 'IT HR Awards', tags: ['Конкурсы', 'Команда'] })),
  ];

  it('тема целиком без регистра, год, фото и слова вместе', () => {
    expect(filterArchive('news', rows, { ...EMPTY_FILTER, topic: 'команда' }).map((row) => row.slug)).toEqual(['stand', 'award']);
    expect(filterArchive('news', rows, { ...EMPTY_FILTER, topic: 'Ком' })).toEqual([]);
    expect(filterArchive('news', rows, { ...EMPTY_FILTER, media: true }).map((row) => row.slug)).toEqual(['stand']);
    expect(filterArchive('news', rows, { ...EMPTY_FILTER, query: 'holyjs', year: 2026 }).map((row) => row.slug)).toEqual(['stand']);
  });

  it('темы списка: частые первыми, при равенстве — по алфавиту', () => {
    expect(topicsInArchive('news', rows, 'ru')).toEqual(['Команда', 'Конкурсы', 'Конференции', 'Сайт']);
  });

  it('тема живёт в адресе страницы', () => {
    const filter = filterFromSearch(new URLSearchParams('topic=%D0%A1%D0%B0%D0%B9%D1%82&year=2026'));
    expect(filter).toEqual({ query: '', year: 2026, media: false, topic: 'Сайт' });
    expect(searchOfFilter(filter)).toBe('?year=2026&topic=%D0%A1%D0%B0%D0%B9%D1%82');
    expect(filterFromSearch(new URLSearchParams('topic=%20%20')).topic).toBeUndefined();
  });
});

describe('дата новости', () => {
  it('словами на языке страницы и крупно для карточки без обложки', () => {
    const entry = news('ru/a', { date: day('2026-05-07') });
    expect(newsDateText(entry, 'ru', '{day} {year}')).toBe('7 мая 2026');
    expect(newsDateText(entry, 'en', '{day}, {year}')).toBe('May 7, 2026');
    expect(newsPlaceholder(entry)).toBe('07.05');
  });
});
