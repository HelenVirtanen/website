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
  return fragments.map(({ url, meta }) => ({
    url,
    title: meta.title ?? url,
    description: meta.description ?? '',
  }));
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
  } catch {
    return { query, hits: [], indexAvailable: false };
  }
}
