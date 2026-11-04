import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { darkThemeColors } from '@moscowcss/design-system/theme-colors';
import { CARD_SIZES, renderCard, type CardInput } from './render-card';

const base: Omit<CardInput, 'size'> = {
  title: 'Anchor positioning и popover на практике',
  kicker: 'Митап № 31',
  meta: '9 июля 2026, 18:00 · Звук',
};

const hexToRgb = (hex: string) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

describe('renderCard', () => {
  it.each([
    ['og', 1200, 630],
    ['twitter', 1200, 600],
  ] as const)('%s: PNG %i×%i', async (size, width, height) => {
    const png = await renderCard({ ...base, size });
    const info = await sharp(png).metadata();
    expect(info.format).toBe('png');
    expect([info.width, info.height]).toEqual([width, height]);
    expect(CARD_SIZES[size]).toEqual({ width, height });
  });

  it('рисует кириллицу и латиницу: текст меняет картинку', async () => {
    const empty = await renderCard({ title: ' ', kicker: ' ', meta: ' ', size: 'og' });
    const full = await renderCard({ ...base, size: 'og' });
    expect(full.equals(empty)).toBe(false);
    const ru = await renderCard({ ...base, title: 'Привет, мир', size: 'og' });
    const en = await renderCard({ ...base, title: 'Hello, world', size: 'og' });
    expect(ru.equals(en)).toBe(false);
  });

  it('фон — графитовый background тёмной темы', async () => {
    const png = await renderCard({ ...base, size: 'og' });
    const { data } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    expect([...data.subarray(0, 3)]).toEqual(hexToRgb(darkThemeColors.background));
  });

  it('очень длинный заголовок не бросает и не меняет размер', async () => {
    const png = await renderCard({
      ...base,
      title: 'Очень длинное название доклада без пробелов '.repeat(20) + 'x'.repeat(200),
      meta: 'Очень длинная строка о месте '.repeat(10),
      size: 'twitter',
    });
    const info = await sharp(png).metadata();
    expect([info.width, info.height]).toEqual([1200, 600]);
  });
});
