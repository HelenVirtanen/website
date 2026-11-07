import { describe, expect, it } from 'vitest';
import { stickerLook } from './look';

describe('stickerLook', () => {
  it('один и тот же слаг всегда даёт один вид', () => {
    expect(stickerLook('anna-lapa', 5, 4)).toEqual(stickerLook('anna-lapa', 5, 4));
  });

  it('вид не выходит за число классов', () => {
    for (const seed of ['a', 'anna-lapa', 'aleksandr-litvin', '31', 'очень-длинный-слаг']) {
      const { tone, tilt } = stickerLook(seed, 5, 4);
      expect(tone).toBeGreaterThanOrEqual(0);
      expect(tone).toBeLessThan(5);
      expect(tilt).toBeGreaterThanOrEqual(0);
      expect(tilt).toBeLessThan(4);
    }
  });

  it('разные слаги дают разные цвета', () => {
    const seeds = ['anna', 'boris', 'vera', 'gleb', 'daria', 'egor', 'zhanna', 'ilya', 'kira', 'lev'];
    expect(new Set(seeds.map((seed) => stickerLook(seed, 5, 4).tone)).size).toBeGreaterThan(1);
  });
});
