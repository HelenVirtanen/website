import type { APIRoute, GetStaticPaths } from 'astro';
import { archiveOf } from '../../content/archive';
import { loadCatalog } from '../../content/catalog';
import { locales } from '../../i18n';
import { localeOfArchiveData } from '../../agents/archive-data';
import { jsonText } from '../../agents/discovery';
import { localeParam } from '../../seo/pages';

// Строки трёх списков архива для WebMCP-инструмента `list_archive` (спека 007): то же, что на
// страницах `/events/`, `/talks/`, `/speakers/`.
export const getStaticPaths = (() =>
  locales.map((locale) => ({ params: { locale: localeParam(locale) } }))) satisfies GetStaticPaths;

// Язык — по адресу, а не из props: Astro 7 отдаёт эндпоинту с расширением props первого пути.
export const GET: APIRoute = async ({ url }) =>
  new Response(jsonText(archiveOf(await loadCatalog(), localeOfArchiveData(url.pathname))), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
