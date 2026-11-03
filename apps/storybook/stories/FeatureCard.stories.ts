import FeatureCard from '@moscowcss/ui/components/FeatureCard';

export default {
  title: 'Components/FeatureCard',
  component: FeatureCard,
};

export const Default = {
  args: {
    title: 'СОЗДАЁМ МУЗЫКАЛЬНЫЙ СЕРВИС',
    description: 'Умные алгоритмы и персональные рекомендации',
  },
};

export const WithFootnote = {
  args: {
    title: 'ТОП-2',
    description: 'в рейтинге работодателей HH — 2025.',
    footnote:
      'По данным общего рейтинга hh.ru за 2025 г. в категории средних компаний (от 251 до 1000 чел.)',
  },
};
