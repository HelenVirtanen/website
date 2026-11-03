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

/** robots.txt: сайт открыт всем роботам, карта сайта — по абсолютному адресу. */
export const robotsOf = (site: URL): string =>
  `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`;
