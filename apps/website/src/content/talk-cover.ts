import { dirname, resolve } from 'node:path';
import { eventLabel } from './archive';
import { localeOf, slugOf, type Catalog, type TalkEntry } from './catalog';

// Обложка доклада — карточка анонса из Telegram (спека 007, продолжение). На странице доклада
// она стоит под заголовком; широкая обложка заменяет и сгенерированную OG-карточку. У доклада без
// карточки обложку в том же стиле рисует `@moscowcss/og` на сборке: `/covers/<язык>/<доклад>.png`.

/** Адрес сгенерированной обложки доклада без своей карточки анонса. */
export const talkCoverPath = (talk: { id: string }): string => `/covers/${localeOf(talk)}/${slugOf(talk)}.png`;

/** Не уже этого обложка годится в OG 1200×630: обрезка по центру съест не больше нескольких процентов. */
export const MIN_OG_ASPECT = 1.6;

export const isWide = (size: { width: number; height: number }): boolean => size.width / size.height >= MIN_OG_ASPECT;

/**
 * Путь файла из поля frontmatter (`cover`, `photo`) на диске. После схемы поле — метаданные картинки без
 * пути к исходнику, поэтому путь берётся из текста файла и разрешается от него, как это делает Astro.
 */
export function frontmatterFileOf(
  entry: { filePath?: string | undefined },
  field: string,
  readSource: (path: string) => string,
): string | undefined {
  if (!entry.filePath) return undefined;
  const line = new RegExp(`^${field}:\\s*["']?([^"'\\n]+?)["']?\\s*$`, 'm');
  const written = line.exec(readSource(entry.filePath))?.[1];
  return written === undefined ? undefined : resolve(dirname(resolve(entry.filePath)), written);
}

/** Файл обложки доклада на диске. */
export const coverFileOf = (talk: Pick<TalkEntry, 'filePath'>, readSource: (path: string) => string): string | undefined =>
  frontmatterFileOf(talk, 'cover', readSource);

export interface TalkCoverSource {
  label: string;
  title: string;
  speakers: string;
  /** Файл фото первого спикера, у которого оно есть */
  photoFile: string | undefined;
}

/** Что рисовать на обложке доклада: метка митапа, название, спикеры языка доклада и фото. */
export function talkCoverSourceOf(
  talk: TalkEntry,
  catalog: Pick<Catalog, 'events' | 'speakers'>,
  readSource: (path: string) => string,
): TalkCoverSource {
  const locale = localeOf(talk);
  const event = catalog.events.find((item) => localeOf(item) === locale && slugOf(item) === talk.data.event);
  const people = talk.data.speakers.flatMap((slug) => {
    const speaker = catalog.speakers.find((item) => localeOf(item) === locale && slugOf(item) === slug);
    return speaker ? [speaker] : [];
  });
  const withPhoto = people.find((speaker) => speaker.data.photo !== undefined);
  return {
    label: `MOSCOWCSS_${(event ? eventLabel(event) : talk.data.event).toUpperCase()}`,
    title: talk.data.title,
    speakers: people.map((speaker) => speaker.data.name).join(', '),
    photoFile: withPhoto ? frontmatterFileOf(withPhoto, 'photo', readSource) : undefined,
  };
}
