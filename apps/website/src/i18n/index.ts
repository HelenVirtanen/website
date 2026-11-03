import { getRelativeLocaleUrl } from 'astro:i18n';
import { defaultLocale, type Locale } from './config';
import { ui, type UiKey } from './ui';

export {
  defaultLocale,
  isLocale,
  locales,
  localeNames,
  localeSwitchHints,
  type Locale,
} from './config';
export type { UiKey } from './ui';

// Строка языка страницы; если её нет, берётся строка defaultLocale, затем сам ключ:
// частично переведённый язык не рисует пустой текст.
export function useTranslations(locale: Locale) {
  const dictionaries: Partial<Record<Locale, Partial<Record<UiKey, string>>>> = ui;
  return function t(key: UiKey): string {
    return dictionaries[locale]?.[key] ?? dictionaries[defaultLocale]?.[key] ?? key;
  };
}

// Адрес страницы нужного языка; хвостовой слэш ставит `trailingSlash: 'always'`.
export function localizePath(locale: Locale, path?: string): string {
  return getRelativeLocaleUrl(locale, path);
}
