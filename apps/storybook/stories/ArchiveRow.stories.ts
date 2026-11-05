import ArchiveRow from '@moscowcss/ui/components/ArchiveRow';

export default {
  title: 'Components/ArchiveRow',
  component: ArchiveRow,
};

export const Talk = {
  args: {
    href: '#',
    title: 'Якорное позиционирование',
    meta: ['Алексей Охрименко', '31 митап, 9 июля 2026'],
    badges: ['31', 'видео', 'слайды'],
  },
};

export const Event = {
  args: { href: '#', title: '30 митап сообщества фронтендеров', meta: ['5 марта 2026', 'Звук', 'докладов: 3'], badges: ['запись', 'фото'] },
};

export const Bare = { args: { href: '#', title: 'Митап 2017 года' } };

export const LongTitle = {
  args: {
    href: '#',
    title: 'Очень длинное название доклада про контейнерные запросы, каскадные слои и всё, что между ними, в несколько строк',
    meta: ['Константин Леонидович Константинопольский', 'Анна Иванова', '19 митап, 26 января 2023'],
    badges: ['19', 'видео'],
  },
};
