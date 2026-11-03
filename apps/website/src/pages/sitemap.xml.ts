import type { APIRoute } from 'astro';
import { publicPages } from '../seo/pages';
import { sitemapOf } from '../seo/sitemap';

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('sitemap.xml: в astro.config не задан site');
  return new Response(sitemapOf(await publicPages(), site), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
