import {
  ARCHIVE_KINDS,
  filterArchive,
  type Archive,
  type ArchiveEvent,
  type ArchiveKind,
  type ArchiveSpeaker,
  type ArchiveTalk,
} from '../content/archive-filter';
import { search, type PagefindModule } from '../search/pagefind';
import { markdownPathOf } from './paths';

// WebMCP: инструменты, которые страница отдаёт агенту браузера (webmachinelearning.github.io/webmcp).
// Только чтение того, что и так публично: поиск по сайту, Markdown-версия страницы и списки архива.

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
  /** Адрес `archive.json` языка страницы (из `<link rel="alternate" type="application/json">`) */
  archiveUrl?: string | undefined;
}

export const SEARCH_LIMIT_MAX = 20;
export const ARCHIVE_LIMIT_MAX = 100;
const ARCHIVE_LIMIT_DEFAULT = 30;
const text = (value: string, isError = false): ToolResult => ({ content: [{ type: 'text', text: value }], ...(isError && { isError }) });

const flags = (items: readonly (string | false)[]): string => {
  const shown = items.filter((item): item is string => Boolean(item));
  return shown.length > 0 ? ` [${shown.join(', ')}]` : '';
};

// Строка ответа: адрес страницы абсолютный, у её языка — тот же префикс, что у `archive.json`.
function archiveLine(kind: ArchiveKind, item: Archive[ArchiveKind][number], base: URL): string {
  const url = (path: string): string => new URL(`${path}/`, base).href;
  switch (kind) {
    case 'events': {
      const event = item as ArchiveEvent;
      return `- ${event.title}: ${url(`events/${event.slug}`)} — ${event.date}, ${event.venue}, talks: ${String(event.talks)}${flags([event.recording && 'recording', event.photos && 'photos'])}`;
    }
    case 'talks': {
      const talk = item as ArchiveTalk;
      return `- ${talk.title}: ${url(`talks/${talk.slug}`)} — ${talk.speakers.map((speaker) => speaker.name).join(', ')}; meetup ${talk.event.label} (${String(talk.year)})${flags([talk.video && 'video', talk.slides && 'slides'])}`;
    }
    case 'speakers': {
      const speaker = item as ArchiveSpeaker;
      return `- ${speaker.name}: ${url(`speakers/${speaker.slug}`)}${speaker.role ? ` — ${speaker.role}` : ''}; meetups: ${speaker.events.map((event) => event.label).join(', ') || 'none'}`;
    }
  }
}

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
    {
      name: 'list_archive',
      description:
        'List MoscowCSS meetups, talks or speakers, newest first, in the language of the current page, filtered like the /events/, /talks/ and /speakers/ pages: by words, year and whether a recording exists.',
      inputSchema: {
        type: 'object',
        properties: {
          kind: { type: 'string', enum: [...ARCHIVE_KINDS], description: 'What to list: events (meetups), talks or speakers.' },
          query: { type: 'string', description: 'Words that must all match: a title, a speaker name, a venue or a meetup number.' },
          year: { type: 'integer', minimum: 2017, description: 'Only this year (for speakers: spoke that year).' },
          media: { type: 'boolean', description: 'Only talks with a video or meetups with a recording.' },
          limit: { type: 'integer', minimum: 1, maximum: ARCHIVE_LIMIT_MAX, description: `How many rows to return (default ${String(ARCHIVE_LIMIT_DEFAULT)}).` },
          offset: { type: 'integer', minimum: 0, description: 'How many matching rows to skip, for the next page.' },
        },
        required: ['kind'],
      },
      async execute(input) {
        const kind = ARCHIVE_KINDS.find((item) => item === input.kind);
        if (!kind) return text(`kind must be one of: ${ARCHIVE_KINDS.join(', ')}.`, true);
        if (!env.archiveUrl) return text('Archive data is unavailable on this page.', true);
        const source = new URL(env.archiveUrl, env.location);
        const response = await env.fetch(source.pathname);
        if (!response.ok) return text(`Archive data is unavailable (HTTP ${String(response.status)}).`, true);
        const archive = JSON.parse(await response.text()) as Archive;
        const year = Number(input.year);
        const matched = filterArchive(kind, archive[kind], {
          query: typeof input.query === 'string' ? input.query : '',
          year: Number.isInteger(year) && year > 0 ? year : undefined,
          media: input.media === true,
        });
        const limit = Math.min(Math.max(Number(input.limit) || ARCHIVE_LIMIT_DEFAULT, 1), ARCHIVE_LIMIT_MAX);
        const offset = Math.max(Number(input.offset) || 0, 0);
        const page = matched.slice(offset, offset + limit);
        if (page.length === 0) return text(`No ${kind} match (${String(matched.length)} found in total).`);
        // Префикс языка — из адреса данных: `/en/archive.json` → страницы под `/en/`.
        const base = new URL('./', source);
        return text(
          [
            `${String(matched.length)} ${kind} match; showing ${String(offset + 1)}–${String(offset + page.length)}.`,
            ...page.map((item) => archiveLine(kind, item, base)),
          ].join('\n'),
        );
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
