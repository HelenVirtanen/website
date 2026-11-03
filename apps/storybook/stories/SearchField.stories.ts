import SearchField from '@moscowcss/ui/components/SearchField';

export default {
  title: 'Components/SearchField',
  component: SearchField,
};

const base = { label: 'Поиск по сайту', submitLabel: 'Найти', action: '/search/', method: 'get' };

export const Empty = { args: { ...base, placeholder: 'Фамилия спикера или тема' } };

export const WithQuery = { args: { ...base, value: 'Иванов' } };

export const LongQuery = {
  args: {
    ...base,
    value: 'очень длинный поисковый запрос, который не помещается в поле ввода на узком экране телефона',
  },
};

export const Disabled = { args: { ...base, value: 'Иванов', disabled: true } };
