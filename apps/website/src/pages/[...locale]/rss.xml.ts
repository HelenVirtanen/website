import rss from '@astrojs/rss';
import type { APIRoute, GetStaticPaths } from 'astro';
import { loadCatalog } from '../../content/catalog';
import { locales, localizePath, useTranslations } from '../../i18n';
import { LANGUAGE_TAG, feedItemsOf, feedPath, localeOfFeed } from '../../rss/feed';
import { localeParam } from '../../seo/pages';

export const getStaticPaths = (() =>
  locales.map((locale) => ({ params: { locale: localeParam(locale) } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ site, url }) => {
  if (!site) throw new Error('rss.xml: в astro.config не задан site');
  // Язык — по адресу, а не из props: эндпоинту `[...locale]/rss.xml` Astro 7 отдаёт props и params
  // первой страницы для обоих путей, и английская лента собиралась русской.
  const locale = localeOfFeed(url.pathname);
  const t = useTranslations(locale);
  const { events, talks } = await loadCatalog();
  return rss({
    title: t('rss.title'),
    description: t('rss.description'),
    // Ссылка канала — главная языка ленты; записи с абсолютными путями от неё не зависят.
    site: new URL(localizePath(locale), site).href,
    items: feedItemsOf(locale, events, talks),
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<language>${LANGUAGE_TAG[locale]}</language>`,
      `<atom:link href="${new URL(feedPath(locale), site).href}" rel="self" type="application/rss+xml"/>`,
    ].join(''),
    // Ссылки записей со слэшем, как у страниц: без него хостинг отвечает редиректом.
    trailingSlash: true,
  });
};
