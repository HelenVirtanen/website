// Строки списков архива и их фильтр (спека 007). Модуль без зависимостей: его импортирует
// клиентский скрипт страницы списка и WebMCP, а строит строки `archive.ts` на сборке.

export const ARCHIVE_KINDS = ['events', 'talks', 'speakers'] as const;
export type ArchiveKind = (typeof ARCHIVE_KINDS)[number];

/** Сколько меток митапов показывает карточка спикера. */
export const SPEAKER_EVENT_LABELS = 3;

export interface EventRef {
  slug: string;
  /** Короткая метка: номер митапа или год у митапа с нечисловым именем */
  label: string;
}

export interface ArchiveEvent {
  slug: string;
  label: string;
  title: string;
  /** День начала по Москве, `YYYY-MM-DD` */
  date: string;
  year: number;
  venue: string;
  talks: number;
  /** Спикеры докладов митапа (имена файлов) */
  speakers: string[];
  /** Темы митапа, как падающие плашки Hero */
  tags: string[];
  /** Есть запись: общая или хотя бы одного доклада */
  recording: boolean;
  photos: boolean;
}

export interface ArchiveTalk {
  slug: string;
  title: string;
  year: number;
  event: EventRef & { title: string };
  speakers: { slug: string; name: string }[];
  video: boolean;
  slides: boolean;
}

export interface ArchiveSpeaker {
  slug: string;
  name: string;
  role: string | undefined;
  /** Годы выступлений, новые первыми */
  years: number[];
  /** Митапы с его докладами, новые первыми; карточка показывает первые `SPEAKER_EVENT_LABELS` */
  events: EventRef[];
}

export interface ArchiveReview {
  slug: string;
  name: string;
  role: string | undefined;
  category: string;
  /** Спикер, если автор отзыва выступал (имя файла спикера) */
  speaker: string | undefined;
  /** Первый абзац, как на стикере */
  preview: string;
}

/** Строка программы ближайшего митапа: доклад, перерыв или активность. */
export interface ArchiveProgrammeItem {
  kind: 'talk' | 'break' | 'activity';
  time: string | undefined;
  title: string;
  /** Имя файла доклада */
  talk: string | undefined;
  speakers: string[];
}

export interface ArchiveNext {
  slug: string;
  label: string;
  title: string;
  /** Начало с часовым поясом Москвы, `2026-11-26T19:00:00+03:00`; без времени — только день */
  start: string;
  venue: { name: string; address: string | undefined };
  modes: string[];
  tags: string[];
  registrationUrl: string | undefined;
  streamUrl: string | undefined;
  programme: ArchiveProgrammeItem[];
}

export interface ArchiveContacts {
  lead: string;
  items: { title: string; text: string; links: { label: string; url: string }[] }[];
}

export interface Archive {
  events: ArchiveEvent[];
  talks: ArchiveTalk[];
  speakers: ArchiveSpeaker[];
  reviews: ArchiveReview[];
  /** Ближайший митап на момент сборки; сайт пересобирается каждую ночь */
  next: ArchiveNext | null;
  contacts: ArchiveContacts | null;
}

const unique = <T>(items: readonly T[]): T[] => [...new Set(items)];

export interface ArchiveFilter {
  /** Слова запроса: найдены должны быть все */
  query: string;
  year: number | undefined;
  /** Только с видео (доклады) или записью (митапы) */
  media: boolean;
}

export const EMPTY_FILTER: ArchiveFilter = { query: '', year: undefined, media: false };

/** Для сравнения без регистра и разницы `ё`/`е`, с одинарными пробелами. */
export function normalize(text: string): string {
  return text.toLocaleLowerCase('ru').replaceAll('ё', 'е').replace(/\s+/g, ' ').trim();
}

type Item<K extends ArchiveKind> = Archive[K][number];

const haystackOf = (kind: ArchiveKind, item: Item<ArchiveKind>): string => {
  switch (kind) {
    case 'events': {
      const event = item as ArchiveEvent;
      return [event.label, event.title, event.venue, event.date, ...event.tags].join(' ');
    }
    case 'talks': {
      const talk = item as ArchiveTalk;
      return [talk.title, talk.event.label, talk.event.title, ...talk.speakers.map((s) => s.name)].join(' ');
    }
    case 'speakers': {
      const speaker = item as ArchiveSpeaker;
      return [speaker.name, speaker.role ?? '', ...speaker.events.map((event) => event.label)].join(' ');
    }
  }
};

const yearsOf = (kind: ArchiveKind, item: Item<ArchiveKind>): number[] =>
  kind === 'speakers' ? (item as ArchiveSpeaker).years : [(item as ArchiveEvent | ArchiveTalk).year];

