import type { APIRoute } from 'astro';
import { robotsOf } from '../seo/sitemap';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('robots.txt: в astro.config не задан site');
  return new Response(robotsOf(site), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
