import type { APIRoute } from 'astro';
import { llmsTxt } from '../agents/discovery';
import { loadCatalog } from '../content/catalog';
import { buildNow } from '../content/now';
import { publicPagesOf } from '../seo/pages';

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('llms-full.txt: в astro.config не задан site');
  const catalog = await loadCatalog();
  return new Response(llmsTxt(publicPagesOf(catalog), catalog, site, buildNow(), 'full'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
