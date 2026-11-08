import Disclosure from '@moscowcss/ui/components/Disclosure';

export default {
  title: 'Components/Disclosure',
  component: Disclosure,
};

export const Default = {
  args: {
    summary: 'Примеры тем',
    slots: { default: '<ul><li>Организация вёрстки</li><li>Производительность</li><li>Доступность</li></ul>' },
  },
};

export const Open = {
  args: { ...Default.args, open: true },
};
