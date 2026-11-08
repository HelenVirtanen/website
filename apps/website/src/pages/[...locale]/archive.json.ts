import type { APIRoute, GetStaticPaths } from 'astro';
import { archiveOf } from '../../content/archive';
import { loadCatalog } from '../../content/catalog';
import { buildNow } from '../../content/now';
import { locales } from '../../i18n';
import { localeOfArchiveData } from '../../agents/archive-data';
import { jsonText } from '../../agents/discovery';
import { localeParam } from '../../seo/pages';

// Данные WebMCP-инструментов: строки списков архива (спека 007), отзывы, контакты и ближайший митап
// на момент сборки; ночная пересборка держит его свежим.
export const getStaticPaths = (() =>
  locales.map((locale) => ({ params: { locale: localeParam(locale) } }))) satisfies GetStaticPaths;

// Язык — по адресу, а не из props: Astro 7 отдаёт эндпоинту с расширением props первого пути.
export const GET: APIRoute = async ({ url }) =>
  new Response(jsonText(archiveOf(await loadCatalog(), localeOfArchiveData(url.pathname), { now: buildNow() })), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
