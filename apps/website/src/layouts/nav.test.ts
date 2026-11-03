import { describe, expect, it, vi } from 'vitest';
import { useTranslations } from '../i18n';
import { navLinksOf } from './nav';

vi.mock('astro:i18n', () => ({
  getRelativeLocaleUrl: (locale: string, path = '') =>
    `/${locale === 'ru' ? '' : `${locale}/`}${path === '' ? '' : `${path}/`}`,
}));

describe('navLinksOf', () => {
  it('разделы ведут на главную своего языка, а не на якорь текущей страницы', () => {
    expect(navLinksOf('ru', useTranslations('ru')).map((link) => link.href)).toEqual([
      '/#registration',
      '/#program',
      '/#partners',
      '/#address',
      '/#events',
      '/search/',
    ]);
    expect(navLinksOf('en', useTranslations('en'))[1]).toEqual({ href: '/en/#program', label: 'Program' });
    expect(navLinksOf('ru', useTranslations('ru'))[4]).toEqual({ href: '/#events', label: 'История' });
  });

  it('каждый якорь — id секции главной', async () => {
    const { readFile } = await import('node:fs/promises');
    const sections = await Promise.all(
      ['HeroSection', 'ProgramSection', 'PartnerSection', 'PastEventsSection'].map((name) =>
        readFile(new URL(`../sections/${name}.astro`, import.meta.url), 'utf8'),
      ),
    );
    const source = sections.join('\n');
    for (const { href } of navLinksOf('ru', useTranslations('ru')).slice(0, -1)) {
      const anchor = href.split('#')[1];
      expect(source, anchor).toMatch(new RegExp(`(id = '|id=")${anchor}['"]`));
    }
  });
});
