import { describe, expect, it, vi } from 'vitest';
import { event, partner, speaker, talk, twoMeetupsCatalog } from '../test/fixtures';
import {
  CatalogError,
  EVENT_DURATION_MS,
  pastEvents,
  scheduleOf,
  talksOfEvent,
  talksOfSpeaker,
  upcomingEvent,
  validateCatalog,
} from './catalog';

vi.mock('astro:content', () => ({ getCollection: vi.fn() }));

const messageOf = (run: () => void): string => {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(CatalogError);
    return (error as Error).message;
  }
  throw new Error('validateCatalog не бросил ошибку');
};

describe('validateCatalog', () => {
  it('пропускает согласованный каталог', () => {
    expect(() => validateCatalog(twoMeetupsCatalog())).not.toThrow();
  });

  it('пустое тело доклада: путь файла в сообщении', () => {
    const catalog = twoMeetupsCatalog();
    catalog.talks[0] = { ...catalog.talks[0]!, body: '  \n' };
    expect(messageOf(() => validateCatalog(catalog))).toContain('talks/ru/css-nesting.md: текст файла пуст');
  });

  it('текст есть, а рендера нет (ошибка рендера из кэша) — ошибка с путём', () => {
    const catalog = twoMeetupsCatalog();
    for (const entry of catalog.talks) entry.rendered = { html: '<p>Описание доклада.</p>' };
    expect(() => validateCatalog(catalog, { requireRendered: true })).not.toThrow();
    catalog.talks[0] = { ...catalog.talks[0]!, rendered: undefined };
    expect(messageOf(() => validateCatalog(catalog, { requireRendered: true }))).toContain(
      'talks/ru/css-nesting.md: текст файла не отрендерился',
    );
  });

  it('опубликованный митап ссылается на партнёра-черновика', () => {
    const catalog = twoMeetupsCatalog();
    catalog.events[0] = event('ru/10', { date: new Date('2024-03-14T18:00:00+03:00'), partner: 'zvuk' });
    catalog.partners = [{ ...partner('ru/zvuk'), data: { ...partner('ru/zvuk').data, draft: true } }];
    expect(messageOf(() => validateCatalog(catalog))).toContain('партнёр «zvuk» — черновик');
  });

  it('расхождение passportRequired в переводе митапа', () => {
    const catalog = twoMeetupsCatalog();
    catalog.events[2] = event('en/10', { date: new Date('2024-03-14T18:00:00+03:00'), passportRequired: true });
    expect(messageOf(() => validateCatalog(catalog))).toContain('events/en/10.md: поле passportRequired');
  });

  it('несуществующий спикер: путь файла доклада и имя в сообщении', () => {
    const catalog = twoMeetupsCatalog();
    catalog.talks[0] = talk('ru/css-nesting', { event: '10', speakers: ['nobody'] });
    const message = messageOf(() => validateCatalog(catalog));
    expect(message).toContain('packages/content/src/talks/ru/css-nesting.md');
    expect(message).toContain('nobody');
    expect(message).toContain('speakers/ru');
  });

  it('спикер есть только в другом языке: в своём языке это ошибка', () => {
    const catalog = twoMeetupsCatalog();
    catalog.speakers = [speaker('en/daria-egorova')];
    const message = messageOf(() => validateCatalog(catalog));
    expect(message).toContain('talks/ru/css-nesting.md');
    expect(message).toContain('daria-egorova');
  });

  it('несуществующий митап в своём языке', () => {
    const catalog = twoMeetupsCatalog();
    catalog.talks[1] = talk('ru/anchor-positioning', { event: '99' });
    const message = messageOf(() => validateCatalog(catalog));
    expect(message).toContain('talks/ru/anchor-positioning.md');
    expect(message).toContain('«99»');
  });

  it('несуществующий партнёр митапа', () => {
    const catalog = twoMeetupsCatalog();
    catalog.events[0] = event('ru/10', { partner: 'zvuk' });
    expect(messageOf(() => validateCatalog(catalog))).toContain('«zvuk»');
    catalog.partners = [partner('ru/zvuk')];
    catalog.events[2] = event('en/10', { partner: 'zvuk' });
    catalog.partners.push(partner('en/zvuk'));
    expect(() => validateCatalog(catalog)).not.toThrow();
  });

  it('расхождение time в en: путь файла и поле time', () => {
    const catalog = twoMeetupsCatalog();
    catalog.talks[2] = talk('en/css-nesting', { event: '10', time: '19:35' });
    const message = messageOf(() => validateCatalog(catalog));
    expect(message).toContain('packages/content/src/talks/en/css-nesting.md');
    expect(message).toContain('поле time отличается от ru/css-nesting');
  });

  it('расхождение даты митапа и времени в schedule', () => {
    const catalog = twoMeetupsCatalog();
    const schedule = [{ time: '19:40—20:00', title: 'Перерыв', kind: 'break' as const }];
    catalog.events[0] = event('ru/10', { date: catalog.events[0]!.data.date, schedule });
    catalog.events[2] = event('en/10', {
      date: new Date('2024-03-15T18:00:00+03:00'),
      schedule: [{ time: '19:45—20:00', title: 'Break', kind: 'break' }],
    });
    const message = messageOf(() => validateCatalog(catalog));
    expect(message).toContain('events/en/10.md: поле date');
    expect(message).toContain('events/en/10.md: поле schedule[].time');
    expect(message).not.toContain('schedule[].kind');
  });

  it('перевод спикера: расхождение фото и ссылок', () => {
    const catalog = twoMeetupsCatalog();
    catalog.speakers[1] = speaker('en/daria-egorova', {
      photo: { src: '/other.jpg', width: 1, height: 1, format: 'jpg' },
      links: [{ label: 'Site', url: 'https://example.com' }],
    });
    const message = messageOf(() => validateCatalog(catalog));
    expect(message).toContain('поле photo');
    expect(message).toContain('поле links');
  });

  it('перевод без оригинала', () => {
    const catalog = twoMeetupsCatalog();
    catalog.talks.push(talk('en/orphan', { event: '10' }));
    expect(messageOf(() => validateCatalog(catalog))).toContain('talks/en/orphan.md: нет оригинала ru/orphan');
  });

  it('опубликованный доклад в черновом митапе', () => {
    const catalog = twoMeetupsCatalog();
    catalog.events[0] = event('ru/10', { date: catalog.events[0]!.data.date, draft: true });
    const message = messageOf(() => validateCatalog(catalog));
    expect(message).toContain('talks/ru/css-nesting.md');
    expect(message).toContain('черновик');
  });

  it('черновой доклад в черновом митапе допустим', () => {
    const catalog = twoMeetupsCatalog();
    catalog.events[0] = event('ru/10', { date: catalog.events[0]!.data.date, draft: true });
    catalog.talks[0] = talk('ru/css-nesting', { event: '10', time: '19:30', draft: true });
    expect(() => validateCatalog(catalog)).not.toThrow();
  });

  it('собирает все ошибки в одно сообщение', () => {
    const catalog = twoMeetupsCatalog();
    catalog.talks[0] = talk('ru/css-nesting', { event: '10', speakers: ['nobody'] });
    catalog.talks[1] = talk('ru/anchor-positioning', { event: '99' });
    const error = (() => {
      try {
        validateCatalog(catalog);
      } catch (caught) {
        return caught as CatalogError;
      }
      throw new Error('нет ошибки');
    })();
    expect(error.problems.length).toBeGreaterThanOrEqual(2);
  });
});

