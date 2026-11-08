import { describe, expect, it, vi } from 'vitest';
import { document, event, speaker, talk, twoMeetupsCatalog } from '../test/fixtures';
import { pagesOfKind, publicPagesOf, trimTrailingSlashes } from './pages';

vi.mock('astro:content', () => ({ getCollection: vi.fn() }));
vi.mock('astro:i18n', () => ({
  getRelativeLocaleUrl: (locale: string, path = '') =>
    `/${locale === 'ru' ? '' : `${locale}/`}${path === '' ? '' : `${path}/`}`,
}));

const home = (locale: string) => ({
  id: `${locale}/index`,
  data: { title: 'Главная', description: 'Описание' },
});

const catalog = () => ({ ...twoMeetupsCatalog(), pages: [home('ru'), home('en')] });

describe('publicPagesOf', () => {
  it('даёт главную, списки (с новостями), митапы, доклады и спикеров каждого языка', () => {
    const pages = publicPagesOf(catalog());
    expect(pages.map((page) => page.path).sort()).toEqual(
      [
        '/',
        '/en/',
        '/events/10/',
        '/events/15/',
        '/en/events/10/',
        '/en/events/15/',
        '/talks/css-nesting/',
        '/talks/anchor-positioning/',
        '/en/talks/css-nesting/',
        '/en/talks/anchor-positioning/',
        '/speakers/daria-egorova/',
        '/en/speakers/daria-egorova/',
        '/events/',
        '/talks/',
        '/speakers/',
        '/en/events/',
        '/en/talks/',
        '/en/speakers/',
        '/news/',
        '/en/news/',
      ].sort(),
    );
  });

  it('список: путь под языком, заголовок и описание из словаря, оба языка в alternates', () => {
    const talks = pagesOfKind(publicPagesOf(catalog()), 'list').find((page) => page.path === '/en/talks/');
    expect(talks).toMatchObject({ locale: 'en', slugParam: 'talks', entry: { data: { list: 'talks', title: 'All talks' } } });
    expect(talks?.entry.data.description.length).toBeGreaterThanOrEqual(50);
    expect(talks?.alternates).toEqual([
      { locale: 'ru', path: '/talks/' },
      { locale: 'en', path: '/en/talks/' },
    ]);
  });

  it('документ живёт прямо под языком, без папки раздела; черновик не публичен', () => {
    const pages = publicPagesOf({
      ...catalog(),
      documents: [
        document('ru/personal-data'),
        document('en/personal-data'),
        document('ru/hidden', { draft: true }),
      ],
    });
    const documents = pagesOfKind(pages, 'document');
    expect(documents.map((page) => [page.locale, page.path, page.slugParam])).toEqual([
      ['ru', '/personal-data/', 'personal-data'],
      ['en', '/en/personal-data/', 'personal-data'],
    ]);
    expect(documents[0]?.alternates.map((alternate) => alternate.path)).toEqual([
      '/personal-data/',
      '/en/personal-data/',
    ]);
  });

  it('английские страницы лежат под /en/, русские без префикса', () => {
    const pages = publicPagesOf(catalog());
    const speakerPages = pagesOfKind(pages, 'speaker');
    expect(speakerPages.map((page) => [page.locale, page.path])).toEqual([
      ['ru', '/speakers/daria-egorova/'],
      ['en', '/en/speakers/daria-egorova/'],
    ]);
  });

  it('alternates — версии той же страницы на всех языках, включая саму', () => {
    const page = publicPagesOf(catalog()).find((item) => item.path === '/en/events/10/');
    expect(page?.alternates).toEqual([
      { locale: 'ru', path: '/events/10/' },
      { locale: 'en', path: '/en/events/10/' },
    ]);
  });

  it('у главной alternates ведут на / и /en/', () => {
    const page = publicPagesOf(catalog()).find((item) => item.kind === 'home' && item.locale === 'ru');
    expect(page?.alternates.map((alternate) => alternate.path)).toEqual(['/', '/en/']);
    expect(page?.slugParam).toBeUndefined();
  });

  it('черновик не попадает в список и в alternates живой версии', () => {
    const data = catalog();
    data.events = [
      event('ru/10', { draft: true }),
      event('ru/15'),
      event('en/10'),
      event('en/15'),
    ];
    const pages = publicPagesOf(data);
    expect(pages.some((page) => page.path === '/events/10/')).toBe(false);
    const en = pages.find((page) => page.path === '/en/events/10/');
    expect(en?.alternates).toEqual([{ locale: 'en', path: '/en/events/10/' }]);
  });

  it('черновик доклада и спикера исключается', () => {
    const data = catalog();
    data.talks = [talk('ru/css-nesting', { draft: true })];
    data.speakers = [speaker('ru/daria-egorova', { draft: true })];
    const kinds = publicPagesOf(data).map((page) => page.kind);
    expect(kinds).not.toContain('talk');
    expect(kinds).not.toContain('speaker');
  });

  it('язык вне списка включённых не публикуется', () => {
    const data = catalog();
    data.speakers = [speaker('de/daria-egorova')];
    expect(pagesOfKind(publicPagesOf(data), 'speaker')).toEqual([]);
  });
});

describe('trimTrailingSlashes', () => {
  it('срезает все слэши в конце', () => {
    expect(trimTrailingSlashes('/en/events/31///')).toBe('/en/events/31');
    expect(trimTrailingSlashes('/')).toBe('');
  });
});
