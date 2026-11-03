import { describe, expect, it, vi } from 'vitest';
import { event, speaker, talk, twoMeetupsCatalog } from '../test/fixtures';
import { jsonLdOf, moscowIso, serializeJsonLd, type JsonLdContext } from './jsonld';
import { publicPagesOf } from './pages';

vi.mock('astro:content', () => ({ getCollection: vi.fn() }));
vi.mock('astro:i18n', () => ({
  getRelativeLocaleUrl: (locale: string, path = '') =>
    `/${locale === 'ru' ? '' : `${locale}/`}${path === '' ? '' : `${path}/`}`,
}));

const home = (locale: string) => ({
  id: `${locale}/index`,
  data: {
    title: 'Главная',
    description: 'Описание сообщества',
    telegramUrl: 'https://t.me/moscowcss',
  },
});

const context: JsonLdContext = {
  site: new URL('https://css.moscow'),
  siteName: 'MoscowCSS Meetup',
  telegramUrl: 'https://t.me/moscowcss',
  siteDescription: 'Митапы фронтендеров в Москве',
  image: 'https://css.moscow/og/events/10.png',
};

function graphAt(path: string, catalog = { ...twoMeetupsCatalog(), pages: [home('ru'), home('en')] }) {
  const page = publicPagesOf(catalog).find((item) => item.path === path);
  if (!page) throw new Error(path);
  return jsonLdOf(page, catalog, context);
}

describe('moscowIso', () => {
  it('пишет московское время с поясом, а не UTC', () => {
    expect(moscowIso(new Date('2026-07-09T18:00:00+03:00'))).toBe('2026-07-09T18:00:00+03:00');
  });

  it('позднее начало не переносит дату на следующие сутки', () => {
    expect(moscowIso(new Date('2026-07-09T23:30:00+03:00'))).toBe('2026-07-09T23:30:00+03:00');
  });
});

describe('jsonLdOf', () => {
  it('главная: сообщество и сайт, сайт ссылается на сообщество', () => {
    const graph = graphAt('/en/') as { '@graph': Record<string, unknown>[] };
    const [org, site] = graph['@graph'];
    expect(org).toMatchObject({
      '@type': 'Organization',
      '@id': 'https://css.moscow/#organization',
      sameAs: ['https://t.me/moscowcss', 'https://www.youtube.com/@Moscowcss'],
      description: 'Митапы фронтендеров в Москве',
      logo: 'https://css.moscow/web-app-manifest-512x512.png',
      contactPoint: { '@type': 'ContactPoint', contactType: 'community', url: 'https://t.me/moscowcss' },
    });
    expect(site).toMatchObject({
      '@type': 'WebSite',
      url: 'https://css.moscow/en/',
      inLanguage: 'en',
      publisher: { '@id': 'https://css.moscow/#organization' },
    });
  });

  it('митап: начало, место, организатор и спикеры его докладов', () => {
    expect(graphAt('/events/15/')).toMatchObject({
      '@type': 'Event',
      url: 'https://css.moscow/events/15/',
      startDate: '2025-02-20T18:00:00+03:00',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: 'Звук', address: 'Москва' },
      organizer: { '@id': 'https://css.moscow/#organization' },
      performer: [{ '@type': 'Person', name: 'Дарья Егорова' }],
      image: context.image,
    });
  });

  it('митап без времени — startDate только днём, без адреса — место без address', () => {
    const catalog = {
      ...twoMeetupsCatalog(),
      events: [event('ru/10', { date: new Date('2017-03-02T00:00:00+03:00'), time: undefined, venue: { name: 'Яндекс' } })],
      pages: [home('ru')],
    };
    const graph = graphAt('/events/10/', catalog) as { startDate: string; location: Record<string, unknown> };
    expect(graph.startDate).toBe('2017-03-02');
    expect(graph.location).toEqual({ '@type': 'Place', name: 'Яндекс' });
  });

  it('митап с трансляцией — смешанный формат и онлайн-место', () => {
    const catalog = {
      ...twoMeetupsCatalog(),
      events: [event('ru/10', { streamUrl: 'https://youtube.com/live' })],
      pages: [home('ru')],
    };
    expect(graphAt('/events/10/', catalog)).toMatchObject({
      eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
      location: [{ '@type': 'Place' }, { '@type': 'VirtualLocation', url: 'https://youtube.com/live' }],
    });
  });

  it('спикер-черновик и спикер чужого языка в выступающие не попадают', () => {
    const catalog = {
      ...twoMeetupsCatalog(),
      talks: [talk('ru/a', { event: '10', speakers: ['daria-egorova', 'hidden'] })],
      speakers: [speaker('ru/hidden', { draft: true }), speaker('en/daria-egorova')],
      pages: [home('ru')],
    };
    expect(graphAt('/events/10/', catalog)).not.toHaveProperty('performer');
  });

  it('спикер: имя, роль и ссылки профиля', () => {
    const catalog = {
      ...twoMeetupsCatalog(),
      speakers: [speaker('ru/daria-egorova', { links: [{ label: 'GitHub', url: 'https://github.com/d' }] })],
      pages: [home('ru')],
    };
    expect(graphAt('/speakers/daria-egorova/', catalog)).toMatchObject({
      '@type': 'Person',
      name: 'Дарья Егорова',
      description: 'Дизайнер',
      sameAs: ['https://github.com/d'],
    });
  });

  it('у доклада разметки нет', () => {
    expect(graphAt('/talks/css-nesting/')).toBeUndefined();
  });
});

describe('serializeJsonLd', () => {
  it('строка из контента не закрывает тег script', () => {
    const text = serializeJsonLd({ name: '</script><script>alert(1)</script>' });
    expect(text).not.toContain('<');
    expect(JSON.parse(text)).toEqual({ name: '</script><script>alert(1)</script>' });
  });
});
