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

  it('регистрирует оба инструмента и передаёт signal', async () => {
    const registerTool = vi.fn();
    const signal = new AbortController().signal;
    expect(await registerSiteTools({ registerTool }, env(), signal)).toBe(true);
    expect(registerTool.mock.calls.map(([item]) => (item as WebMcpTool).name)).toEqual(['search_site', 'get_page_markdown']);
    expect(registerTool.mock.calls[0]?.[1]).toEqual({ signal });
  });
});
