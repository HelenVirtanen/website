import { defaultLocale, localizePath, locales, type Locale } from '../i18n';

/** Адрес данных архива языка (спека 007): `/archive.json`, `/en/archive.json`. */
export const archiveDataPath = (locale: Locale): string => `${localizePath(locale)}archive.json`;

/** Язык данных архива по адресу эндпоинта. */
export const localeOfArchiveData = (pathname: string): Locale =>
  locales.find((locale) => locale !== defaultLocale && pathname.startsWith(`/${locale}/`)) ?? defaultLocale;
