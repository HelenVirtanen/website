import type { APIRoute, GetStaticPaths } from 'astro';
import { markdownOf, markdownPathOf } from '../../agents/markdown';
import { loadCatalog } from '../../content/catalog';
import { buildNow } from '../../content/now';
import { publicPagesOf, trimTrailingSlashes } from '../../seo/pages';

export const getStaticPaths = (async () =>
  publicPagesOf(await loadCatalog()).map((page) => ({
    params: { path: trimTrailingSlashes(page.path).replace(/^\//, '') || undefined },
  }))) satisfies GetStaticPaths;

// Страница ищется по адресу, а не по params: эндпоинту с расширением Astro 7 отдаёт не те параметры
// (см. pages/[...locale]/rss.xml.ts).
export const GET: APIRoute = async ({ site, url }) => {
  if (!site) throw new Error('index.md: в astro.config не задан site');
  const catalog = await loadCatalog();
  const pathname = trimTrailingSlashes(url.pathname);
  const page = publicPagesOf(catalog).find((candidate) => markdownPathOf(candidate.path) === pathname);
  if (!page) throw new Error(`index.md: нет публичной страницы для ${url.pathname}`);
  return new Response(markdownOf(page, catalog, { site, now: buildNow() }), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
