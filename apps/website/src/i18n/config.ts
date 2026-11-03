// Единственный источник списка языков. Держать в синхроне с `i18n` в astro.config.mjs.
// Добавить язык: код сюда и в astro.config.mjs, затем словарь в ui.ts.
export const locales = ['ru', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ru';

export const isLocale = (value: string | undefined): value is Locale =>
  locales.some((locale) => locale === value);

// Самоназвания: не зависят от языка страницы, «English» всегда «English».
export const localeNames: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
};

// Подпись-действие на языке самой опции: её читает скринридер при `lang=<код>`.
export const localeSwitchHints: Record<Locale, string> = {
  ru: 'Перейти на русскую версию',
  en: 'Switch to the English version',
};
