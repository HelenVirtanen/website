import { MOSCOW_UTC_OFFSET_HOURS } from '@moscowcss/content/schema';
import { localeOf, slugOf, talksOfEvent, type Catalog } from '../content/catalog';
import type { PublicPage } from './pages';

// Разметка schema.org для поисковиков и агентов: кто проводит митапы, когда и где ближайший,
// кто выступает. Строится из того же каталога, что и страница, поэтому не расходится с текстом.

type Thing = Record<string, unknown>;

export interface JsonLdContext {
  /** Корень сайта: `https://css.moscow` */
  site: URL;
  /** Название сообщества из словаря интерфейса */
  siteName: string;
  /** Канал сообщества из контента главной */
  telegramUrl: string;
  /** Описание сообщества из словаря интерфейса */
  siteDescription: string;
  /** Абсолютный адрес OpenGraph-карточки страницы */
  image: string | undefined;
}

const HOUR_MS = 60 * 60 * 1000;
const offset = `+${String(MOSCOW_UTC_OFFSET_HOURS).padStart(2, '0')}:00`;

/** Момент в ISO 8601 по Москве (`2026-07-09T18:00:00+03:00`): в UTC дата у поисковиков съезжает на сутки. */
export function moscowIso(date: Date): string {
  const local = new Date(date.getTime() + MOSCOW_UTC_OFFSET_HOURS * HOUR_MS);
  return `${local.toISOString().slice(0, 19)}${offset}`;
}

const organizationId = (site: URL): string => new URL('/#organization', site).href;

// Канал с записями докладов: те же ссылки стоят на страницах докладов.
const YOUTUBE_CHANNEL = 'https://www.youtube.com/@Moscowcss';
// Иконка манифеста: квадратная, достаточно крупная для карточки организации в выдаче.
const LOGO_PATH = '/web-app-manifest-512x512.png';

function organization(context: JsonLdContext): Thing {
  return {
    '@type': 'Organization',
    '@id': organizationId(context.site),
    name: context.siteName,
    description: context.siteDescription,
    url: new URL('/', context.site).href,
    logo: new URL(LOGO_PATH, context.site).href,
    sameAs: [context.telegramUrl, YOUTUBE_CHANNEL],
    // Адреса и телефона у сообщества нет; связь — только публичный канал (решение владельца, spec 003).
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'community',
      url: context.telegramUrl,
      availableLanguage: ['ru', 'en'],
    },
  };
}

/** Граф JSON-LD страницы или `undefined`, если для её вида разметки нет (доклад). */
export function jsonLdOf(
  page: PublicPage,
  catalog: Pick<Catalog, 'talks' | 'speakers'>,
  context: JsonLdContext,
): Thing | undefined {
  const url = new URL(page.path, context.site).href;
  const base = { url, inLanguage: page.locale };

  switch (page.kind) {
    case 'home':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          organization(context),
          {
            '@type': 'WebSite',
            ...base,
            name: context.siteName,
            description: page.entry.data.description,
            publisher: { '@id': organizationId(context.site) },
          },
        ],
      };

    case 'event': {
      const { tagline, date, time, venue, streamUrl } = page.entry.data;
      const speakerSlugs = new Set(
        talksOfEvent(page.entry, catalog.talks).flatMap((talk) => talk.data.speakers),
      );
      const performers = catalog.speakers.filter(
        (speaker) =>
          localeOf(speaker) === page.locale && !speaker.data.draft && speakerSlugs.has(slugOf(speaker)),
      );
      const place = {
        '@type': 'Place',
        name: venue.name,
        ...(venue.address && { address: venue.address }),
        ...(venue.coordinates && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: venue.coordinates.latitude,
            longitude: venue.coordinates.longitude,
          },
        }),
      };
      return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        ...base,
        name: tagline,
        // Без времени — только день: полночь в startDate была бы выдуманным временем начала.
        startDate: time === undefined ? moscowIso(date).slice(0, 10) : moscowIso(date),
        eventStatus: 'https://schema.org/EventScheduled',
        // Онлайн-участие подтверждает только ссылка на трансляцию: `modes` — свободный текст для людей.
        eventAttendanceMode: streamUrl
          ? 'https://schema.org/MixedEventAttendanceMode'
          : 'https://schema.org/OfflineEventAttendanceMode',
        location: streamUrl ? [place, { '@type': 'VirtualLocation', url: streamUrl }] : place,
        organizer: organization(context),
        ...(performers.length > 0 && {
          performer: performers.map((speaker) => ({ '@type': 'Person', name: speaker.data.name })),
        }),
        ...(context.image && { image: context.image }),
      };
    }

    case 'speaker': {
      const { name, role, links = [] } = page.entry.data;
      return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        ...base,
        name,
        ...(role && { description: role }),
        ...(links.length > 0 && { sameAs: links.map((link) => link.url) }),
      };
    }

    case 'talk':
    case 'document':
      return undefined;
  }
}

/** Текст для `<script type="application/ld+json">`: `<` экранирован, строка из контента не закроет тег. */
export const serializeJsonLd = (graph: Thing): string =>
  JSON.stringify(graph).replaceAll('<', '\\u003c');
