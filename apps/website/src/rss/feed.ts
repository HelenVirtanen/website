import type { RSSFeedItem } from '@astrojs/rss';
import { localeOf, slugOf, talksOfEvent, type EventEntry, type TalkEntry } from '../content/catalog';
import { eventWhen, venueLine } from '../content/format';
import { defaultLocale, locales, localizePath, useTranslations, type Locale } from '../i18n';

// Лента митапов языка: одна запись — один опубликованный митап, новые сверху. Отдельная лента на
// каждый язык, как в блоге: читатель подписывается на свой язык и не получает дублей.

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
