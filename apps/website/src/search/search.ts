import { search, type PagefindModule, type SearchHit } from './pagefind';

// Клиент страницы поиска. Запрос берётся из адреса (`?q=`): форма уходит обычным GET,
// страница открывается заново, и состояния хранить не нужно. Разметку отдаёт
// `SearchResults` из @moscowcss/ui: [data-search-status], [data-search-note],
// [data-search-list] и template[data-search-item] с узлами [data-title] и [data-desc].

declare global {
  interface Window {
    /** Динамический import индекса: его кладёт в страницу inline-скрипт search.astro */
    loadPagefind?: () => Promise<PagefindModule>;
  }
}

// Индекс кладёт в dist Pagefind после сборки, в исходниках его нет. Импорт лежит в
// inline-скрипте страницы: в бандле Vite оборачивает его в preload-хелпер, и в
// инлайнутом Astro-скрипте остаётся неподставленный __VITE_PRELOAD__ (ReferenceError).
const loadPagefind = (): Promise<PagefindModule> => {
  if (!window.loadPagefind) return Promise.reject(new Error('pagefind loader is missing'));
  return window.loadPagefind();
};

const buildItem = (template: HTMLTemplateElement, { url, title, description }: SearchHit): Node => {
  const item = template.content.cloneNode(true) as DocumentFragment;
  const link = item.querySelector<HTMLAnchorElement>('[data-title]');
  const desc = item.querySelector('[data-desc]');
  if (link) {
    link.href = url;
    link.textContent = title;
  }
  if (desc) {
    if (description) desc.textContent = description;
    else desc.remove();
  }
  return item;
};

export async function initSearch(
  root: HTMLElement,
  load: () => Promise<PagefindModule> = loadPagefind,
): Promise<void> {
  if (root.dataset.enhanced !== undefined) return;
  root.dataset.enhanced = '';

  const status = root.querySelector<HTMLElement>('[data-search-status]');
  const note = root.querySelector<HTMLElement>('[data-search-note]');
  const list = root.querySelector<HTMLElement>('[data-search-list]');
  const template = root.querySelector<HTMLTemplateElement>('template[data-search-item]');
  if (!status || !list || !template) return;

  const input = document.querySelector<HTMLInputElement>('input[name="q"]');
  const q = new URLSearchParams(location.search).get('q') ?? '';
  if (input) input.value = q;

  const { query, hits, indexAvailable } = await search(q, load);
  list.replaceChildren(...hits.map((hit) => buildItem(template, hit)));
  if (note) note.hidden = indexAvailable;
  // Без индекса «ничего не нашлось» было бы неправдой: полного текста мы не видели.
  if (query === '') status.textContent = root.dataset.empty ?? '';
  else if (hits.length === 0 && indexAvailable)
    status.textContent = (root.dataset.noResults ?? '').replace('{q}', () => query);
  else status.textContent = '';
}

document
  .querySelectorAll<HTMLElement>('[data-search]')
  .forEach((root) => void initSearch(root));
