import { describe, expect, it, vi } from 'vitest';
import { useTranslations } from '../i18n';
import { navLinksOf } from './nav';

vi.mock('astro:i18n', () => ({
  getRelativeLocaleUrl: (locale: string, path = '') =>
    `/${locale === 'ru' ? '' : `${locale}/`}${path === '' ? '' : `${path}/`}`,
}));

describe('navLinksOf', () => {
  it('пять разделов сайта своего языка, без якорей главной', () => {
    expect(navLinksOf('ru', useTranslations('ru')).map((link) => link.href)).toEqual([
      '/events/',
      '/talks/',
      '/speakers/',
      '/about/',
      '/search/',
    ]);
    expect(navLinksOf('en', useTranslations('en'))[1]).toEqual({ href: '/en/talks/', label: 'Talks' });
    expect(navLinksOf('ru', useTranslations('ru'))[0]).toEqual({ href: '/events/', label: 'История' });
  });

  it('текущий раздел: сама страница — page, страница внутри — true, главная — ничего', () => {
    const t = useTranslations('ru');
    expect(navLinksOf('ru', t, '/speakers/').find((link) => link.current)).toMatchObject({ href: '/speakers/', current: 'page' });
    expect(navLinksOf('ru', t, '/talks/grid/').find((link) => link.current)).toMatchObject({ href: '/talks/', current: 'true' });
    expect(navLinksOf('ru', t, '/').some((link) => link.current)).toBe(false);
    expect(navLinksOf('en', useTranslations('en'), '/talks/').some((link) => link.current)).toBe(false);
  });
});
