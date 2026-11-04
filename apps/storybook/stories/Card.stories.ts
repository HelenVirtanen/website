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
      default: `AfterParty в PIVBAR
1-я Тверская-Ямская ул., 2, стр. 1, Москва, 125047`,
    },
  },
};

// Длинный текст и слова без пробелов переносятся внутри карточки, а не вылезают за край.
export const LongText = {
  args: {
    title: 'ХОЧУ СТАТЬ СПИКЕРОМ НА МИТАПЕ И РАССКАЗАТЬ ПРО ВСЁ',
    slots: {
      default:
        'Никакого предыдущего опыта публичных выступлений не требуется: мы приветствуем всех и помогаем подготовиться. Ссылка без пробелов: https://gist.github.com/LenaVladi/5f196be72b5a2bca9a4c5869cf2b2088 и ещё несколько строк, чтобы карточка выросла по высоте и было видно, как переносится текст.',
    },
  },
};
