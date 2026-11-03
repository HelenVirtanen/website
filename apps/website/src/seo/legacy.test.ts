import { describe, expect, it, vi } from 'vitest';
import { LEGACY_REDIRECTS, legacyStubOf } from './legacy';

vi.mock('astro:i18n', () => ({ getRelativeLocaleUrl: () => '/' }));

const site = new URL('https://css.moscow');

describe('legacyStubOf', () => {
  const html = legacyStubOf('/events/28/', site, 'Moscow CSS', 'ru');

  it('мгновенный переход, canonical и noindex', () => {
    expect(html).toContain('<meta http-equiv="refresh" content="0; url=/events/28/">');
    expect(html).toContain('<link rel="canonical" href="https://css.moscow/events/28/">');
    expect(html).toContain('<meta name="robots" content="noindex">');
  });

  it('видимая ссылка на новый адрес', () => {
    expect(html).toContain('<a href="/events/28/">/events/28/</a>');
  });
});

describe('LEGACY_REDIRECTS', () => {
  it('старые адреса ведут на новые страницы со слэшем на конце', () => {
    expect(LEGACY_REDIRECTS).toEqual({
      '28.html': '/events/28/',
      '29.html': '/events/29/',
      '30.html': '/events/30/',
      'personal-data.html': '/privacy/',
      'personal-data/index.html': '/privacy/',
      'en/personal-data/index.html': '/en/privacy/',
    });
  });
});
