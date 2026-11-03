import { defaultLocale } from '../i18n';
import type { PublicPage } from './pages';
import { xml } from './xml';

/**
 * sitemap.xml по списку публичных страниц: ровно те адреса, у которых есть маршрут, с теми же
 * hreflang, что в `<head>`. `lastmod` не пишем: у контента нет даты правки, а дата сборки на
 * каждой странице — неправда, после которой поисковики перестают верить полю.
 */
export function sitemapOf(pages: readonly Pick<PublicPage, 'path' | 'alternates'>[], site: URL): string {
  const abs = (path: string) => xml(new URL(path, site).href);
  const urls = pages
    .toSorted((a, b) => a.path.localeCompare(b.path))
    .map((page) => {
      const lines = [`    <loc>${abs(page.path)}</loc>`];
      for (const alternate of page.alternates) {
        lines.push(`    <xhtml:link rel="alternate" hreflang="${alternate.locale}" href="${abs(alternate.path)}"/>`);
      }
      const xDefault = page.alternates.find((alternate) => alternate.locale === defaultLocale);
      if (xDefault) {
        lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(xDefault.path)}"/>`);
      }
      return `  <url>\n${lines.join('\n')}\n  </url>`;
    });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
}

// Группы роботов как в блоге: обучение моделей закрыто, поиск и ответы со ссылкой на источник открыты.
// Content-Signal повторён в каждой группе: по RFC 9309 бот с именованной группой группу «*» не читает.
const CONTENT_SIGNAL = 'Content-Signal: search=yes, ai-input=yes, ai-train=no';
const TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Meta-ExternalAgent',
  'Bytespider',
  'Amazonbot',
];
const SEARCH_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Googlebot',
  'Applebot',
  'Bingbot',
  'YandexBot',
  'YandexAdditional',
  'YandexAdditionalBot',
];

const group = (agents: readonly string[], rule: string): string =>
  [...agents.map((agent) => `User-agent: ${agent}`), rule, CONTENT_SIGNAL].join('\n');

/** robots.txt: группы роботов с Content-Signal, карта сайта и каталог ресурсов для агентов (Agentmap, ARD §6.1). */
export const robotsOf = (site: URL, agentmapPath: string): string =>
  [
    '# Обучение моделей — нет; поиск и ответы со ссылкой на источник — да.',
    group(TRAINING_BOTS, 'Disallow: /'),
    group(SEARCH_BOTS, 'Allow: /'),
    group(['*'], 'Allow: /'),
    `Sitemap: ${new URL('/sitemap.xml', site).href}`,
    `Agentmap: ${new URL(agentmapPath, site).href}`,
  ].join('\n\n') + '\n';
