import { themeColors } from '@moscowcss/design-system/theme-colors';
import sharp from 'sharp';
import { LOGO_PATH, LOGO_VIEWBOX } from './logo';

// Иконки сайта из знака MoscowCSS в красном бренда — том же цвете, что у звезды в Hero.
export const ICON_COLOR = themeColors.focus;
export const ICON_BACKGROUND = themeColors.background;

const { width, height } = LOGO_VIEWBOX;
const side = Math.max(width, height);
const boxOf = (padding: number): number => side / (1 - 2 * padding);

/**
 * SVG-иконка: знак в квадрате. `padding` — поле с каждой стороны в долях стороны: на
 * apple-touch и в манифесте система сама скругляет углы и срезала бы края звезды.
 */
export function iconSvg({ background, padding = 0 }: { background?: string; padding?: number } = {}): string {
  const box = boxOf(padding);
  const x = (width - box) / 2;
  const y = (height - box) / 2;
  const view = `${String(x)} ${String(y)} ${String(box)} ${String(box)}`;
  const fill = background
    ? `<rect x="${String(x)}" y="${String(y)}" width="${String(box)}" height="${String(box)}" fill="${background}"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}">${fill}<path d="${LOGO_PATH}" fill="${ICON_COLOR}" stroke="${ICON_COLOR}"/></svg>`;
}

/** PNG-иконка size×size: SVG растрируется сразу в нужном размере, без размытия от масштабирования. */
export function renderIcon(size: number, options: { background?: string; padding?: number } = {}): Promise<Buffer> {
  const svg = Buffer.from(iconSvg(options));
  // density — DPI растеризации: при 72 SVG рисуется 1:1 по viewBox, поэтому 72 · size / ширина.
  return sharp(svg, { density: (72 * size) / boxOf(options.padding ?? 0) })
    .resize(size, size)
    .png()
    .toBuffer();
}

/**
 * favicon.ico с PNG внутри (так умеет формат с Windows Vista и все браузеры): sharp ICO не
 * пишет, а /favicon.ico запрашивают сами браузеры и поисковики, даже без ссылки в <head>.
 */
export function toIco(images: readonly { size: number; png: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    // 256 и больше записывается нулём: в байт размер не помещается.
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
}
