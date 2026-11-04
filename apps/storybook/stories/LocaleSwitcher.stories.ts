import LocaleSwitcher from '@moscowcss/ui/components/LocaleSwitcher';

export default {
  title: 'Components/LocaleSwitcher',
  component: LocaleSwitcher,
};

const ru = {
  code: 'ru',
  label: 'Русский',
  href: '/',
  hint: 'Перейти на русскую версию',
};
const en = {
  code: 'en',
  label: 'English',
  href: '/en/',
  hint: 'Switch to the English version',
};

/** Текущий язык ярче второго; между ними разделитель. */
export const Default = {
  args: {
    label: 'Язык сайта',
    options: [
      { ...ru, current: true },
      { ...en, current: false },
    ],
  },
};

export const EnglishCurrent = {
  args: {
    label: 'Site language',
    options: [
      { ...ru, current: false },
      { ...en, current: true },
    ],
  },
};

export const SingleLanguage = {
  args: {
    label: 'Язык сайта',
    options: [{ ...ru, current: true }],
  },
};

export const Empty = {
  args: {
    label: 'Язык сайта',
    options: [],
  },
};
