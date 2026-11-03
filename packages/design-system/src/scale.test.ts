import { describe, expect, it } from 'vitest';
import { media } from './breakpoints';
import { baseValues, layoutSpace, mediaOverrides, remToPx, resolveAt, space, typeScale, type Steps } from './scale';

describe('resolveAt', () => {
  it('берёт базу ниже первого порога и ступень на самом пороге', () => {
    const h1 = typeScale.h1;
    expect(resolveAt(h1, 767)).toBe('2rem');
    expect(resolveAt(h1, 768)).toBe('2.25rem');
    expect(resolveAt(h1, 1023)).toBe('2.25rem');
    expect(resolveAt(h1, 1024)).toBe('2.75rem');
  });

  it('переключает layout-лестницу ровно на порогах 1279/1280 и 1919/1920', () => {
    expect(resolveAt(layoutSpace.inset.l, 1279)).toBe('1rem');
    expect(resolveAt(layoutSpace.inset.l, 1280)).toBe('1.5rem');
    expect(resolveAt(layoutSpace.gap.xxl, 1919)).toBe('2rem');
    expect(resolveAt(layoutSpace.gap.xxl, 1920)).toBe('2.5rem');
  });

  it('держит значение последней ступени, пока нет следующей', () => {
    expect(resolveAt(layoutSpace.inset.m, 1920)).toBe('1rem');
    expect(resolveAt(typeScale.h1, 1280)).toBe('3.25rem');
    expect(resolveAt(typeScale.h1, 1920)).toBe('3.25rem');
  });

  it('постоянное значение (строка) не зависит от ширины', () => {
    expect(resolveAt(space.l, 375)).toBe('1rem');
    expect(resolveAt(space.l, 3840)).toBe('1rem');
  });

  it('бросает на неположительной или нечисловой ширине', () => {
    expect(() => resolveAt(typeScale.h1, 0)).toThrow(RangeError);
    expect(() => resolveAt(typeScale.h1, Number.NaN)).toThrow(RangeError);
  });
});

describe('remToPx', () => {
  it('переводит rem в px от кегля 16', () => {
    expect(remToPx('1.5rem')).toBe(24);
    expect(remToPx('80rem')).toBe(1280);
  });

  it('бросает на не-rem', () => {
    expect(() => remToPx('24pt')).toThrow(TypeError);
    expect(() => remToPx('1em')).toThrow(TypeError);
    expect(() => remToPx('rem')).toThrow(TypeError);
  });
});

describe('mediaOverrides', () => {
  const names = { a: '--a', b: '--b' };

  it('выводит только ступени, где есть переопределения, в порядке роста порога', () => {
    const result = mediaOverrides(names, {
      a: { base: '1rem', desktop: '2rem' },
      b: { base: '1rem', laptop: '3rem' },
    });
    expect(Object.keys(result)).toEqual([media.laptop, media.desktop]);
    expect(result[media.laptop]).toEqual({ vars: { '--b': '3rem' } });
    expect(result[media.desktop]).toEqual({ vars: { '--a': '2rem' } });
  });

  it('не выводит ничего для таблицы без ступеней', () => {
    expect(mediaOverrides(names, { a: { base: '1rem' }, b: { base: '2rem' } })).toEqual({});
  });
});

describe('значения шкалы', () => {
  it('все значения таблиц записаны в rem', () => {
    const values = [
      ...Object.values(space),
      ...Object.values(typeScale).flatMap((steps) => Object.values(steps)),
      ...Object.values(layoutSpace).flatMap((group) =>
        Object.values(group).flatMap((steps) => Object.values(steps)),
      ),
    ];
    for (const value of values) expect(() => remToPx(value)).not.toThrow();
  });

  it('каскад медиазапросов из mediaOverrides даёт на каждой ширине то же, что resolveAt', () => {
    const tables: Record<string, Readonly<Record<string, Steps>>> = {
      typeScale,
      inset: layoutSpace.inset,
      gap: layoutSpace.gap,
    };
    for (const table of Object.values(tables)) {
      const names = Object.fromEntries(Object.keys(table).map((key) => [key, `--${key}`]));
      const base = baseValues(table);
      const overrides = mediaOverrides(names, table);
      for (const width of [375, 767, 768, 1023, 1024, 1279, 1280, 1919, 1920, 3840]) {
        // Браузер применяет подходящие запросы в порядке вывода: поздний перебивает ранний.
        const applied: Record<string, string> = Object.fromEntries(
          Object.keys(table).map((key) => [names[key], base[key]]),
        );
        for (const [query, { vars }] of Object.entries(overrides)) {
          const minRem = /min-width: ([\d.]+rem)/.exec(query)?.[1];
          if (minRem !== undefined && width >= remToPx(minRem)) Object.assign(applied, vars);
        }
        for (const [key, steps] of Object.entries(table)) {
          expect(applied[names[key]], `${key} @ ${width}px`).toBe(resolveAt(steps, width));
        }
      }
    }
  });
});
