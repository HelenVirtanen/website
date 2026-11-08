import {
  filterArchive,
  filterFromSearch,
  searchOfFilter,
  type Archive,
  type ArchiveFilter,
  type ListKind,
} from '../content/archive-filter';

// Фильтр страницы списка. Разметку отдаёт ArchivePage.astro: строки — `li[data-archive-index]`,
// данные строк — JSON в `script[data-archive-data]`, форма — ArchiveFilter из @moscowcss/ui.
// Без скрипта список виден целиком, а форма скрыта.

const fill = (template: string, values: Record<string, number>): string =>
  template.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match));

function filterOfForm(form: HTMLFormElement): ArchiveFilter {
  const data = new FormData(form);
  return filterFromSearch(
    new URLSearchParams({
      q: String(data.get('q') ?? ''),
      year: String(data.get('year') ?? ''),
      topic: String(data.get('topic') ?? ''),
      media: data.get('media') === null ? '' : '1',
    }),
  );
}

function writeForm(form: HTMLFormElement, filter: ArchiveFilter): void {
  const { q, year, topic, media } = form.elements as unknown as {
    q?: HTMLInputElement;
    year?: HTMLSelectElement;
    topic?: HTMLSelectElement;
    media?: HTMLInputElement;
  };
  if (q) q.value = filter.query;
  if (year) year.value = filter.year === undefined ? '' : String(filter.year);
  if (topic) topic.value = filter.topic ?? '';
  if (media) media.checked = filter.media;
}

function init(root: HTMLElement): void {
  const kind = root.dataset.archiveKind as ListKind | undefined;
  const form = root.querySelector<HTMLFormElement>('[data-archive-filter]');
  const data = root.querySelector('[data-archive-data]');
  const list = root.querySelector<HTMLElement>('[data-archive-list]');
  const status = root.querySelector<HTMLElement>('[data-archive-status]');
  const empty = root.querySelector<HTMLElement>('[data-archive-empty]');
  if (!kind || !form || !data?.textContent || !list) return;

  const items = (JSON.parse(data.textContent) as Archive)[kind];
  const rows = [...list.querySelectorAll<HTMLElement>('[data-archive-index]')];
  const template = root.dataset.archiveTemplate ?? '';

  const apply = (filter: ArchiveFilter, announce: boolean): void => {
    const shown = new Set<unknown>(filterArchive(kind, items, filter));
    for (const row of rows) row.hidden = !shown.has(items[Number(row.dataset.archiveIndex)]);
    list.hidden = shown.size === 0;
    if (empty) empty.hidden = shown.size > 0;
    if (status && announce) status.textContent = fill(template, { shown: shown.size, total: items.length });
    const url = new URL(window.location.href);
    url.search = searchOfFilter(filter);
    window.history.replaceState(window.history.state, '', url);
  };

  const initial = filterFromSearch(new URLSearchParams(window.location.search));
  writeForm(form, initial);
  form.hidden = false;
  apply(initial, searchOfFilter(initial) !== '');

  form.addEventListener('input', () => apply(filterOfForm(form), true));
  form.addEventListener('change', () => apply(filterOfForm(form), true));
  form.addEventListener('submit', (event) => event.preventDefault());
  // `reset` срабатывает до очистки полей, поэтому фильтр читается на следующем такте.
  form.addEventListener('reset', () => setTimeout(() => apply(filterOfForm(form), true)));
  root.querySelector('[data-archive-reset]')?.addEventListener('click', () => {
    form.reset();
    form.querySelector<HTMLInputElement>('input[name="q"]')?.focus();
  });
}

for (const root of document.querySelectorAll<HTMLElement>('[data-archive]')) init(root);
