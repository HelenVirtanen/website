import { localeOf, type Catalog } from './catalog';

type AboutCatalog = Pick<Catalog, 'events' | 'talks' | 'speakers'>;
type Gallery = Catalog['events'][number]['data']['gallery'];

/** Сколько опубликованных митапов, докладов и спикеров в языке страницы. */
export function aboutStatsOf(catalog: AboutCatalog, locale: string): { meetups: number; talks: number; speakers: number } {
  const count = (entries: readonly { id: string; data: { draft: boolean } }[]): number =>
    entries.filter((entry) => localeOf(entry) === locale && !entry.data.draft).length;
  return { meetups: count(catalog.events), talks: count(catalog.talks), speakers: count(catalog.speakers) };
}

/** Снимки для ленты: по кругу от новых митапов к старым, сначала первый кадр каждого, затем второй, до `limit`. */
export function aboutPhotosOf(events: AboutCatalog['events'], locale: string, limit: number): Gallery {
  const galleries = events
    .filter((event) => localeOf(event) === locale && !event.data.draft && event.data.gallery.length > 0)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((event) => event.data.gallery);
  const photos: Gallery = [];
  for (let round = 0; photos.length < limit && galleries.some((gallery) => gallery.length > round); round += 1) {
    for (const gallery of galleries) {
      const photo = gallery[round];
      if (photo && photos.length < limit) photos.push(photo);
    }
  }
  return photos;
}

export type PluralForm = 'one' | 'few' | 'many';

/** Форма слова для числа: в русском одна, две и пять, в английском others становятся many. */
export function pluralFormOf(count: number, locale: string): PluralForm {
  const rule = new Intl.PluralRules(locale).select(count);
  return rule === 'one' || rule === 'few' ? rule : 'many';
}
