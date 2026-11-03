import SearchResults from '@moscowcss/ui/components/SearchResults';

export default {
  title: 'Components/SearchResults',
  component: SearchResults,
};

// Список наполняет клиентский скрипт страницы поиска, поэтому в сторис видны
// только состояния каркаса: пустая выдача и заметка про отсутствующий индекс.
export const Empty = {
  args: { note: 'Поиск работает только на собранном сайте.' },
};

export const LongNote = {
  args: {
    note: 'Поиск работает только на собранном сайте: индекс строит pagefind после сборки, поэтому в режиме разработки выдача всегда пуста, а это сообщение остаётся на экране вместо результатов.',
  },
};
