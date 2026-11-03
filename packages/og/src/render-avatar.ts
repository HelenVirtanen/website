import { themeColors } from '@moscowcss/design-system/theme-colors';
import { FONT_FAMILY } from './fonts';
import { box, logo, renderPng } from './nodes';

/** Сторона квадратного аватара: с запасом под ретину для кружка 12.5rem. */
export const AVATAR_SIZE = 480;

const colors = themeColors;

/** Инициалы: первые буквы двух первых слов имени, заглавные («Дарья Егорова» → «ДЕ»). */
export function initialsOf(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => [...word][0] ?? '');
  return letters.join('').toLocaleUpperCase() || '?';
}

/** Рисует PNG-аватар спикера без фото: инициалы на тёмном фоне бренда и звезда MoscowCSS. */
export function renderAvatar({ name }: { name: string }): Promise<Buffer> {
  const root = box(
    {
      display: 'flex',
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      backgroundColor: colors.surfaceDark,
    },
    [
      box(
        {
          display: 'flex',
          fontFamily: FONT_FAMILY,
          fontSize: 190,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: colors.onSurfaceDark,
        },
        initialsOf(name),
      ),
      // Звезда смещена в нижнюю треть: кружок аватара обрезает углы квадрата.
      logo(64, colors.onSurfaceDark, { position: 'absolute', bottom: 60, right: 96, opacity: 0.6 }),
    ],
  );
  return renderPng(root, AVATAR_SIZE, AVATAR_SIZE);
}
