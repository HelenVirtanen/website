import type { RSSFeedItem } from '@astrojs/rss';
import { newsNewestFirst } from '../content/archive';
import { localeOf, slugOf, talksOfEvent, type EventEntry, type NewsEntry, type TalkEntry } from '../content/catalog';
import { eventWhen, venueLine } from '../content/format';
import { defaultLocale, locales, localizePath, useTranslations, type Locale } from '../i18n';

// Ленты языка: митапы (одна запись — один опубликованный митап) и новости, новые сверху. Отдельная
// лента на каждый язык, как в блоге: читатель подписывается на свой язык и не получает дублей.

/** Адрес ленты от корня сайта, без слэша на конце: `rss.xml/` статик-хостинг искал бы как папку. */
export const feedPath = (locale: Locale): string =>
  locale === defaultLocale ? '/rss.xml' : `/${locale}/rss.xml`;

/** Язык ленты по её адресу: `/en/rss.xml` → `en`, `/rss.xml` → язык по умолчанию. */
export const localeOfFeed = (pathname: string): Locale =>
  locales.find((locale) => locale !== defaultLocale && pathname.startsWith(`/${locale}/`)) ?? defaultLocale;

/** Тег `<language>` канала: BCP-47 для читалок. */
export const LANGUAGE_TAG: Record<Locale, string> = { ru: 'ru-RU', en: 'en-US' };

/**
 * Записи ленты. `pubDate` — начало митапа: даты публикации у контента нет, а для ленты событий
 * читатель сортирует именно по дню встречи. Анонс будущего митапа поэтому датирован будущим.
 */
export function feedItemsOf(
  locale: Locale,
  events: readonly EventEntry[],
  talks: readonly TalkEntry[],
): RSSFeedItem[] {
  const t = useTranslations(locale);
  return events
    .filter((event) => localeOf(event) === locale && !event.data.draft)
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((event) => {
      const { tagline, date, venue } = event.data;
      const when = eventWhen(event.data, locale, { withTime: t('hero.dateTime'), dateOnly: t('date.long') });
      const titles = talksOfEvent(event, talks).map((talk) => talk.data.title);
      const program = titles.length > 0 ? ` ${t('rss.talks')}: ${titles.join('; ')}.` : '';
      return {
        title: tagline,
        link: localizePath(locale, `events/${slugOf(event)}`),
        pubDate: date,
        description: `${when}, ${venueLine(venue)}.${program}`,
      };
    });
}

/** Адрес ленты новостей языка, без слэша на конце: `/news/rss.xml`, `/en/news/rss.xml`. */
export const newsFeedPath = (locale: Locale): string =>
  locale === defaultLocale ? '/news/rss.xml' : `/${locale}/news/rss.xml`;

/** Раздел новостей — страница списка или новость: там в `<head>` есть и лента новостей. */
export const isNewsPath = (locale: Locale, pathname: string): boolean =>
  pathname.startsWith(localizePath(locale, 'news'));

/**
 * Записи ленты новостей: опубликованные новости языка, свежие сверху. Описание — подзаголовок,
 * полный текст — в `content`, темы — `<category>`, как в ленте блога.
 */
export function newsFeedItemsOf(locale: Locale, news: readonly NewsEntry[]): RSSFeedItem[] {
  return newsNewestFirst(news.filter((entry) => localeOf(entry) === locale)).map((entry) => ({
    title: entry.data.title,
    link: localizePath(locale, `news/${slugOf(entry)}`),
    pubDate: entry.data.date,
    description: entry.data.description,
    ...(entry.rendered?.html && { content: entry.rendered.html }),
    ...(entry.data.tags.length > 0 && { categories: entry.data.tags }),
  }));
}

/** Самая свежая новость языка — `<lastBuildDate>` канала; новостей нет — undefined. */
export function newestNewsDate(locale: Locale, news: readonly NewsEntry[]): Date | undefined {
  return newsNewestFirst(news.filter((entry) => localeOf(entry) === locale))[0]?.data.date;
}