const hasMedia = (kind: ArchiveKind, item: Item<ArchiveKind>): boolean =>
  kind === 'events' ? (item as ArchiveEvent).recording : kind === 'talks' ? (item as ArchiveTalk).video : true;

/** Подходит ли строка под фильтр. Пустой фильтр пропускает всё. */
export function matchesFilter<K extends ArchiveKind>(kind: K, item: Item<K>, filter: ArchiveFilter): boolean {
  if (filter.year !== undefined && !yearsOf(kind, item).includes(filter.year)) return false;
  if (filter.media && !hasMedia(kind, item)) return false;
  const words = normalize(filter.query).split(' ').filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalize(haystackOf(kind, item));
  return words.every((word) => haystack.includes(word));
}

/** Строки, прошедшие фильтр, в исходном порядке. */
export function filterArchive<K extends ArchiveKind>(kind: K, items: readonly Item<K>[], filter: ArchiveFilter): Item<K>[] {
  return items.filter((item) => matchesFilter(kind, item, filter));
}

/** Годы, за которые в списке есть строки, новые первыми: варианты фильтра по году. */
export function yearsInArchive<K extends ArchiveKind>(kind: K, items: readonly Item<K>[]): number[] {
  return unique(items.flatMap((item) => yearsOf(kind, item))).sort((a, b) => b - a);
}

const YEAR = /^\d{4}$/;

/** Фильтр из адреса страницы: `?q=grid&year=2023&media=1`. Мусор в параметрах игнорируется. */
export function filterFromSearch(params: URLSearchParams): ArchiveFilter {
  const year = params.get('year') ?? '';
  return {
    query: (params.get('q') ?? '').slice(0, 200),
    year: YEAR.test(year) ? Number(year) : undefined,
    media: params.get('media') === '1',
  };
}

/** Строка запроса для адреса; пустой фильтр — пустая строка, без `?`. */
export function searchOfFilter(filter: ArchiveFilter): string {
  const params = new URLSearchParams();
  if (filter.query.trim() !== '') params.set('q', filter.query.trim());
  if (filter.year !== undefined) params.set('year', String(filter.year));
  if (filter.media) params.set('media', '1');
  const search = params.toString();
  return search === '' ? '' : `?${search}`;
}

/** Точные связи для WebMCP: спикер, митап, тема, категория отзыва. Пустое поле не фильтрует. */
export interface RelationFilter {
  /** Имя файла спикера или его имя целиком */
  speaker?: string | undefined;
  /** Номер или имя файла митапа */
  event?: string | undefined;
  /** Слово из темы митапа */
  tag?: string | undefined;
  /** Категория отзыва */
  category?: string | undefined;
}

export const RELATION_KINDS = [...ARCHIVE_KINDS, 'reviews'] as const;
export type RelationKind = (typeof RELATION_KINDS)[number];
type RelationItem = ArchiveEvent | ArchiveTalk | ArchiveSpeaker | ArchiveReview;

const same = (a: string, b: string): boolean => normalize(a) === normalize(b);

/** Подходит ли строка под точные связи. Поле, которого у вида строк нет, ничего не находит. */
export function matchesRelation(kind: RelationKind, item: RelationItem, filter: RelationFilter): boolean {
  const { speaker, event, tag, category } = filter;
  switch (kind) {
    case 'events': {
      const row = item as ArchiveEvent;
      if (category) return false;
      if (speaker && !row.speakers.some((slug) => same(slug, speaker))) return false;
      if (event && !same(row.slug, event) && !same(row.label, event)) return false;
      if (tag && !row.tags.some((name) => normalize(name).includes(normalize(tag)))) return false;
      return true;
    }
    case 'talks': {
      const row = item as ArchiveTalk;
      if (tag || category) return false;
      if (speaker && !row.speakers.some((person) => same(person.slug, speaker) || same(person.name, speaker))) return false;
      if (event && !same(row.event.slug, event) && !same(row.event.label, event)) return false;
      return true;
    }
    case 'speakers': {
      const row = item as ArchiveSpeaker;
      if (tag || category) return false;
      if (speaker && !same(row.slug, speaker) && !same(row.name, speaker)) return false;
      if (event && !row.events.some((ref) => same(ref.slug, event) || same(ref.label, event))) return false;
      return true;
    }
    case 'reviews': {
      const row = item as ArchiveReview;
      if (event || tag) return false;
      if (speaker && !(row.speaker !== undefined && same(row.speaker, speaker)) && !same(row.name, speaker)) return false;
      if (category && !same(row.category, category)) return false;
      return true;
    }
  }
}
