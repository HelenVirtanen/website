import LinkList from '@moscowcss/ui/components/LinkList';

export default {
  title: 'Components/LinkList',
  component: LinkList,
};

export const Default = {
  args: {
    title: 'Прошедшие митапы',
    items: [
      { href: '/events/30/', label: '30 митап сообщества фронтендеров', caption: '5 марта 2026' },
      { href: '/events/29/', label: '29 митап сообщества фронтендеров', caption: '4 декабря 2025' },
    ],
  },
};

export const WithoutCaption = {
  args: {
    title: 'Прошедшие митапы',
    items: [{ href: '/events/30/', label: '30 митап сообщества фронтендеров' }],
  },
};

export const Empty = {
  args: {
    title: 'Прошедшие митапы',
    items: [],
  },
};

export const LongContent = {
  args: {
    title: 'Прошедшие митапы с очень длинным названием раздела, которое не помещается в одну строку',
    items: [
      {
        href: '/events/28/',
        label:
          '28 митап сообщества фронтендеров с очень длинным названием, которое занимает несколько строк на узком экране',
        caption: '16 октября 2025',
      },
      { href: '/events/27/', label: 'https://example.com/очень-длинная-ссылка-без-пробелов-и-переносов-совсем', caption: '3 июля 2025' },
      ...Array.from({ length: 10 }, (_, index) => ({
        href: `/events/${String(26 - index)}/`,
        label: `${String(26 - index)} митап сообщества фронтендеров`,
        caption: '2025',
      })),
    ],
  },
};
