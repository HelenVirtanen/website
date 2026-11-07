import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { TALK_COVER_SIZE, coverText, labelFontSize, renderTalkCover, titleFontSize } from './render-talk-cover';

describe('titleFontSize', () => {
  it('чем длиннее название, тем мельче кегль', () => {
    expect(titleFontSize('Рендеринг шрифтов в веб')).toBe(46);
    expect(titleFontSize('Нажми кнопку, если сможешь: AI-агенты')).toBe(38);
    expect(titleFontSize('Нажми кнопку, если сможешь: 10 интерфейсов против AI-агентов')).toBe(32);
    expect(titleFontSize('x '.repeat(60))).toBe(28);
  });

  it('длинное слово уменьшает кегль, чтобы влезть в строку', () => {
    expect(titleFontSize('Недокументированные приемы CSS')).toBeLessThan(46);
    expect(titleFontSize('Недокументированные приемы CSS') * 19 * 0.66).toBeLessThanOrEqual(452);
  });
});

describe('coverText', () => {
  it('убирает эмодзи и лишние пробелы, кириллицу и знаки оставляет', () => {
    expect(coverText('Менторы-Дементоры 🧙‍♂️ и GPT ⚡️')).toBe('Менторы-Дементоры и GPT');
    expect(coverText('CSS: «как» — 100%')).toBe('CSS: «как» — 100%');
  });
});

describe('labelFontSize', () => {
  it('длинная метка мельче', () => {
    expect(labelFontSize('MOSCOWCSS_7')).toBeGreaterThan(labelFontSize('MOSCOWCSS_ONLINE'));
  });
});

describe('renderTalkCover', () => {
  const photo = () =>
    sharp({ create: { width: 400, height: 500, channels: 3, background: '#c86432' } }).jpeg().toBuffer();

  it(`PNG ${String(TALK_COVER_SIZE.width)}×${String(TALK_COVER_SIZE.height)}, фото справа становится чёрно-белым`, async () => {
    const png = await renderTalkCover({ label: 'MOSCOWCSS_7', title: 'Рендеринг шрифтов в веб', speakers: 'Андрей Яманов', photo: await photo() });
    const info = await sharp(png).metadata();
    expect([info.format, info.width, info.height]).toEqual(['png', 1200, 630]);
    const { data } = await sharp(png).extract({ left: 900, top: 100, width: 1, height: 1 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    expect(data[0]).toBe(data[1]);
    expect(data[1]).toBe(data[2]);
  });

  it('без фото рисует инициалы, другой размер тоже держит', async () => {
    const png = await renderTalkCover({ label: 'MOSCOWCSS_32', title: 'Доклад', speakers: 'Дарья Егорова', size: { width: 1200, height: 600 } });
    const info = await sharp(png).metadata();
    expect([info.width, info.height]).toEqual([1200, 600]);
  });
});
