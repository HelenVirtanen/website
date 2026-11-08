import ArchiveFilter from '@moscowcss/ui/components/ArchiveFilter';

export default {
  title: 'Components/ArchiveFilter',
  component: ArchiveFilter,
};

// Без скрипта страницы форма скрыта атрибутом hidden; в сторис показываем её сразу.
const base = { hidden: false, queryLabel: 'Название или спикер', queryPlaceholder: 'grid, Охрименко', resetLabel: 'Сбросить' };

export const Talks = {
  args: { ...base, yearLabel: 'Год', anyYearLabel: 'Все годы', years: [2026, 2025, 2024, 2023], mediaLabel: 'Есть видео' },
};

export const TextOnly = { args: { ...base, queryLabel: 'Имя спикера' } };

export const News = {
  args: {
    ...base,
    queryLabel: 'Заголовок или текст',
    queryPlaceholder: 'HolyJS, организатор',
    yearLabel: 'Год',
    anyYearLabel: 'Все годы',
    years: [2026, 2025],
    topicLabel: 'Тема',
    anyTopicLabel: 'Все темы',
    topics: ['Конференции', 'Команда', 'Сайт', 'Конкурсы'],
    mediaLabel: 'Есть фото',
  },
};
