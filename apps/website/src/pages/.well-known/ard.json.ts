import type { APIRoute } from 'astro';
import { aiCatalog, jsonText } from '../../agents/discovery';

// ai-catalog.json и ard.json — один документ: первое имя проверяют сканеры, второе требует ARD §5.1.
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('каталог ARD: в astro.config не задан site');
  return new Response(jsonText(aiCatalog(site)), { headers: { 'Content-Type': 'application/json' } });
};
