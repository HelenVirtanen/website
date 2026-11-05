import SectionTabs from '@moscowcss/ui/components/SectionTabs';

export default {
  title: 'Components/SectionTabs',
  component: SectionTabs,
};

export const Default = {
  args: {
    'aria-label': 'Архив',
    items: [
      { href: '#', label: 'Митапы' },
      { href: '#', label: 'Доклады', current: true },
      { href: '#', label: 'Спикеры' },
    ],
  },
};
