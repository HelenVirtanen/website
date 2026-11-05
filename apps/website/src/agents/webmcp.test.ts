import { describe, expect, it, vi } from 'vitest';
import { registerSiteTools, siteTools, type ToolEnvironment, type WebMcpTool } from './webmcp';

const pagefind = {
  search: vi.fn(async (query: string) => ({
    results:
      query === 'якорь'
        ? [{ data: async () => ({ url: '/talks/anchor-and-popover/', meta: { title: 'Бросаем якорь', description: 'Anchor Positioning' } }) }]
        : [],
  })),
};

const env = (overrides: Partial<ToolEnvironment> = {}): ToolEnvironment => ({
  location: new URL('https://css.moscow/events/31/'),
  fetch: vi.fn(async (url: string) => ({ ok: url === '/events/31/index.md', status: url === '/events/31/index.md' ? 200 : 404, text: async () => '# 31 митап\n' })),
  loadPagefind: async () => pagefind,
  ...overrides,
});

const tool = (name: string, environment = env()): WebMcpTool => {
  const found = siteTools(environment).find((item) => item.name === name);
  if (!found) throw new Error(name);
  return found;
};

describe('siteTools', () => {
  it('у каждого инструмента имя, описание и JSON Schema с обязательными полями', () => {
    for (const item of siteTools(env())) {
      expect(item.name).toMatch(/^[a-z_]+$/);
      expect(item.description.length).toBeGreaterThan(30);
      expect(item.inputSchema).toMatchObject({ type: 'object', required: expect.any(Array) });
    }
  });

  it('search_site: абсолютные адреса и описания найденного', async () => {
    const result = await tool('search_site').execute({ query: 'якорь' });
    expect(result.content[0]?.text).toBe('- Бросаем якорь: https://css.moscow/talks/anchor-and-popover/ — Anchor Positioning');
  });

  it('search_site: пусто — понятный ответ, индекс упал — ошибка', async () => {
    expect((await tool('search_site').execute({ query: 'ничего' })).content[0]?.text).toContain('Nothing found');
    const broken = env({ loadPagefind: () => Promise.reject(new Error('404')) });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect((await tool('search_site', broken).execute({ query: 'якорь' })).isError).toBe(true);
  });

  it('get_page_markdown: путь и полный адрес своего сайта ведут на index.md страницы', async () => {
    expect((await tool('get_page_markdown').execute({ url: '/events/31/' })).content[0]?.text).toBe('# 31 митап\n');
    expect((await tool('get_page_markdown').execute({ url: 'https://css.moscow/events/31/' })).isError).toBeUndefined();
  });

  it('get_page_markdown: чужой сайт не запрашивается — инструмент не прокси', async () => {
    const environment = env();
    const result = await tool('get_page_markdown', environment).execute({ url: 'https://evil.example/x' });
    expect(result.isError).toBe(true);
    expect(environment.fetch).not.toHaveBeenCalled();
  });

  it('get_page_markdown: страницы нет — ошибка с кодом', async () => {
    expect((await tool('get_page_markdown').execute({ url: '/nope/' })).content[0]?.text).toContain('HTTP 404');
  });
});

describe('registerSiteTools', () => {
  it('без WebMCP ничего не делает', async () => {
    expect(await registerSiteTools(undefined, env())).toBe(false);
  });

  it('регистрирует все инструменты и передаёт signal', async () => {
    const registerTool = vi.fn();
    const signal = new AbortController().signal;
    expect(await registerSiteTools({ registerTool }, env(), signal)).toBe(true);
    expect(registerTool.mock.calls.map(([item]) => (item as WebMcpTool).name)).toEqual(['search_site', 'get_page_markdown', 'list_archive']);
    expect(registerTool.mock.calls[0]?.[1]).toEqual({ signal });
  });
});

describe('list_archive', () => {
  const archive = {
    events: [
      { slug: '31', label: '31', title: '31 митап', date: '2026-07-09', year: 2026, venue: 'Звук', talks: 2, recording: false, photos: true },
      { slug: '10', label: '10', title: '10 митап', date: '2023-03-14', year: 2023, venue: 'Авито', talks: 3, recording: true, photos: false },
    ],
    talks: [
      { slug: 'anchor', title: 'Якоря', year: 2026, event: { slug: '31', label: '31', title: '31 митап' }, speakers: [{ slug: 'elkin', name: 'Пётр Ёлкин' }], video: false, slides: true },
      { slug: 'grid', title: 'Гриды', year: 2023, event: { slug: '10', label: '10', title: '10 митап' }, speakers: [{ slug: 'elkin', name: 'Пётр Ёлкин' }], video: true, slides: false },
    ],
    speakers: [{ slug: 'elkin', name: 'Пётр Ёлкин', role: 'Яндекс', years: [2026, 2023], events: [{ slug: '31', label: '31' }, { slug: '10', label: '10' }] }],
  };
  const archiveEnv = (overrides: Partial<ToolEnvironment> = {}) =>
    env({
      location: new URL('https://css.moscow/en/talks/'),
      archiveUrl: 'https://css.moscow/en/archive.json',
      fetch: vi.fn(async (url: string) => ({ ok: url === '/en/archive.json', status: url === '/en/archive.json' ? 200 : 404, text: async () => JSON.stringify(archive) })),
      ...overrides,
    });

  it('фильтрует той же функцией, что страница: ё, год, видео; адреса — языка данных', async () => {
    const environment = archiveEnv();
    const result = await tool('list_archive', environment).execute({ kind: 'talks', query: 'ёлкин', media: true });
    expect(result.content[0]?.text).toBe(
      '1 talks match; showing 1–1.\n- Гриды: https://css.moscow/en/talks/grid/ — Пётр Ёлкин; meetup 10 (2023) [video]',
    );
    expect(environment.fetch).toHaveBeenCalledWith('/en/archive.json');
  });

  it('митапы и спикеры, лимит и сдвиг', async () => {
    const events = await tool('list_archive', archiveEnv()).execute({ kind: 'events', limit: 1, offset: 1 });
    expect(events.content[0]?.text).toBe(
      '2 events match; showing 2–2.\n- 10 митап: https://css.moscow/en/events/10/ — 2023-03-14, Авито, talks: 3 [recording]',
    );
    const speakers = await tool('list_archive', archiveEnv()).execute({ kind: 'speakers', year: 2023 });
    expect(speakers.content[0]?.text).toContain('- Пётр Ёлкин: https://css.moscow/en/speakers/elkin/ — Яндекс; meetups: 31, 10');
  });

  it('неизвестный вид, нет данных, пустой результат', async () => {
    expect((await tool('list_archive', archiveEnv()).execute({ kind: 'videos' })).isError).toBe(true);
    expect((await tool('list_archive', archiveEnv({ archiveUrl: undefined })).execute({ kind: 'talks' })).isError).toBe(true);
    expect((await tool('list_archive', archiveEnv({ archiveUrl: '/missing.json' })).execute({ kind: 'talks' })).isError).toBe(true);
    expect((await tool('list_archive', archiveEnv()).execute({ kind: 'events', year: 2019 })).content[0]?.text).toBe('No events match (0 found in total).');
  });
});
