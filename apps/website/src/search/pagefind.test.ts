import { describe, expect, it, vi } from 'vitest';
import { RESULTS_LIMIT, search, searchPages, type PagefindFragment, type PagefindModule } from './pagefind';

const fragment = (n: number, meta: PagefindFragment['meta'] = { title: `Доклад ${String(n)}`, description: `Описание ${String(n)}` }) => ({
  url: `/talks/talk-${String(n)}/`,
  meta,
});

const fakeModule = (fragments: PagefindFragment[]) => ({
  search: vi.fn(() =>
    Promise.resolve({ results: fragments.map((f) => ({ data: () => Promise.resolve(f) })) }),
  ),
});

describe('searchPages', () => {
  it('отдаёт url, title и description страницы', async () => {
    const hits = await searchPages(fakeModule([fragment(1)]), 'слово');
    expect(hits).toEqual([{ url: '/talks/talk-1/', title: 'Доклад 1', description: 'Описание 1' }]);
  });

  it('берёт не больше лимита и читает data() только у них', async () => {
    const data = vi.fn();
    const many: PagefindModule = {
      search: () =>
        Promise.resolve({
          results: Array.from({ length: RESULTS_LIMIT + 10 }, (_, i) => ({
            data: () => {
              data();
              return Promise.resolve(fragment(i));
            },
          })),
        }),
    };
    expect(await searchPages(many, 'слово')).toHaveLength(RESULTS_LIMIT);
    expect(data).toHaveBeenCalledTimes(RESULTS_LIMIT);
  });

  it('подставляет адрес вместо заголовка и пустое описание, если меты нет', async () => {
    const [hit] = await searchPages(fakeModule([fragment(2, {})]), 'слово');
    expect(hit).toEqual({ url: '/talks/talk-2/', title: '/talks/talk-2/', description: '' });
  });
});

describe('search', () => {
  it('передаёт в Pagefind запрос без крайних пробелов', async () => {
    const pagefind = fakeModule([fragment(1)]);
    const outcome = await search('  слово  ', () => Promise.resolve(pagefind));
    expect(pagefind.search).toHaveBeenCalledWith('слово');
    expect(outcome).toMatchObject({ query: 'слово', indexAvailable: true });
    expect(outcome.hits).toHaveLength(1);
  });

  it('пустой запрос не загружает индекс', async () => {
    const load = vi.fn();
    const outcome = await search('   ', load);
    expect(load).not.toHaveBeenCalled();
    expect(outcome).toEqual({ query: '', hits: [], indexAvailable: true });
  });

  it('без индекса выдача пуста, а indexAvailable — false', async () => {
    const outcome = await search('слово', () => Promise.reject(new Error('404')));
    expect(outcome).toEqual({ query: 'слово', hits: [], indexAvailable: false });
  });

  it('сбой самого поиска не роняет выдачу', async () => {
    const broken: PagefindModule = { search: () => Promise.reject(new Error('wasm')) };
    const outcome = await search('слово', () => Promise.resolve(broken));
    expect(outcome.indexAvailable).toBe(false);
  });
});
