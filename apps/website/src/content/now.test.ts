import { describe, expect, it } from 'vitest';
import { buildNow } from './now';

describe('buildNow', () => {
  it('без BUILD_NOW — текущее время', () => {
    const before = Date.now();
    const now = buildNow({}).getTime();
    expect(now).toBeGreaterThanOrEqual(before);
    expect(now).toBeLessThanOrEqual(Date.now());
  });

  it('пустой BUILD_NOW считается незаданным', () => {
    expect(Math.abs(buildNow({ BUILD_NOW: '' }).getTime() - Date.now())).toBeLessThan(1000);
  });

  it('BUILD_NOW фиксирует момент', () => {
    expect(buildNow({ BUILD_NOW: '2026-07-01' }).toISOString()).toBe('2026-07-01T00:00:00.000Z');
  });

  it('не дата — ошибка с подсказкой', () => {
    expect(() => buildNow({ BUILD_NOW: 'вчера' })).toThrow(/BUILD_NOW="вчера"/);
  });
});
