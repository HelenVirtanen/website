import { describe, expect, it } from 'vitest';
import { aboutPhotosOf, aboutStatsOf, communitiesOf, pluralFormOf } from './about';
import { community, event, speaker, talk } from '../test/fixtures';

type Gallery = ReturnType<typeof aboutPhotosOf>;
const shots = (prefix: string, count: number): Gallery =>
  Array.from({ length: count }, (_, index) => ({ image: { src: `${prefix}-${String(index + 1)}` }, alt: `${prefix}-${String(index + 1)}` })) as unknown as Gallery;

describe('aboutStatsOf', () => {
  it('считает только опубликованное в языке страницы', () => {
    const catalog = {
      events: [event('ru/31'), event('ru/32', { draft: true }), event('en/31')],
      talks: [talk('ru/a'), talk('ru/b'), talk('en/a')],
      speakers: [speaker('ru/x'), speaker('ru/y', { draft: true })],
    };
    expect(aboutStatsOf(catalog, 'ru')).toEqual({ meetups: 1, talks: 2, speakers: 1 });
  });
});

describe('aboutPhotosOf', () => {
  const events = [
    event('ru/29', { date: new Date('2025-03-01'), gallery: shots('29', 3) }),
    event('ru/30', { date: new Date('2025-11-01'), gallery: shots('30', 2) }),
    event('ru/31', { date: new Date('2026-06-01'), gallery: [] }),
    event('ru/32', { date: new Date('2026-11-26'), gallery: shots('32', 1), draft: true }),
    event('en/30', { date: new Date('2025-11-01'), gallery: shots('en30', 2) }),
  ];

  it('сначала по кадру с каждого митапа, от новых к старым', () => {
    expect(aboutPhotosOf(events, 'ru', 4).map((photo) => photo.alt)).toEqual(['30-1', '29-1', '30-2', '29-2']);
  });

  it('не больше, чем есть снимков', () => {
    expect(aboutPhotosOf(events, 'ru', 10)).toHaveLength(5);
  });
});

describe('pluralFormOf', () => {
  it('русский: митап, митапа, митапов', () => {
    expect([1, 21, 2, 34, 5, 11, 12, 35].map((n) => pluralFormOf(n, 'ru'))).toEqual(['one', 'one', 'few', 'few', 'many', 'many', 'many', 'many']);
  });

  it('английский: one и всё остальное', () => {
    expect([1, 2, 35].map((n) => pluralFormOf(n, 'en'))).toEqual(['one', 'many', 'many']);
  });
});

describe('communitiesOf', () => {
  it('берёт опубликованные сообщества языка страницы по названию', () => {
    const entries = [
      community('ru/reworked', { name: 'reWorked' }),
      community('ru/moscowqa', { name: 'Moscow QA' }),
      community('ru/draft', { name: 'Черновик', draft: true }),
      community('en/moscowqa', { name: 'Moscow QA' }),
      community('ru/it-hozyaeva', { name: 'IT-ХОЗЯЕВА' }),
    ];
    expect(communitiesOf(entries, 'ru').map((entry) => entry.id)).toEqual(['ru/it-hozyaeva', 'ru/moscowqa', 'ru/reworked']);
  });
});
