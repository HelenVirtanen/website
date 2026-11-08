import rss from '@astrojs/rss';
import type { APIRoute, GetStaticPaths } from 'astro';
import { loadCatalog } from '../../../content/catalog';
import { locales, localizePath, useTranslations } from '../../../i18n';
import { LANGUAGE_TAG, localeOfFeed, newestNewsDate, newsFeedItemsOf, newsFeedPath } from '../../../rss/feed';
import { localeParam } from '../../../seo/pages';

export const getStaticPaths = (() =>
  locales.map((locale) => ({ params: { locale: localeParam(locale) } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ site, url }) => {
  if (!site) throw new Error('news/rss.xml: в astro.config не задан site');
  // Язык — по адресу, как у ленты митапов: props эндпоинта под `[...locale]` Astro отдаёт от первого пути.
  const locale = localeOfFeed(url.pathname);
  const t = useTranslations(locale);
  const { news } = await loadCatalog();
  const built = newestNewsDate(locale, news);
  return rss({
    title: t('rss.news.title'),
    description: t('rss.news.description'),
    site: new URL(localizePath(locale, 'news'), site).href,
    items: newsFeedItemsOf(locale, news),
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<language>${LANGUAGE_TAG[locale]}</language>`,
      built ? `<lastBuildDate>${built.toUTCString()}</lastBuildDate>` : '',
      `<atom:link href="${new URL(newsFeedPath(locale), site).href}" rel="self" type="application/rss+xml"/>`,
    ].join(''),
    trailingSlash: true,
  });
};
