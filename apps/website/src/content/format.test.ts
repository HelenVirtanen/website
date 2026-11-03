import { describe, expect, it } from 'vitest';
import { eventDateParts, eventWhen, fillTemplate, venueLine } from './format';

describe('eventDateParts', () => {
  const date = new Date('2026-07-09T18:00:00+03:00');

  it('ru: день с месяцем, год и время по Москве', () => {
    expect(eventDateParts(date, 'ru')).toEqual({ day: '9 июля', year: '2026', time: '18:00' });
  });

  it('en: тот же момент, английский месяц', () => {
    expect(eventDateParts(date, 'en')).toEqual({ day: 'July 9', year: '2026', time: '18:00' });
  });

  it('время не зависит от пояса сборки: 15:00 UTC — это 18:00 в Москве', () => {
    expect(eventDateParts(new Date('2026-07-09T15:00:00Z'), 'ru').time).toBe('18:00');
  });

  it('граница суток: полночь по Москве — 00:00, а не 24:00', () => {
    const parts = eventDateParts(new Date('2026-07-09T21:00:00Z'), 'ru');
    expect(parts).toEqual({ day: '10 июля', year: '2026', time: '00:00' });
  });

  it('некорректная дата — ошибка', () => {
    expect(() => eventDateParts(new Date('нет'), 'ru')).toThrow(RangeError);
  });
});

describe('fillTemplate', () => {
  it('подставляет значения', () => {
    expect(fillTemplate('{day} {year} в {time}', { day: '9 июля', year: '2026', time: '18:00' })).toBe(
      '9 июля 2026 в 18:00',
    );
  });

  it('шаблон без плейсхолдеров возвращается как есть', () => {
    expect(fillTemplate('Регистрация', {})).toBe('Регистрация');
  });

  it('неизвестное имя — ошибка с названием шаблона', () => {
    expect(() => fillTemplate('Адрес: {address}', {})).toThrow(/address/);
  });
});

describe('eventWhen', () => {
  const templates = { withTime: '{day} {year} в {time}', dateOnly: '{day} {year}' };

  it('есть время — дата и время', () => {
    expect(eventWhen({ date: new Date('2026-07-09T18:00:00+03:00'), time: '18:00' }, 'ru', templates)).toBe(
      '9 июля 2026 в 18:00',
    );
  });

  it('времени нет — только дата, без полуночи', () => {
    expect(eventWhen({ date: new Date('2017-03-02T00:00:00+03:00') }, 'ru', templates)).toBe('2 марта 2017');
  });
});

describe('venueLine', () => {
  it('площадка и адрес через запятую, без адреса — только площадка', () => {
    expect(venueLine({ name: 'Звук', address: 'Москва' })).toBe('Звук, Москва');
    expect(venueLine({ name: 'Яндекс' })).toBe('Яндекс');
  });
});
