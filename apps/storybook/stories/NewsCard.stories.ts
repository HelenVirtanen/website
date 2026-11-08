import NewsCard from '@moscowcss/ui/components/NewsCard';
import coverUrl from '../../../packages/content/src/news/assets/holyjs-2026-team.jpg?url';

export default {
  title: 'Components/NewsCard',
  component: NewsCard,
};

const base = {
  href: '#news',
  title: 'MoscowCSS на стенде HolyJS',
  date: '17 мая 2026',
  datetime: '2026-05-17',
  description: 'Две игры для гостей конференции, мерч и новые лица в команде организаторов.',
  topics: ['Конференции', 'Команда'],
};

export const WithCover = {
  args: {
    ...base,
    image: { src: coverUrl, width: 1280, height: 853 },
  },
};

// Без обложки карточка показывает дату крупно.
export const WithoutCover = {
  args: { ...base, placeholder: '17.05' },
};
