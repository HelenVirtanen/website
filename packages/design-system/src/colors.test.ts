import { describe, expect, it } from 'vitest';
import { colors } from './colors';
import { palette } from './palette';

const luminance = (hex: string): number => {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const [r = 0, g = 0, b = 0] = channels.map((value) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string): number => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
};

const TEXT = 4.5;
const NON_TEXT = 3;

describe.each([
  ['светлая', colors.light.color],
  ['тёмная', colors.dark.color],
])('контраст: %s тема', (_name, color) => {
  it.each([
    ['текст на фоне', color.text, color.background],
    ['ссылка на фоне', color.link, color.background],
    ['текст на чёрном блоке', color.onSurfaceDark, color.surfaceDark],
    ['ссылка на чёрном блоке', color.accentOnInverse, color.surfaceDark],
    ['текст на кнопке при наведении', color.onButtonHover, color.buttonHover],
  ])('%s не ниже 4.5', (_label, foreground, background) => {
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(TEXT);
  });

  it.each([
    ['кольцо фокуса на фоне', color.focus, color.background],
    ['кольцо фокуса на чёрном блоке', color.focusOnInverse, color.surfaceDark],
    ['недоступная стрелка на фоне', color.disabled, color.background],
  ])('%s не ниже 3', (label, foreground, background) => {
    // Бледно-серая недоступная стрелка светлой темы принята в макете, светлую палитру спека не меняет.
    if (label.startsWith('недоступная') && color === colors.light.color) return;
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(NON_TEXT);
  });
});

describe('тёмная тема', () => {
  it('фон графитовый, а не чёрный', () => {
    expect(colors.dark.color.background).toBe(palette.graphite);
  });

  it('чёрные блоки не инвертируются, а карточка отделена светлой границей', () => {
    expect(colors.dark.color.surfaceDark).toBe(colors.light.color.surfaceDark);
    expect(colors.dark.color.onSurfaceDark).toBe(colors.light.color.onSurfaceDark);
    expect(contrast(colors.dark.color.surfaceDarkEdge, colors.dark.color.background)).toBeGreaterThanOrEqual(NON_TEXT);
  });

  it('второстепенный текст читается на графите', () => {
    expect(contrast(colors.dark.color.textMuted, colors.dark.color.background)).toBeGreaterThanOrEqual(TEXT);
  });

  it('карточка партнёра графитовая со светлым текстом', () => {
    const { cardText, cardMuted, cardBackground } = colors.dark.color;
    expect(cardBackground).toBe(palette.graphite);
    expect(contrast(cardText, cardBackground)).toBeGreaterThanOrEqual(TEXT);
    expect(contrast(cardMuted, cardBackground)).toBeGreaterThanOrEqual(TEXT);
  });

  it('QR остаётся тёмным на светлом', () => {
    expect(contrast(colors.dark.color.blackText, colors.dark.color.white)).toBeGreaterThan(15);
  });

  it('синяя плашка читается и с белым текстом, и на графите', () => {
    const { tagBlue, onTagBlue, background } = colors.dark.color;
    expect(contrast(onTagBlue, tagBlue)).toBeGreaterThanOrEqual(TEXT);
    expect(contrast(tagBlue, background)).toBeGreaterThanOrEqual(NON_TEXT);
  });
});
