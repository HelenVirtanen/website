import {
  localeOf,
  scheduleOf,
  slugOf,
  talksOfSpeaker,
  upcomingEvent,
  pastEvents,
  type Catalog,
  type EventEntry,
} from '../content/catalog';
import { eventLinksOf } from '../content/event-links';
import { eventDateParts, eventWhen, fillTemplate, venueLine } from '../content/format';
import { localizePath, useTranslations } from '../i18n';
import { feedPath } from '../rss/feed';
import type { PublicPage } from '../seo/pages';

import { markdownPathOf } from './paths';

// Markdown-версия страницы для агентов: та же страница без разметки и скриптов. Строится из того же
// каталога и словаря, что и HTML, поэтому не расходится с ним; ссылки абсолютные — файл читают вне сайта.

export { markdownPathOf };

export interface MarkdownContext {
  site: URL;
  now: Date;
}

type MarkdownCatalog = Pick<Catalog, 'events' | 'talks' | 'speakers'>;

// Квадратные скобки в тексте ссылки закрыли бы её раньше времени.
const linkText = (text: string): string => text.replace(/[[\]]/g, '\\$&');
const link = (text: string, url: string): string => `[${linkText(text)}](${url})`;
const section = (title: string, lines: readonly string[]): string[] =>
  lines.length > 0 ? [`## ${title}`, '', ...lines, ''] : [];

function document(lines: readonly (string | undefined)[]): string {
  const text = lines.filter((line): line is string => line !== undefined).join('\n');
  return `${text.replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

/** Markdown публичной страницы сайта. */
export function markdownOf(page: PublicPage, catalog: MarkdownCatalog, context: MarkdownContext): string {
  const { locale } = page;
  const t = useTranslations(locale);
  const abs = (path: string): string => new URL(path, context.site).href;
  const inLocale = <T extends { id: string }>(entries: readonly T[]): T[] =>
    entries.filter((entry) => localeOf(entry) === locale);
  const when = (event: EventEntry): string =>
    eventWhen(event.data, locale, { withTime: t('hero.dateTime'), dateOnly: t('date.long') });
  const day = (event: EventEntry): string => fillTemplate(t('date.long'), eventDateParts(event.data.date, locale));
  const eventUrl = (event: EventEntry): string => abs(localizePath(locale, `events/${slugOf(event)}`));
  const speakerName = (slug: string): string | undefined =>
    inLocale(catalog.speakers).find((speaker) => slugOf(speaker) === slug)?.data.name;
  const speakerLinks = (slugs: readonly string[]): string =>
    slugs
      .flatMap((slug) => {
        const name = speakerName(slug);
        return name ? [link(name, abs(localizePath(locale, `speakers/${slug}`)))] : [];
      })
      .join(', ');

  switch (page.kind) {
    case 'home': {
      const events = inLocale(catalog.events);
      const featured = upcomingEvent(events, context.now);
      return document([
        `# ${page.entry.data.title}`,
        '',
        page.entry.body?.trim(),
        '',
        ...(featured
          ? section(t(featured.past ? 'agents.lastMeetup' : 'agents.nextMeetup'), [
              `${link(featured.event.data.tagline, eventUrl(featured.event))}: ${when(featured.event)}, ${venueLine(featured.event.data.venue)}.`,
            ])
          : []),
        ...section(
          t('events.past'),
          pastEvents(events, context.now).map((event) => `- ${link(event.data.tagline, eventUrl(event))}, ${day(event)}`),
        ),
        ...section(t('agents.more'), [
          `- ${link(t('nav.search'), abs(localizePath(locale, 'search')))}`,
          `- ${link('RSS', abs(feedPath(locale)))}`,
          `- ${link('llms.txt', abs('/llms.txt'))}`,
        ]),
      ]);
    }

    case 'event': {
      const event = page.entry;
      const schedule = scheduleOf(event, inLocale(catalog.talks)).map((item) => {
        const time = item.time ? `${item.time} — ` : '';
        if (item.kind !== 'talk') return `- ${time}${item.title}`;
        const people = speakerLinks(item.talk.data.speakers);
        const title = link(item.title, abs(localizePath(locale, `talks/${slugOf(item.talk)}`)));
        return `- ${time}${title}${people ? `, ${people}` : ''}`;
      });
      const links = eventLinksOf(event, context.now, {
        registration: t('event.registration'),
        stream: t('event.stream'),
        recording: t('event.recording'),
        photos: t('event.photos'),
        map: t('event.map'),
      }).map((item) => `- ${link(item.label, item.href)}`);
      return document([
        `# ${event.data.tagline}`,
        '',
        `${when(event)}, ${venueLine(event.data.venue)}.`,
        '',
        event.body?.trim(),
        '',
        ...section(t('event.schedule'), schedule),
        ...section(t('event.links'), links),
      ]);
    }

    case 'talk': {
      const talk = page.entry;
      const event = inLocale(catalog.events).find((item) => slugOf(item) === talk.data.event);
      const materials = [
        talk.data.slidesUrl && `- ${link(t('talk.slides'), talk.data.slidesUrl)}`,
        talk.data.videoUrl && `- ${link(t('talk.video'), talk.data.videoUrl)}`,
      ].filter((line): line is string => Boolean(line));
      return document([
        `# ${talk.data.title}`,
        '',
        `${t('talk.speakers')}: ${speakerLinks(talk.data.speakers)}.`,
        event ? `${t('talk.event')}: ${link(event.data.tagline, eventUrl(event))}, ${day(event)}.` : undefined,
        '',
        talk.body?.trim(),
        '',
        ...section(t('talk.materials'), materials),
      ]);
    }

    case 'speaker': {
      const speaker = page.entry;
      const talks = talksOfSpeaker(speaker, inLocale(catalog.talks), inLocale(catalog.events)).map(
        ({ talk, event }) =>
          `- ${link(talk.data.title, abs(localizePath(locale, `talks/${slugOf(talk)}`)))}, ${link(event.data.tagline, eventUrl(event))}, ${day(event)}`,
      );
      return document([
        `# ${speaker.data.name}`,
        '',
        speaker.data.role,
        '',
        ...section(t('speaker.talks'), talks),
        ...section(
          t('speaker.links'),
          (speaker.data.links ?? []).map((item) => `- ${link(item.label, item.url)}`),
        ),
      ]);
    }

    case 'document':
      return document([`# ${page.entry.data.title}`, '', page.entry.body?.trim()]);
  }
}
