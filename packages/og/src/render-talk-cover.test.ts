import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { TALK_COVER_SIZE, coverText, renderTalkCover, titleFontSize } from './render-talk-cover';

describe('titleFontSize', () => {
  it('чем длиннее название, тем мельче кегль', () => {
    const short = titleFontSize('Рендеринг шрифтов в веб');
    const long = titleFontSize('Дизайн без дизайнера: базовые принципы, которые помогут разработчику собрать сайт, не убивающий конверсию');
    expect(short).toBeGreaterThan(long);
    expect(long).toBeGreaterThanOrEqual(30);
  });

  it('длинное слово уменьшает кегль', () => {
    expect(titleFontSize('Недокументированные приемы CSS')).toBeLessThan(titleFontSize('Приемы CSS'));
  });
});

describe('coverText', () => {
  it('убирает эмодзи и лишние пробелы, кириллицу и знаки оставляет', () => {
    expect(coverText('Менторы-Дементоры 🧙‍♂️ и GPT ⚡️')).toBe('Менторы-Дементоры и GPT');
    expect(coverText('CSS: «как» — 100%')).toBe('CSS: «как» — 100%');
  });
});

describe('renderTalkCover', () => {
  const photo = () =>
    sharp({ create: { width: 400, height: 500, channels: 3, background: '#c86432' } }).jpeg().toBuffer();

  it(`PNG ${String(TALK_COVER_SIZE.width)}×${String(TALK_COVER_SIZE.height)}, цвет фото сохраняется`, async () => {
    const png = await renderTalkCover({ label: 'MOSCOWCSS_7', title: 'Рендеринг шрифтов в веб', speakers: 'Андрей Яманов', photo: await photo() });
    const info = await sharp(png).metadata();
    expect([info.format, info.width, info.height]).toEqual(['png', 1200, 630]);
    const { data } = await sharp(png).extract({ left: 900, top: 100, width: 1, height: 1 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    expect(data[0] ?? 0).toBeGreaterThan(data[2] ?? 0);
  });

  it('без фото рисует TBD, другой размер тоже держит', async () => {
    const png = await renderTalkCover({ label: 'MOSCOWCSS_32', title: 'Доклад', speakers: 'Дарья Егорова', size: { width: 1200, height: 600 } });
    const info = await sharp(png).metadata();
    expect([info.width, info.height]).toEqual([1200, 600]);
  });
});
