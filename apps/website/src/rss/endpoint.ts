import rss from '@astrojs/rss';
import type { APIContext, GetStaticPaths } from 'astro';
import { loadCatalog } from '../content/catalog';
import { buildNow } from '../content/now';
import { locales, localizePath } from '../i18n';
import { localeParam } from '../seo/pages';
import { LANGUAGE_TAG, feedPathOf, feedTextOf, lastBuildDateOf, localeOfFeed, scopeItemsOf, type FeedScope } from './feed';

// Общий обработчик лент: маршруты `rss.xml`, `events/rss.xml` и `news/rss.xml` отличаются только областью.

export const feedStaticPaths = (() =>
  locales.map((locale) => ({ params: { locale: localeParam(locale) } }))) satisfies GetStaticPaths;

export async function feedResponse(scope: FeedScope, { site, url }: Pick<APIContext, 'site' | 'url'>): Promise<Response> {
  if (!site) throw new Error(`${scope} rss.xml: в astro.config не задан site`);
  // Язык — по адресу, а не из props: эндпоинту под `[...locale]` Astro 7 отдаёт props и params первой
  // страницы для обоих путей, и английская лента собиралась русской.
  const locale = localeOfFeed(url.pathname);
  const { title, description } = feedTextOf(locale, scope);
  const items = scopeItemsOf(locale, scope, await loadCatalog());
  const built = lastBuildDateOf(items, buildNow());
  return rss({
    title,
    description,
    // Ссылка канала — главная языка или страница раздела; записи с абсолютными путями от неё не зависят.
    site: new URL(localizePath(locale, scope === 'all' ? '' : scope), site).href,
    items,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<language>${LANGUAGE_TAG[locale]}</language>`,
      built ? `<lastBuildDate>${built.toUTCString()}</lastBuildDate>` : '',
      `<atom:link href="${new URL(feedPathOf(locale, scope), site).href}" rel="self" type="application/rss+xml"/>`,
    ].join(''),
    // Ссылки записей со слэшем, как у страниц: без него хостинг отвечает редиректом.
    trailingSlash: true,
  });
}
