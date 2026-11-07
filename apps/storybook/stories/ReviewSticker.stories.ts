import ReviewSticker from '@moscowcss/ui/components/ReviewSticker';
import photoUrl from '../../../packages/content/src/organizers/assets/roman-troitsky.png?url';

export default {
  title: 'Components/ReviewSticker',
  component: ReviewSticker,
};

const image = { src: photoUrl, width: 498, height: 498 };
const text =
  'Пример текста для вёрстки. Обрезается по числу строк, а весь текст открывается в окне отзыва. Строк здесь больше, чем помещается на листке, поэтому конец абзаца скрыт многоточием, а скринридер читает его целиком до самого конца.';

export const Default = {
  args: { href: '#', name: 'Имя Фамилия', role: 'Должность и компания', text, image, seed: 'example' },
};

export const WithoutRole = {
  args: { href: '#', name: 'Имя Фамилия', text: 'Короткий отзыв.', image, seed: 'other-example' },
};
