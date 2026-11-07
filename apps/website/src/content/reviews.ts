import { REVIEW_CATEGORIES } from '@moscowcss/content/schema';
import { localeOf, slugOf, type ReviewEntry } from './catalog';

/** Опубликованные отзывы одного языка по имени файла: порядок без скрипта, страница его перемешивает. */
export function publishedReviews<T extends Pick<ReviewEntry, 'id' | 'data'>>(entries: readonly T[], locale: string): T[] {
  return entries
    .filter((entry) => localeOf(entry) === locale && !entry.data.draft)
    .sort((a, b) => slugOf(a).localeCompare(slugOf(b)));
}

/** Категории, у которых есть отзывы, в порядке кнопок; пустую кнопку показывать незачем. */
export function reviewCategories(entries: readonly Pick<ReviewEntry, 'data'>[]): (typeof REVIEW_CATEGORIES)[number][] {
  const present = new Set(entries.map((entry) => entry.data.category));
  return REVIEW_CATEGORIES.filter((category) => present.has(category));
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

const decodeEntities = (text: string): string =>
  text.replace(/&(?:#(\d+)|#x([\da-f]+)|(\w+));/gi, (whole, decimal?: string, hex?: string, name?: string) => {
    if (decimal) return String.fromCodePoint(Number(decimal));
    if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
    return ENTITIES[name ?? ''] ?? whole;
  });

const plainText = (html: string): string => decodeEntities(html.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

// Столько помещается на листок в 6–7 строк самой узкой колонки.
const PREVIEW_LENGTH = 220;

/**
 * Начало отзыва для стикера: первый абзац без разметки, длинный обрезан по границе слова. Берётся из
 * готового HTML: Markdown уже разобран, ссылка или выделение не оставят лишних знаков. Режем здесь, а не
 * CSS-обрезкой строк: та прячет текст, когда человек увеличивает интервалы (WCAG 1.4.12).
 */
export function previewOf(html: string, limit = PREVIEW_LENGTH): string {
  const paragraph = /<p>([\s\S]*?)<\/p>/.exec(html)?.[1];
  const text = plainText(paragraph ?? html);
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit + 1);
  const end = cut.lastIndexOf(' ');
  return `${(end > 0 ? cut.slice(0, end) : text.slice(0, limit)).replace(/[\s,;:—–-]+$/u, '')}…`;
}
