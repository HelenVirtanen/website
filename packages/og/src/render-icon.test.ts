import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { ICON_COLOR, iconSvg, renderIcon, toIco } from './render-icon';

describe('iconSvg', () => {
  it('квадратный viewBox и знак в красном бренда', () => {
    const svg = iconSvg();
    const [, , w, h] = /viewBox="([^"]+)"/.exec(svg)?.[1]?.split(' ').map(Number) ?? [];
    expect(w).toBe(h);
    expect(svg).toContain(`fill="${ICON_COLOR}"`);
    expect(svg).not.toContain('<rect');
  });

  it('фон и поле: квадрат больше знака', () => {
    const svg = iconSvg({ background: '#FFFFFF', padding: 0.125 });
    expect(svg).toContain('<rect');
    expect(/viewBox="[^ ]+ [^ ]+ ([^ ]+)/.exec(svg)?.[1]).toBe(String(80 / 0.75));
  });
});

describe('renderIcon', () => {
  it('PNG нужного размера, без фона углы прозрачны, с фоном — залиты', async () => {
    const plain = await sharp(await renderIcon(64)).raw().toBuffer({ resolveWithObject: true });
    expect(plain.info).toMatchObject({ width: 64, height: 64, channels: 4 });
    expect(plain.data[3]).toBe(0);

    const filled = await sharp(await renderIcon(180, { background: '#FFFFFF', padding: 0.125 }))
      .raw()
      .toBuffer({ resolveWithObject: true });
    expect([...filled.data.subarray(0, 4)]).toEqual([255, 255, 255, 255]);
  });

  it('центр иконки — красный знак', async () => {
    const { data, info } = await sharp(await renderIcon(64)).raw().toBuffer({ resolveWithObject: true });
    const center = (32 * info.width + 32) * 4;
    expect([...data.subarray(center, center + 3)]).toEqual([0xca, 0x30, 0x35]);
  });
});

describe('toIco', () => {
  it('заголовок ICO и записи с размерами и смещениями PNG', async () => {
    const images = await Promise.all([16, 32].map(async (size) => ({ size, png: await renderIcon(size) })));
    const ico = toIco(images);
    expect([ico.readUInt16LE(0), ico.readUInt16LE(2), ico.readUInt16LE(4)]).toEqual([0, 1, 2]);
    expect([ico[6], ico[22]]).toEqual([16, 32]);
    const second = ico.readUInt32LE(22 + 12);
    expect(ico.subarray(second, second + 4).toString('latin1')).toBe('\x89PNG');
    expect(ico.length).toBe(6 + 32 + images[0]!.png.length + images[1]!.png.length);
  });
});
