import sharp from 'sharp';
import { themeColors } from '@moscowcss/design-system/theme-colors';
import { FONT_FAMILY } from './fonts';
import { box, logo, node, renderPng, type Node } from './nodes';
import { LOGO_PATH, LOGO_VIEWBOX } from './logo';

/** Обложка доклада, одна на все доклады: 1200×630, как у OpenGraph. */
export const TALK_COVER_SIZE = { width: 1200, height: 630 } as const;

export interface TalkCoverInput {
  /** Метка митапа внизу: `MOSCOWCSS_30` */
  label: string;
  /** Название доклада */
  title: string;
  /** Спикеры через запятую */
  speakers: string;
  /** Фото первого спикера; без него на месте фото — TBD */
  photo?: Buffer | undefined;
  /** Размер картинки; по умолчанию TALK_COVER_SIZE */
  size?: { width: number; height: number };
}

const colors = themeColors;
// Текст слева занимает чуть больше половины, как на карточке «Дизайн без дизайнера».
const TEXT_SHARE = 0.6;
const PAD_X = 72;
const PAD_Y = 64;
const STAR = 46;
// Название переливается от фирменного красного к тёмно-коричневому, как в образце.
const TITLE_DARK = '#5B2B27';
const TITLE_GRADIENT = `linear-gradient(180deg, ${colors.brand} 0%, ${TITLE_DARK} 100%)`;

// Ширина колонки названия и ширина буквы Montserrat Bold в долях кегля с запасом: перенос посреди слова хуже мелкого кегля.
const TEXT_WIDTH = Math.round(TALK_COVER_SIZE.width * TEXT_SHARE) - PAD_X * 2 - STAR - 18;
const CHAR_WIDTH = 0.8;

/** Кегль названия: короткое крупно, длинное мельче; самое длинное слово целиком влезает в строку. */
export function titleFontSize(title: string): number {
  const length = [...title].length;
  const byLength = length <= 30 ? 54 : length <= 60 ? 46 : length <= 95 ? 38 : 32;
  const longest = Math.max(...title.split(/\s+/).map((word) => [...word].length));
  const byWord = Math.floor(TEXT_WIDTH / (longest * CHAR_WIDTH));
  return Math.max(30, Math.min(byLength, byWord));
}

/** Без эмодзи: в Montserrat их нет, и satori нарисовал бы вместо них пустые квадраты. */
export function coverText(text: string): string {
  return text.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').replace(/\s{2,}/g, ' ').trim();
}

function outlineStar(height: number, color: string, style: Record<string, unknown>): Node {
  const width = (height * LOGO_VIEWBOX.width) / LOGO_VIEWBOX.height;
  return node('svg', {
    width,
    height,
    viewBox: `-2 -2 ${String(LOGO_VIEWBOX.width + 4)} ${String(LOGO_VIEWBOX.height + 4)}`,
    fill: 'none',
    style,
    children: [node('path', { d: LOGO_PATH, fill: 'none', stroke: color, strokeWidth: 1.4 })],
  });
}

async function photoNode(photo: Buffer, width: number, height: number): Promise<Node> {
  // Кадр по самому заметному месту — обычно это лицо. Цвет фото сохраняется.
  const jpeg = await sharp(photo)
    .rotate()
    .resize(width, height, { fit: 'cover', position: sharp.strategy.attention })
    .jpeg({ quality: 88 })
    .toBuffer();
  return node('img', {
    src: `data:image/jpeg;base64,${jpeg.toString('base64')}`,
    width,
    height,
    style: { position: 'absolute', top: 0, left: 0, width, height, objectFit: 'cover' },
  });
}

/** Рисует PNG-обложку доклада: название градиентом, спикер и метка митапа слева, фото спикера и звёзды справа. */
export async function renderTalkCover(input: TalkCoverInput): Promise<Buffer> {
  const { width, height } = input.size ?? TALK_COVER_SIZE;
  const left = Math.round(width * TEXT_SHARE);
  const right = width - left;
  const title = coverText(input.title);
  const font = { display: 'flex', fontFamily: FONT_FAMILY } as const;

  const picture = input.photo
    ? await photoNode(input.photo, right, height)
    : box(
        {
          ...font,
          position: 'absolute',
          top: 0,
          left: 0,
          width: right,
          height,
          alignItems: 'center',
          justifyContent: 'center',
          // Чуть выше центра: внизу справа лежат звёзды.
          paddingBottom: 160,
          backgroundColor: colors.surfaceDarkMuted,
          color: colors.white,
          fontSize: 120,
          fontWeight: 700,
          letterSpacing: '0.04em',
        },
        'TBD',
      );

  const root = box({ display: 'flex', width, height, backgroundColor: colors.white }, [
    // satori прибавляет поля к размеру, поэтому колонка задана размерами без полей и внешним отступом.
    box(
      {
        display: 'flex',
        flexShrink: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 40,
        width: left - PAD_X * 2,
        height: height - PAD_Y * 2,
        margin: `${String(PAD_Y)}px ${String(PAD_X)}px`,
      },
      [
        box({ display: 'flex', alignItems: 'flex-start', gap: 18 }, [
          logo(STAR, colors.brand, { flexShrink: 0, marginTop: 6 }),
          box(
            {
              ...font,
              fontSize: titleFontSize(title),
              fontWeight: 700,
              lineHeight: 1.16,
              wordBreak: 'break-word',
              // Градиент проступает через буквы только у прозрачного текста.
              color: 'transparent',
              backgroundImage: TITLE_GRADIENT,
              backgroundClip: 'text',
            },
            title,
          ),
        ]),
        box({ ...font, fontSize: 38, fontWeight: 700, lineHeight: 1.2, color: colors.surfaceDarkMuted, wordBreak: 'break-word' }, coverText(input.speakers)),
        box({ ...font, fontSize: 26, fontWeight: 700, letterSpacing: '0.02em', color: colors.surfaceDarkMuted }, input.label),
      ],
    ),
    box({ display: 'flex', flexShrink: 0, position: 'relative', width: right, height, overflow: 'hidden', backgroundColor: colors.blackBg }, [
      picture,
      // Звёзды в углу: серая заливка и красный контур со сдвигом, как на карточках анонсов.
      logo(300, colors.divider, { position: 'absolute', right: -60, bottom: -70 }),
      outlineStar(300, colors.brand, { position: 'absolute', right: 0, bottom: -30 }),
    ]),
  ]);
  return renderPng(root, width, height);
}
