import type { RSSFeedItem } from '@astrojs/rss';
import { newsNewestFirst } from '../content/archive';
import { localeOf, slugOf, talksOfEvent, type EventEntry, type NewsEntry, type TalkEntry } from '../content/catalog';
import { eventWhen, venueLine } from '../content/format';
import { defaultLocale, locales, localizePath, useTranslations, type Locale, type UiKey } from '../i18n';

// Ленты языка, как в блоге: общая (`/rss.xml`: митапы и новости вместе) и узкие по разделам —
// митапы (`/events/rss.xml`) и новости (`/news/rss.xml`). Отдельная лента на каждый язык: читатель
// подписывается на свой язык и не получает дублей.

export const FEED_SCOPES = ['all', 'events', 'news'] as const;
export type FeedScope = (typeof FEED_SCOPES)[number];

/** Адрес ленты от корня сайта, без слэша на конце: `rss.xml/` статик-хостинг искал бы как папку. */
export function feedPathOf(locale: Locale, scope: FeedScope): string {
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return scope === 'all' ? `${prefix}/rss.xml` : `${prefix}/${scope}/rss.xml`;
}

/** Общая лента языка: её объявляет каждая страница. */
export const feedPath = (locale: Locale): string => feedPathOf(locale, 'all');
export const eventsFeedPath = (locale: Locale): string => feedPathOf(locale, 'events');
export const newsFeedPath = (locale: Locale): string => feedPathOf(locale, 'news');

/** Язык ленты по её адресу: `/en/rss.xml` → `en`, `/rss.xml` → язык по умолчанию. */
export const localeOfFeed = (pathname: string): Locale =>
  locales.find((locale) => locale !== defaultLocale && pathname.startsWith(`/${locale}/`)) ?? defaultLocale;

/** Тег `<language>` канала: BCP-47 для читалок. */
export const LANGUAGE_TAG: Record<Locale, string> = { ru: 'ru-RU', en: 'en-US' };

/** Название и описание ленты в читалке. */
export const feedTextOf = (locale: Locale, scope: FeedScope): { title: string; description: string } => {
  const t = useTranslations(locale);
  const key = (part: 'title' | 'description'): UiKey => `rss.${scope}.${part}`;
  return { title: t(key('title')), description: t(key('description')) };
};

/**
 * Узкие ленты, которые объявляет страница: в разделе митапов — лента митапов, в разделе новостей —
 * лента новостей. Общую ленту объявляет каждая страница отдельно.
 */
export function sectionFeedsOf(locale: Locale, pathname: string): { title: string; href: string }[] {
  return (['events', 'news'] as const)
    .filter((scope) => pathname.startsWith(localizePath(locale, scope)))
    .map((scope) => ({ title: feedTextOf(locale, scope).title, href: feedPathOf(locale, scope) }));
}

/**
 * Записи митапов. `pubDate` — начало митапа: даты публикации у контента нет, а для ленты событий
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
        categories: [t('rss.category.events')],
      };
    });
}

/**
 * Записи новостей: опубликованные новости языка, свежие сверху. Описание — подзаголовок, полный
 * текст — в `content`; категории — «Новости» и темы новости, как рубрики в ленте блога.
 */
export function newsFeedItemsOf(locale: Locale, news: readonly NewsEntry[]): RSSFeedItem[] {
  const t = useTranslations(locale);
  return newsNewestFirst(news.filter((entry) => localeOf(entry) === locale)).map((entry) => ({
    title: entry.data.title,
    link: localizePath(locale, `news/${slugOf(entry)}`),
    pubDate: entry.data.date,
    description: entry.data.description,
    ...(entry.rendered?.html && { content: entry.rendered.html }),
    categories: [t('rss.category.news'), ...entry.data.tags],
  }));
}

/** Записи ленты области, свежие сверху; в общей ленте митапы и новости перемешаны по дате. */
export function scopeItemsOf(
  locale: Locale,
  scope: FeedScope,
  catalog: { events: readonly EventEntry[]; talks: readonly TalkEntry[]; news: readonly NewsEntry[] },
): RSSFeedItem[] {
  const events = scope === 'news' ? [] : feedItemsOf(locale, catalog.events, catalog.talks);
  const news = scope === 'events' ? [] : newsFeedItemsOf(locale, catalog.news);
  return [...events, ...news].sort((a, b) => (b.pubDate?.getTime() ?? 0) - (a.pubDate?.getTime() ?? 0));
}

/**
 * `<lastBuildDate>` канала: самая свежая запись, но не позже момента сборки — анонс будущего митапа
 * не делает ленту «собранной в будущем». Записей нет — undefined.
 */
export function lastBuildDateOf(items: readonly RSSFeedItem[], now: Date): Date | undefined {
  const times = items.flatMap((item) => (item.pubDate ? [item.pubDate.getTime()] : []));
  return times.length > 0 ? new Date(Math.min(Math.max(...times), now.getTime())) : undefined;
}
