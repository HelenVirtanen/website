// Обёртка над JS API Pagefind. Модуль приходит аргументом (`load`): тест подставляет фейк,
// страница — `import('/pagefind/pagefind.js')`. Готовый UI Pagefind не используется.

/** Сколько результатов показывать: хвост длинной выдачи читателю не нужен */
export const RESULTS_LIMIT = 20;

/** Часть ответа `pagefind.search()`, которую читаем мы */
export interface PagefindModule {
  search: (query: string) => Promise<{ results: { data: () => Promise<PagefindFragment> }[] }>;
}

export interface PagefindFragment {
  url: string;
  meta: { title?: string; description?: string };
  /** Разделы страницы с совпадениями: заголовок с `id` и отрывок вокруг найденного */
  sub_results?: { url: string; title: string; excerpt: string }[];
}

export interface SearchHit {
  url: string;
  title: string;
  description: string;
}

export interface SearchOutcome {
  /** Запрос после обрезки пробелов */
  query: string;
  hits: SearchHit[];
  /** Индекс ответил. `false` — модуля нет (dev-сервер: индекс строит `pagefind` после сборки) или он упал */
  indexAvailable: boolean;
}

// Заголовок окна отзыва: `<h2 id="review-<имя файла>-title">` (ReviewDialog).
const REVIEW_HEADING = /#review-(.+)-title$/;

const plain = (html: string): string => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

/**
 * Стена отзывов — одна страница, а окно отзыва открывает `?review=`, а не якорь заголовка.
 * Поэтому каждый найденный отзыв становится своим результатом со ссылкой на его окно и отрывком.
 */
export function hitsOfFragment({ url, meta, sub_results: sections = [] }: PagefindFragment): SearchHit[] {
  const reviews = sections.flatMap((section) => {
    const slug = REVIEW_HEADING.exec(section.url)?.[1];
    if (slug === undefined) return [];
    const page = section.url.slice(0, section.url.indexOf('#'));
    return [{ url: `${page}?review=${encodeURIComponent(slug)}`, title: `${section.title} — ${meta.title ?? page}`, description: plain(section.excerpt) }];
  });
  if (reviews.length > 0) return reviews;
  return [{ url, title: meta.title ?? url, description: meta.description ?? '' }];
}

/**
 * Первые `limit` совпадений с заголовком и описанием. Язык выдачи Pagefind выбирает сам
 * по `<html lang>` страницы поиска, поэтому чужой язык сюда не попадает.
 */
export async function searchPages(
  pagefind: PagefindModule,
  query: string,
  limit = RESULTS_LIMIT,
): Promise<SearchHit[]> {
  const { results } = await pagefind.search(query);
  const fragments = await Promise.all(results.slice(0, limit).map((result) => result.data()));
  return fragments.flatMap(hitsOfFragment).slice(0, limit);
}

/**
 * Полная выдача. Пустой запрос индекс не трогает. Сбой загрузки или поиска страницу
 * не роняет: выдача пуста, `indexAvailable` — `false`.
 */
export async function search(
  rawQuery: string,
  load: () => Promise<PagefindModule>,
): Promise<SearchOutcome> {
  const query = rawQuery.trim();
  if (query === '') return { query, hits: [], indexAvailable: true };
  try {
    return { query, hits: await searchPages(await load(), query), indexAvailable: true };
  } catch (error) {
    // Без следа в консоли отказ на проде (404 индекса, wasm, CSP) неотличим от пустой выдачи.
    console.error('Pagefind: поиск недоступен', error);
    return { query, hits: [], indexAvailable: false };
  }
}
