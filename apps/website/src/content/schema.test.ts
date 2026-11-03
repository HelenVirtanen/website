import { describe, expect, it } from 'vitest';
import { EventSchema, PageSchema, TalkSchema } from '@moscowcss/content/schema';

const event = (patch: Record<string, unknown> = {}) => ({
  date: '2026-07-09',
  time: '18:00',
  tagline: 'Митап',
  venue: { name: 'Звук', address: 'Москва' },
  modes: ['оффлайн'],
  passportRequired: true,
  ...patch,
});

const talk = (patch: Record<string, unknown> = {}) => ({
  event: '31',
  speakers: ['daria-egorova'],
  time: '19:10',
  title: 'Доклад',
  ...patch,
});

describe('EventSchema', () => {
  it('день и московское время дают момент начала в UTC+3', () => {
    expect(EventSchema.parse(event()).date.toISOString()).toBe('2026-07-09T15:00:00.000Z');
  });

  it('YAML-дата (Date в полночь UTC) принимается так же, как строка', () => {
    expect(EventSchema.parse(event({ date: new Date('2026-07-09') })).date.toISOString()).toBe(
      '2026-07-09T15:00:00.000Z',
    );
  });

  it('дата со временем отклоняется: время пишется только в поле time', () => {
    expect(EventSchema.safeParse(event({ date: new Date('2026-07-09T18:00:00') })).success).toBe(false);
    expect(EventSchema.safeParse(event({ date: '2026-07-09T18:00:00+03:00' })).success).toBe(false);
  });

  it('ссылка не https (javascript:, data:, http:) отклоняется', () => {
    for (const registrationUrl of ['javascript:alert(1)', 'data:text/html,x', 'http://example.com']) {
      expect(EventSchema.safeParse(event({ registrationUrl })).success, registrationUrl).toBe(false);
    }
    expect(EventSchema.safeParse(event({ registrationUrl: 'https://example.com' })).success).toBe(true);
  });

  it('интервал в расписании: 24:00 и «наоборот» отклоняются', () => {
    const at = (time: string) => event({ schedule: [{ time, title: 'Перерыв', kind: 'break' }] });
    expect(EventSchema.safeParse(at('20:00—20:15')).success).toBe(true);
    expect(EventSchema.safeParse(at('20:00—19:00')).success).toBe(false);
    expect(EventSchema.safeParse(at('24:00')).success).toBe(false);
  });
});

describe('TalkSchema', () => {
  it('время 99:99 отклоняется', () => {
    expect(TalkSchema.safeParse(talk({ time: '99:99' })).success).toBe(false);
  });
});

describe('PageSchema', () => {
  it('description короче 50 символов отклоняется', () => {
    const page = { title: 'Moscow CSS', telegramUrl: 'https://t.me/moscowcss', questionTag: '#вопрос' };
    expect(PageSchema.safeParse({ ...page, description: 'коротко' }).success).toBe(false);
    expect(PageSchema.safeParse({ ...page, description: 'д'.repeat(60) }).success).toBe(true);
  });
});
