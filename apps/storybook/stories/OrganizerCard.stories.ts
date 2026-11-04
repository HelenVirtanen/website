import OrganizerCard from '@moscowcss/ui/components/OrganizerCard';
import photoUrl from '../../../packages/content/src/organizers/assets/roman-troitsky.png';

export default {
  title: 'Components/OrganizerCard',
  component: OrganizerCard,
};

const photo = `<img src="${photoUrl}" alt="Роман Троицкий" width="498" height="498" />`;

const regalia = [
  'руководитель направления исследования данных в ПАО Сбербанк',
  'ex-Senior Frontend Developer',
  'член программного комитета HolyJS',
];

export const AllContacts = {
  args: {
    name: 'Роман Троицкий',
    regalia,
    contacts: [
      { href: 'https://t.me/DreamShaded', label: 'TG:', text: '@DreamShaded' },
      { href: 'https://github.com/vzhyx', label: 'GitHub:', text: 'vzhyx' },
      { href: 'https://vzhyx.io', label: 'Сайт:', text: 'vzhyx.io' },
    ],
    slots: { photo },
  },
};

export const OneContact = {
  args: {
    name: 'Роман Троицкий',
    regalia,
    contacts: [{ href: 'https://t.me/DreamShaded', label: 'TG:', text: '@DreamShaded' }],
    slots: { photo },
  },
};

export const WithoutContacts = {
  args: {
    name: 'Роман Троицкий',
    regalia,
    contacts: [],
    slots: { photo },
  },
};

// Без фото блок фото не выводится: карточка начинается с имени.
export const WithoutPhoto = {
  args: {
    name: 'Роман Троицкий',
    regalia,
    contacts: [
      { href: 'https://t.me/DreamShaded', label: 'TG:', text: '@DreamShaded' },
      { href: 'https://vzhyx.io', label: 'Сайт:', text: 'vzhyx.io' },
    ],
  },
};
