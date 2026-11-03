import { describe, expect, it } from 'vitest';
import { defaultLocale, locales, localeNames, localeSwitchHints } from './config';
import { ui } from './ui';

const keysOf = (locale: keyof typeof ui): string[] =>
  Object.keys(ui[locale]).sort((a, b) => a.localeCompare(b));

describe('i18n: словари интерфейса', () => {
  it('словарь есть у каждого включённого языка', () => {
    for (const locale of locales) expect(ui).toHaveProperty(locale);
  });

  it.each(locales.filter((locale) => locale !== defaultLocale))(
    'набор ключей %s совпадает с ru',
    (locale) => {
      expect(keysOf(locale)).toEqual(keysOf(defaultLocale));
    },
  );

  it('ни одна строка не пуста', () => {
    for (const locale of locales) {
      for (const [key, text] of Object.entries(ui[locale])) {
        expect(text.trim(), `${locale}: ${key}`).not.toBe('');
      }
    }
  });

  it('у каждого языка есть самоназвание и подпись переключателя', () => {
    for (const locale of locales) {
      expect(localeNames[locale].trim(), locale).not.toBe('');
      expect(localeSwitchHints[locale].trim(), locale).not.toBe('');
    }
  });

  it.each(locales.filter((locale) => locale !== defaultLocale))(
    'строки %s без кириллицы',
    (locale) => {
      for (const [key, text] of Object.entries(ui[locale])) {
        expect(text, `${locale}: ${key}`).not.toMatch(/[Ѐ-ӿ]/);
      }
    },
  );
});
