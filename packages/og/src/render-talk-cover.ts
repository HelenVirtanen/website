import sharp from 'sharp';
import { themeColors } from '@moscowcss/design-system/theme-colors';
import { FONT_FAMILY } from './fonts';
import { initialsOf } from './render-avatar';
import { box, logo, node, renderPng, type Node } from './nodes';
import { LOGO_PATH, LOGO_VIEWBOX } from './logo';

/** Обложка доклада по образцу карточек анонсов в канале: 1200×630, как у OpenGraph. */
export const TALK_COVER_SIZE = { width: 1200, height: 630 } as const;

export interface TalkCoverInput {
  /** Метка митапа крупно наверху: `MOSCOWCSS_7` */
  label: string;
  /** Название доклада */
  title: string;
  /** Спикеры через запятую */
  speakers: string;
  /** Фото первого спикера; без него справа крупные инициалы */
  photo?: Buffer | undefined;
  /** Размер картинки; по умолчанию TALK_COVER_SIZE */
  size?: { width: number; height: number };
}

const colors = themeColors;
// Белая половина чуть уже фото: так в образце из канала.
const TEXT_SHARE = 0.485;
const PAD = 64;

/** Кегль метки: длинная (`MOSCOWCSS_ONLINE`) мельче, чтобы не залезть на фото. */
export function labelFontSize(label: string): number {
  return [...label].length <= 12 ? 44 : 32;
}

// Ширина колонки текста и ширина буквы Montserrat Bold в долях кегля с запасом: перенос посреди слова хуже мелкого кегля.
const TEXT_WIDTH = Math.round(TALK_COVER_SIZE.width * TEXT_SHARE) - PAD * 2;
const CHAR_WIDTH = 0.8;

/** Кегль названия: короткое крупно, длинное мельче; самое длинное слово целиком влезает в строку. */
export function titleFontSize(title: string): number {
  const length = [...title].length;
  const byLength = length <= 30 ? 46 : length <= 55 ? 38 : length <= 85 ? 32 : 28;
  const longest = Math.max(...title.split(/\s+/).map((word) => [...word].length));
  const byWord = Math.floor(TEXT_WIDTH / (longest * CHAR_WIDTH));
  return Math.max(28, Math.min(byLength, byWord));
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
    children: [node('path', { d: LOGO_PATH, fill: 'none', stroke: color, strokeWidth: 1.6 })],
  });
}

async function photoNode(photo: Buffer, width: number, height: number): Promise<Node> {
  // Чёрно-белое фото, кадр по самому заметному месту: обычно это лицо.
  const jpeg = await sharp(photo)
    .grayscale()
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

/** Рисует PNG-обложку доклада: метка митапа и название на белом, чёрно-белое фото спикера и звезда. */
export async function renderTalkCover(input: TalkCoverInput): Promise<Buffer> {
  const { width, height } = input.size ?? TALK_COVER_SIZE;
  const left = Math.round(width * TEXT_SHARE);
  const right = width - left;
  const text = { display: 'flex', fontFamily: FONT_FAMILY, color: colors.surfaceDarkMuted } as const;
  const title = coverText(input.title);

  const picture = input.photo
    ? await photoNode(input.photo, right, height)
    : box(
        { ...text, position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', fontSize: 200, fontWeight: 700, color: colors.surfaceDarkMuted },
        initialsOf(input.speakers),
      );

  const root = box(
    { display: 'flex', width, height, backgroundColor: colors.white },
    [
      box(
        // satori прибавляет поля к размеру, поэтому ширина и высота заданы уже без них.
        { display: 'flex', flexShrink: 0, flexDirection: 'column', justifyContent: 'space-between', width: left - PAD * 2, height: height - PAD * 2, margin: PAD },
        [
          box({ display: 'flex', alignItems: 'center', gap: 22 }, [
            logo(44, colors.brand),
            box({ ...text, fontSize: labelFontSize(input.label), fontWeight: 700, letterSpacing: '0.01em' }, input.label),
          ]),
          box({ display: 'flex', flexDirection: 'column', gap: 14 }, [
            box({ ...text, fontSize: titleFontSize(title), fontWeight: 700, lineHeight: 1.18, wordBreak: 'break-word' }, title),
            box({ ...text, fontSize: 30, fontWeight: 600, lineHeight: 1.25, wordBreak: 'break-word' }, coverText(input.speakers)),
          ]),
        ],
      ),
      box({ display: 'flex', flexShrink: 0, position: 'relative', width: right, height, overflow: 'hidden', backgroundColor: colors.blackBg }, [
        picture,
        // Звезда в углу, как на карточках анонсов: серая заливка и красный контур со сдвигом.
        logo(250, colors.divider, { position: 'absolute', right: -40, bottom: -50 }),
        outlineStar(250, colors.brand, { position: 'absolute', right: 10, bottom: -20 }),
      ]),
    ],
  );
  return renderPng(root, width, height);
}
