import satori from 'satori';
import sharp from 'sharp';
import { loadFonts } from './fonts';
import { LOGO_PATH, LOGO_VIEWBOX } from './logo';

// Минимальный узел: satori принимает {type, props}, React не нужен.
export interface Node {
  type: string;
  props: Record<string, unknown> & { children?: Node | string | (Node | string)[] };
}

export const node = (
  type: string,
  props: Record<string, unknown>,
  children?: Node['props']['children'],
): Node => ({ type, props: children === undefined ? props : { ...props, children } });

export const box = (style: Record<string, unknown>, children?: Node['props']['children']): Node =>
  node('div', { style }, children);

/** Звезда MoscowCSS заданной высоты и цвета. */
export function logo(height: number, color: string, style: Record<string, unknown> = {}): Node {
  const width = (height * LOGO_VIEWBOX.width) / LOGO_VIEWBOX.height;
  return node('svg', {
    width,
    height,
    viewBox: `0 0 ${String(LOGO_VIEWBOX.width)} ${String(LOGO_VIEWBOX.height)}`,
    fill: 'none',
    style,
    children: [node('path', { d: LOGO_PATH, fill: color, stroke: color })],
  });
}

/** Узел → PNG через satori и sharp. */
export async function renderPng(root: Node, width: number, height: number): Promise<Buffer> {
  // satori ждёт ReactNode, но принимает и простые объекты {type, props} без React — их и строим.
  const svg = await satori(root as unknown as Parameters<typeof satori>[0], {
    width,
    height,
    fonts: await loadFonts(),
    // Неподдержанный стиль не должен теряться молча: картинка уезжает с макета незаметно.
    onStyleError: (error) => {
      throw error;
    },
  });
  return sharp(Buffer.from(svg)).png().toBuffer();
}
