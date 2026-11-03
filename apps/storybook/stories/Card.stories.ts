import Card from '@moscowcss/ui/components/Card';

export default {
  title: 'Components/Card',
  component: Card,
};

export const Default = {
  args: {
    title: 'СОЗДАЕМ МУЗЫКАЛЬНЫЙ СЕРВИС',
    subtitle: 'Умные алгоритмы и Персональные рекомендации',
    slots: {
      default:
        'По данным общего рейтинга hh.ru за 2025 г. в категории средних компаний (от 251 до 1000 чел.)',
    },
  },
};

export const WithoutSubtitle = {
  args: {
    title: 'А ПИВО?',
    slots: {
      default: `Афтапати запланировано в баре:
название
Адрес (ссылка на Я.карты)`,
    },
  },
};
