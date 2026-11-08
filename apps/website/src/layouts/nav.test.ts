import { describe, expect, it, vi } from 'vitest';
import { useTranslations } from '../i18n';
import { navLinksOf } from './nav';

vi.mock('astro:i18n', () => ({
  getRelativeLocaleUrl: (locale: string, path = '') =>
    `/${locale === 'ru' ? '' : `${locale}/`}${path === '' ? '' : `${path}/`}`,
}));

describe('navLinksOf', () => {
  it('разделы сайта своего языка по порядку: о митапе, история, отзывы, новости, помощь, поиск', () => {
    const links = navLinksOf('ru', useTranslations('ru'), '', { reviews: true });
    expect(links.map((link) => link.href)).toEqual([
      '/about/',
      '/events/',
      '/reviews/',
      '/news/',
      '/help/',
      '/talks/',
      '/speakers/',
      '/search/',
    ]);
    expect(links[1]).toEqual({ href: '/events/', label: 'История' });
    expect(navLinksOf('en', useTranslations('en'))[2]).toEqual({ href: '/en/news/', label: 'News' });
  });

  it('доклады и спикеры — только в меню телефона', () => {
    const links = navLinksOf('ru', useTranslations('ru'));
    expect(links.filter((link) => link.mobileOnly).map((link) => link.href)).toEqual(['/talks/', '/speakers/']);
  });

  it('без опубликованных отзывов пункта отзывов нет', () => {
    expect(navLinksOf('ru', useTranslations('ru')).some((link) => link.href === '/reviews/')).toBe(false);
  });

  it('текущий раздел: сама страница — page, страница внутри — true, главная — ничего', () => {
    const t = useTranslations('ru');
    expect(navLinksOf('ru', t, '/news/').find((link) => link.current)).toMatchObject({ href: '/news/', current: 'page' });
    expect(navLinksOf('ru', t, '/news/holyjs-2026/').find((link) => link.current)).toMatchObject({ href: '/news/', current: 'true' });
    expect(navLinksOf('ru', t, '/').some((link) => link.current)).toBe(false);
    expect(navLinksOf('en', useTranslations('en'), '/talks/').some((link) => link.current)).toBe(false);
  });

  it('страницы докладов и спикеров подсвечивают и «Историю»', () => {
    const current = navLinksOf('ru', useTranslations('ru'), '/talks/grid/').filter((link) => link.current);
    expect(current.map((link) => [link.href, link.current])).toEqual([
      ['/events/', 'true'],
      ['/talks/', 'true'],
    ]);
  });
});
