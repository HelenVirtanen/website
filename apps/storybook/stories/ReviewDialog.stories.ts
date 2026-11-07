import ReviewDialog from '@moscowcss/ui/components/ReviewDialog';
import photoUrl from '../../../packages/content/src/organizers/assets/roman-troitsky.png?url';

export default {
  title: 'Components/ReviewDialog',
  component: ReviewDialog,
};

const image = { src: photoUrl, width: 498, height: 498 };

// Окно показано открытым без подложки: в сторис нет скрипта стены, который вызывает showModal.
export const WithGallery = {
  args: {
    open: true,
    slug: 'example',
    name: 'Имя Фамилия',
    category: 'Спикер',
    role: 'Должность и компания',
    image,
    gallery: [
      { ...image, alt: 'Первый снимок' },
      { ...image, alt: 'Второй снимок' },
    ],
    closeHref: '#',
    closeLabel: 'Закрыть отзыв',
    shareHref: '?review=example',
    copyLabel: 'Скопировать ссылку на отзыв',
    copiedLabel: 'Ссылка скопирована',
    copyFailedLabel: 'Не получилось скопировать',
    slots: { default: '<p>Пример текста для вёрстки.</p><p>Второй абзац.</p>' },
  },
};
