import type { Archive, EventRef } from './archive-filter';
import {
  localeOf,
  slugOf,
  talksOfEvent,
  talksOfSpeaker,
  type Catalog,
  type EventEntry,
  type SpeakerEntry,
  type TalkEntry,
} from './catalog';

// Строки списков митапов, докладов и спикеров (спека 007) из каталога. Одни и те же данные рисует
// страница, пишет Markdown-версия, отдаёт `archive.json` и фильтрует WebMCP, поэтому они не расходятся.

export * from './archive-filter';


const isPublished = (entry: { data: { draft: boolean } }): boolean => !entry.data.draft;

const moscowDay = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Moscow',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const dayOf = (event: EventEntry): string => moscowDay.format(event.data.date);
const yearOf = (event: EventEntry): number => Number(dayOf(event).slice(0, 4));

/** Метка митапа: `22` для `22.md`; у `online-2021` и `19-plus` номера нет — год. */
export function eventLabel(event: EventEntry): string {
  const slug = slugOf(event);
  return /^\d+$/.test(slug) ? slug : String(yearOf(event));
}

/** Опубликованные митапы, новые первыми: будущий стоит выше прошедших. */
export function eventsNewestFirst<E extends EventEntry>(events: readonly E[]): E[] {
  return events.filter(isPublished).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Доклады от последнего митапа к первому, внутри митапа — по программе. */
export function talksNewestFirst<T extends TalkEntry>(
  talks: readonly T[],
  events: readonly EventEntry[],
): { talk: T; event: EventEntry }[] {
  return eventsNewestFirst(events).flatMap((event) =>
    talksOfEvent(event, talks).map((talk) => ({ talk, event })),
  );
}

const collator = (locale: string) => new Intl.Collator(locale, { sensitivity: 'base' });

/**
 * Спикеры по самому свежему выступлению: каждый следующий доклад поднимает спикера, но в списке он
 * один. Спикеры одного митапа — в порядке программы и порядке имён в докладе. Без опубликованных
 * докладов — в конце, по имени. Все записи — одного языка.
 */
export function speakersByLatestTalk<S extends SpeakerEntry>(
  speakers: readonly S[],
  talks: readonly TalkEntry[],
  events: readonly EventEntry[],
): S[] {
  const published = speakers.filter(isPublished);
  const bySlug = new Map(published.map((speaker) => [slugOf(speaker), speaker]));
  const ordered = new Map<string, S>();
  for (const { talk } of talksNewestFirst(talks, events)) {
    for (const name of talk.data.speakers) {
      const speaker = bySlug.get(name);
      if (speaker && !ordered.has(name)) ordered.set(name, speaker);
    }
  }
  const compare = collator(localeOf(published[0] ?? { id: 'ru/' })).compare;
  const rest = published
    .filter((speaker) => !ordered.has(slugOf(speaker)))
    .sort((a, b) => compare(a.data.name, b.data.name));
  return [...ordered.values(), ...rest];
}

const unique = <T>(items: readonly T[]): T[] => [...new Set(items)];

/** Строки трёх списков одного языка. */
export function archiveOf(
  catalog: Pick<Catalog, 'events' | 'talks' | 'speakers'>,
  locale: string,
): Archive {
  const inLocale = <T extends { id: string }>(entries: readonly T[]): T[] =>
    entries.filter((entry) => localeOf(entry) === locale);
  const events = inLocale(catalog.events);
  const talks = inLocale(catalog.talks);
  const speakers = inLocale(catalog.speakers);
  const nameOf = new Map(speakers.filter(isPublished).map((speaker) => [slugOf(speaker), speaker.data.name]));
  const refOf = (event: EventEntry): EventRef => ({ slug: slugOf(event), label: eventLabel(event) });

  return {
    events: eventsNewestFirst(events).map((event) => {
      const own = talksOfEvent(event, talks);
      return {
        ...refOf(event),
        title: event.data.tagline,
        date: dayOf(event),
        year: yearOf(event),
        venue: event.data.venue.name,
        talks: own.length,
        recording: event.data.recordingUrl !== undefined || own.some((talk) => talk.data.videoUrl !== undefined),
        photos: event.data.photosUrl !== undefined,
      };
    }),
    talks: talksNewestFirst(talks, events).map(({ talk, event }) => ({
      slug: slugOf(talk),
      title: talk.data.title,
      year: yearOf(event),
      event: { ...refOf(event), title: event.data.tagline },
      // Спикер-черновик в опубликованном докладе невозможен (validateCatalog), фильтр — для типов.
      speakers: talk.data.speakers.flatMap((slug) => {
        const name = nameOf.get(slug);
        return name === undefined ? [] : [{ slug, name }];
      }),
      video: talk.data.videoUrl !== undefined,
      slides: talk.data.slidesUrl !== undefined,
    })),
    speakers: speakersByLatestTalk(speakers, talks, events).map((speaker) => {
      const appearances = talksOfSpeaker(speaker, talks, events);
      return {
        slug: slugOf(speaker),
        name: speaker.data.name,
        role: speaker.data.role,
        years: unique(appearances.map(({ event }) => yearOf(event))),
        events: [...new Map(appearances.map(({ event }) => [slugOf(event), refOf(event)])).values()],
      };
    }),
  };
}

