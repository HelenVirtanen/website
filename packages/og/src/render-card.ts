import satori from 'satori';
import sharp from 'sharp';
import { themeColors } from '@moscowcss/design-system/theme-colors';
import { FONT_FAMILY, loadFonts } from './fonts';
import { LOGO_PATH, LOGO_VIEWBOX } from './logo';

export type CardSize = 'og' | 'twitter';

export interface CardInput {
  /** Заголовок страницы: до трёх строк, остальное обрезается */
  title: string;
  /** Подпись над заголовком: тип страницы или номер митапа */
  kicker: string;
  /** Строка под заголовком: дата и место или роль спикера */
  meta: string;
  size: CardSize;
}

// OpenGraph — 1200×630, Twitter Card summary_large_image — 2:1.
export const CARD_SIZES: Record<CardSize, { width: number; height: number }> = {
  og: { width: 1200, height: 630 },
  twitter: { width: 1200, height: 600 },
};

const colors = themeColors;
const BRAND = 'MoscowCSS';
const MARGIN = 64;
const LOGO_HEIGHT = 56;
const TITLE_LINES = 3;

// Минимальный узел: satori принимает {type, props}, React не нужен.
interface Node {
  type: string;
  props: Record<string, unknown> & { children?: Node | string | (Node | string)[] };
}

const node = (
  type: string,
  props: Record<string, unknown>,
  children?: Node['props']['children'],
): Node => ({ type, props: children === undefined ? props : { ...props, children } });

const box = (style: Record<string, unknown>, children?: Node['props']['children']): Node =>
  node('div', { style }, children);

function logo(): Node {
  const width = (LOGO_HEIGHT * LOGO_VIEWBOX.width) / LOGO_VIEWBOX.height;
  return node('svg', {
    width,
    height: LOGO_HEIGHT,
    viewBox: `0 0 ${String(LOGO_VIEWBOX.width)} ${String(LOGO_VIEWBOX.height)}`,
    fill: 'none',
    children: [node('path', { d: LOGO_PATH, fill: colors.text, stroke: colors.text })],
  });
}

function card({ title, kicker, meta, size }: CardInput): Node {
  const { width, height } = CARD_SIZES[size];
  const text = { display: 'flex', fontFamily: FONT_FAMILY, color: colors.text } as const;

  const brand = box({ display: 'flex', alignItems: 'center', gap: 20 }, [
    logo(),
    box({ ...text, fontSize: 36, fontWeight: 700 }, BRAND),
  ]);

  const body = box({ display: 'flex', flexDirection: 'column', gap: 24 }, [
    box(
      { ...text, fontSize: 32, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' },
      kicker,
    ),
    box(
      {
        ...text,
        display: 'block',
        fontSize: 64,
        fontWeight: 700,
        lineHeight: 1.15,
        lineClamp: TITLE_LINES,
        overflowWrap: 'break-word',
      },
      title,
    ),
  ]);

  const footer = box(
    {
      ...text,
      display: 'block',
      fontSize: 32,
      fontWeight: 400,
      lineClamp: 1,
      paddingTop: 24,
      borderTop: `2px solid ${colors.divider}`,
    },
    meta,
  );

  return box(
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      width,
      height,
      padding: MARGIN,
      backgroundColor: colors.background,
    },
    [brand, body, footer],
  );
}

/** Рисует PNG-карточку страницы в светлой теме дизайн-системы. */
export async function renderCard(input: CardInput): Promise<Buffer> {
  const { width, height } = CARD_SIZES[input.size];
  // satori ждёт ReactNode, но принимает и простые объекты {type, props} без React — их и строим.
  const svg = await satori(card(input) as unknown as Parameters<typeof satori>[0], {
    width,
    height,
    fonts: await loadFonts(),
    // Неподдержанный стиль не должен теряться молча: карточка уезжает с макета незаметно.
    onStyleError: (error) => {
      throw error;
    },
  });
  return sharp(Buffer.from(svg)).png().toBuffer();
}
