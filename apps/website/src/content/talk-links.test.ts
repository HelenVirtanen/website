import { describe, expect, it, vi } from 'vitest';
import { event, talk } from '../test/fixtures';
import { talkLinksOf } from './talk-links';

vi.mock('astro:content', () => ({ getCollection: vi.fn() }));

const labels = { slides: 'Слайды', video: 'Запись доклада', recording: 'Запись митапа' };
const recorded = event('ru/18', { recordingUrl: 'https://example.com/meetup' });

describe('talkLinksOf', () => {
  it('своя нарезка важнее записи митапа', () => {
    const own = talk('ru/a', { event: '18', videoUrl: 'https://example.com/talk', slidesUrl: 'https://example.com/s' });
    expect(talkLinksOf(own, recorded, labels)).toEqual([
      { href: 'https://example.com/s', label: 'Слайды' },
      { href: 'https://example.com/talk', label: 'Запись доклада' },
    ]);
  });

  it('без нарезки ведёт на запись митапа', () => {
    expect(talkLinksOf(talk('ru/b', { event: '18' }), recorded, labels)).toEqual([
      { href: 'https://example.com/meetup', label: 'Запись митапа' },
    ]);
  });

  it('нет ни нарезки, ни записи — видео нет', () => {
    expect(talkLinksOf(talk('ru/c', { event: '6' }), event('ru/6'), labels)).toEqual([]);
  });
});
