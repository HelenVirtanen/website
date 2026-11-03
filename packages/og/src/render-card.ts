import { themeColors } from '@moscowcss/design-system/theme-colors';
import { FONT_FAMILY } from './fonts';
import { box, logo, renderPng, type Node } from './nodes';

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

function card({ title, kicker, meta, size }: CardInput): Node {
  const { width, height } = CARD_SIZES[size];
  const text = { display: 'flex', fontFamily: FONT_FAMILY, color: colors.text } as const;

  const brand = box({ display: 'flex', alignItems: 'center', gap: 20 }, [
    logo(LOGO_HEIGHT, colors.text),
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
export function renderCard(input: CardInput): Promise<Buffer> {
  const { width, height } = CARD_SIZES[input.size];
  return renderPng(card(input), width, height);
}