describe('связи', () => {
  const catalog = twoMeetupsCatalog();
  const meetup10 = catalog.events[0]!;

  it('talksOfEvent: доклады своего митапа и языка по времени', () => {
    const talks = [
      talk('ru/late', { event: '10', time: '21:00' }),
      talk('ru/early', { event: '10', time: '19:10' }),
      talk('ru/other', { event: '15' }),
      talk('en/early', { event: '10', time: '19:10' }),
      talk('ru/hidden', { event: '10', draft: true }),
    ];
    expect(talksOfEvent(meetup10, talks).map((t) => t.id)).toEqual(['ru/early', 'ru/late']);
  });

  it('talksOfSpeaker: доклады на митапах 10 и 15, каждый со своим митапом', () => {
    const result = talksOfSpeaker(catalog.speakers[0]!, catalog.talks, catalog.events);
    expect(result.map((r) => [r.talk.id, r.event.id])).toEqual([
      ['ru/anchor-positioning', 'ru/15'],
      ['ru/css-nesting', 'ru/10'],
    ]);
  });

  it('talksOfSpeaker: чужие, черновые доклады и доклады чернового митапа не попадают', () => {
    const talks = [
      talk('ru/mine', { event: '10' }),
      talk('ru/theirs', { event: '10', speakers: ['someone'] }),
      talk('ru/draft', { event: '10', draft: true }),
      talk('ru/in-draft-event', { event: '15' }),
    ];
    const events = [event('ru/10'), event('ru/15', { draft: true })];
    const result = talksOfSpeaker(catalog.speakers[0]!, talks, events);
    expect(result.map((r) => r.talk.id)).toEqual(['ru/mine']);
  });

  it('scheduleOf: доклады, перерыв и активность сливаются по времени', () => {
    const withBreaks = event('ru/10', {
      schedule: [
        { time: '20:00—20:15', title: 'ПЕРЕРЫВ', kind: 'break' },
        { time: '19:40—20:00', title: 'АКТИВНОСТЬ', kind: 'activity' },
      ],
    });
    const talks = [
      talk('ru/last', { event: '10', time: '21:00', title: 'Третий' }),
      talk('ru/first', { event: '10', time: '19:10', title: 'Первый' }),
      talk('ru/second', { event: '10', time: '20:15', title: 'Второй' }),
    ];
    expect(scheduleOf(withBreaks, talks).map((item) => [item.kind, item.title])).toEqual([
      ['talk', 'Первый'],
      ['activity', 'АКТИВНОСТЬ'],
      ['break', 'ПЕРЕРЫВ'],
      ['talk', 'Второй'],
      ['talk', 'Третий'],
    ]);
  });
});

