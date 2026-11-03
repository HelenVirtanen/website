import type { APIRoute } from 'astro';
import { jsonText, skillsIndex } from '../../../agents/discovery';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('agent-skills/index.json: в astro.config не задан site');
  return new Response(jsonText(skillsIndex(site)), { headers: { 'Content-Type': 'application/json' } });
};
