import TalkCard from '@moscowcss/ui/components/TalkCard';
import coverUrl from '../../../packages/content/src/talks/assets/shapes-in-css.jpg?url';

export default {
  title: 'Components/TalkCard',
  component: TalkCard,
};

export const Default = {
  args: {
    href: '#',
    title: 'Фигурки в CSS',
    label: '23',
    meta: '23 митап, 12 декабря 2023',
    image: { src: coverUrl, width: 1200, height: 630 },
  },
};