describe('upcomingEvent / pastEvents', () => {
  it('идущий митап (меньше EVENT_DURATION_MS после начала) ещё не прошедший', () => {
    const live = event('ru/31');
    const start = live.data.date.getTime();
    expect(upcomingEvent([live], new Date(start + 60 * 60 * 1000))).toEqual({ event: live, past: false });
    expect(pastEvents([live], new Date(start + 60 * 60 * 1000))).toEqual([]);
    expect(upcomingEvent([live], new Date(start + EVENT_DURATION_MS + 1))?.past).toBe(true);
  });

  const e10 = event('ru/10', { date: new Date('2024-03-14T15:00:00Z') });
  const e15 = event('ru/15', { date: new Date('2025-02-20T15:00:00Z') });
  const e20 = event('ru/20', { date: new Date('2026-06-01T15:00:00Z') });
  const e25 = event('ru/25', { date: new Date('2026-09-01T15:00:00Z') });
  const draft = event('ru/26', { date: new Date('2026-08-01T15:00:00Z'), draft: true });

  it('будущих нет: последний прошедший с past: true', () => {
    const result = upcomingEvent([e15, e10, e20], new Date('2027-01-01T00:00:00Z'));
    expect(result?.event.id).toBe('ru/20');
    expect(result?.past).toBe(true);
  });

  it('два будущих: ближайший, без past', () => {
    const result = upcomingEvent([e25, e20, e10], new Date('2026-05-01T00:00:00Z'));
    expect(result?.event.id).toBe('ru/20');
    expect(result?.past).toBe(false);
  });

  it('митап ровно в момент now считается предстоящим', () => {
    const result = upcomingEvent([e10, e15], e15.data.date);
    expect(result).toEqual({ event: e15, past: false });
  });

  it('черновики исключены', () => {
    expect(upcomingEvent([draft, e25], new Date('2026-07-01T00:00:00Z'))?.event.id).toBe('ru/25');
    expect(upcomingEvent([draft], new Date('2026-07-01T00:00:00Z'))).toBeUndefined();
  });

  it('пустой список: undefined', () => {
    expect(upcomingEvent([], new Date('2026-07-01T00:00:00Z'))).toBeUndefined();
  });

  it('pastEvents: прошедшие, новые выше, без черновиков и будущих', () => {
    const past = pastEvents([e10, e25, draft, e20, e15], new Date('2026-07-01T00:00:00Z'));
    expect(past.map((e) => e.id)).toEqual(['ru/20', 'ru/15', 'ru/10']);
  });
});
