import { search, type PagefindModule } from '../search/pagefind';
import { markdownPathOf } from './paths';

// WebMCP: инструменты, которые страница отдаёт агенту браузера (webmachinelearning.github.io/webmcp).
// Только чтение того, что и так публично: поиск по сайту и Markdown-версия страницы.

export interface ToolResult {
  content: { type: 'text'; text: string }[];
  isError?: boolean;
}

export interface WebMcpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<ToolResult>;
}

export interface ModelContext {
  registerTool: (tool: WebMcpTool, options?: { signal?: AbortSignal }) => Promise<unknown> | unknown;
}

export interface ToolEnvironment {
  /** Адрес текущей страницы: от него разрешаются относительные пути */
  location: URL;
  fetch: (url: string) => Promise<{ ok: boolean; status: number; text: () => Promise<string> }>;
  loadPagefind: () => Promise<PagefindModule>;
}

export const SEARCH_LIMIT_MAX = 20;
const text = (value: string, isError = false): ToolResult => ({ content: [{ type: 'text', text: value }], ...(isError && { isError }) });

/** Инструменты сайта. Окружение приходит аргументом: в тесте — фейки, на странице — браузер. */
export function siteTools(env: ToolEnvironment): WebMcpTool[] {
  return [
    {
      name: 'search_site',
      description:
        'Full-text search over MoscowCSS meetups, talks and speakers in the language of the current page. Returns titles, URLs and short descriptions.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search words: a speaker name, a talk topic or a meetup number.' },
          limit: { type: 'integer', minimum: 1, maximum: SEARCH_LIMIT_MAX, description: 'How many results to return (default 10).' },
        },
        required: ['query'],
      },
      async execute(input) {
        const query = typeof input.query === 'string' ? input.query : '';
        const limit = Math.min(Math.max(Number(input.limit) || 10, 1), SEARCH_LIMIT_MAX);
        const outcome = await search(query, env.loadPagefind);
        if (!outcome.indexAvailable) return text('Search index is unavailable.', true);
        if (outcome.hits.length === 0) return text(`Nothing found for "${outcome.query}".`);
        return text(
          outcome.hits
            .slice(0, limit)
            .map((hit) => `- ${hit.title}: ${new URL(hit.url, env.location).href}${hit.description ? ` — ${hit.description}` : ''}`)
            .join('\n'),
        );
      },
    },
    {
      name: 'get_page_markdown',
      description:
        'Get a css.moscow page as Markdown: the meetup with its date, venue and programme, a talk, a speaker or the home page. Pass a path or a URL of this site.',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'A path like /events/31/ or a full https://css.moscow/... URL.' },
        },
        required: ['url'],
      },
      async execute(input) {
        let target: URL;
        try {
          target = new URL(typeof input.url === 'string' ? input.url : '', env.location);
        } catch {
          return text('Not a valid URL.', true);
        }
        // Только свой сайт: инструмент не должен становиться прокси к чужим адресам.
        if (target.origin !== env.location.origin) return text(`Only ${env.location.origin} pages are available.`, true);
        const response = await env.fetch(markdownPathOf(target.pathname));
        if (!response.ok) return text(`No Markdown version of ${target.pathname} (HTTP ${String(response.status)}).`, true);
        return text(await response.text());
      },
    },
  ];
}

/**
 * Регистрирует инструменты, если браузер поддерживает WebMCP: сначала `document.modelContext`,
 * в старых сборках Chrome — `navigator.modelContext`. Без API ничего не делает.
 */
export async function registerSiteTools(
  context: ModelContext | undefined,
  env: ToolEnvironment,
  signal?: AbortSignal,
): Promise<boolean> {
  if (!context || typeof context.registerTool !== 'function') return false;
  for (const tool of siteTools(env)) await context.registerTool(tool, signal ? { signal } : undefined);
  return true;
}
