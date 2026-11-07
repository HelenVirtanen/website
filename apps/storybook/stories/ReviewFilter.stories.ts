import ReviewFilter from '@moscowcss/ui/components/ReviewFilter';

export default {
  title: 'Components/ReviewFilter',
  component: ReviewFilter,
};

// Блок скрыт до запуска скрипта стены, поэтому в сторис показан явно.
export const Default = {
  args: {
    hidden: false,
    options: [
      { value: 'speaker', label: 'Спикеры' },
      { value: 'partner', label: 'Партнёры' },
    ],
    allLabel: 'Все',
    groupLabel: 'Кто оставил отзыв',
    statusTemplate: 'Показано {shown} из {total}',
  },
};
