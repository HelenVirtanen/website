import OrganizerCard from '@moscowcss/ui/components/OrganizerCard';
import photoUrl from '../../../packages/content/src/organizers/assets/roman-troitsky.png?url';

export default {
  title: 'Components/OrganizerCard',
  component: OrganizerCard,
};

const photo = `<img src="${photoUrl}" alt="" width="498" height="498" />`;

const bio = `<ul>
  <li>руководитель направления исследования данных в ПАО Сбербанк</li>
  <li>ex-Senior Frontend Developer</li>
  <li>член программного комитета HolyJS</li>
</ul>`;

export const AllContacts = {
  args: {
    name: 'Роман Троицкий',
    contacts: [
      { href: 'https://t.me/DreamShaded', label: 'TG:', text: '@DreamShaded' },
      { href: 'https://github.com/vzhyx', label: 'GitHub:', text: 'vzhyx' },
      { href: 'https://vzhyx.io', label: 'Сайт:', text: 'vzhyx.io' },
    ],
    slots: { photo, default: bio },
  },
};

export const OneContact = {
  args: {
    name: 'Роман Троицкий',
    contacts: [{ href: 'https://t.me/DreamShaded', label: 'TG:', text: '@DreamShaded' }],
    slots: { photo, default: bio },
  },
};

export const WithoutContacts = {
  args: {
    name: 'Роман Троицкий',
    contacts: [],
    slots: { photo, default: bio },
  },
};

// Без фото блок фото не выводится: карточка начинается с имени.
export const WithoutPhoto = {
  args: {
    name: 'Роман Троицкий',
    contacts: [
      { href: 'https://t.me/DreamShaded', label: 'TG:', text: '@DreamShaded' },
      { href: 'https://vzhyx.io', label: 'Сайт:', text: 'vzhyx.io' },
    ],
    slots: { default: bio },
  },
};

// Текст из Markdown может быть и обычным абзацем.
export const TextBio = {
  args: {
    name: 'Роман Троицкий',
    contacts: [{ href: 'https://t.me/DreamShaded', label: 'TG:', text: '@DreamShaded' }],
    slots: { photo, default: '<p>Руководитель направления исследования данных, в сообществе с 2017 года.</p>' },
  },
};
