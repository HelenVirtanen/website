import type { APIRoute } from 'astro';
import { skillMarkdown } from '../../../../agents/discovery';

// Текст отдаётся байт в байт тем же, от которого посчитан digest в index.json.
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('SKILL.md: в astro.config не задан site');
  return new Response(skillMarkdown(site), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
