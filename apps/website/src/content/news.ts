import { eventDateParts, fillTemplate } from './format';
import type { NewsEntry } from './catalog';

/** Дата новости словами на языке страницы: «17 мая 2026», «17 May, 2026». */
export function newsDateText(entry: Pick<NewsEntry, 'data'>, locale: string, template: string): string {
  const { day, year } = eventDateParts(entry.data.date, locale);
  return fillTemplate(template, { day, year });
}

/** Крупная дата на месте обложки: `17.05`. */
export function newsPlaceholder(entry: Pick<NewsEntry, 'data'>): string {
  const date = entry.data.date;
  const pad = (value: number): string => String(value).padStart(2, '0');
  return `${pad(date.getUTCDate())}.${pad(date.getUTCMonth() + 1)}`;
}
