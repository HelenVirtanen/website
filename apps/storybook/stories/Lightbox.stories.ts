import Lightbox from '@moscowcss/ui/components/Lightbox';
import photoUrl from '../../../packages/content/src/organizers/assets/roman-troitsky.png?url';

export default {
  title: 'Components/Lightbox',
  component: Lightbox,
};

const item = (alt: string) =>
  `<a data-lightbox-item href="${photoUrl}"><img src="${photoUrl}" alt="${alt}" width="160" height="160" /></a>`;

export const Gallery = {
  args: {
    dialogLabel: 'Фото',
    closeLabel: 'Закрыть фото',
    prevLabel: 'Предыдущее фото',
    nextLabel: 'Следующее фото',
    slots: { default: `${item('Первый снимок')} ${item('Второй снимок')}` },
  },
};
