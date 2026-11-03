// Брейкпоинты — константы времени сборки, а не CSS-переменные: медиа-запросы
// не читают var(). `media` — готовые строки медиа-запросов для `@media` в .css.ts:
// `'@media': { [media.laptop]: { ... } }`.
export const breakpoints = {
  mobile: '48rem', // 768px
  tablet: '48rem', // 768px
  laptop: '64rem', // 1024px
  desktop: '80rem', // 1280px
  desktopLarge: '120rem', // 1920px
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const media = {
  mobile: 'screen and (max-width: 47.9375rem)',
  tablet: 'screen and (min-width: 48rem)',
  laptop: 'screen and (min-width: 64rem)',
  desktop: 'screen and (min-width: 80rem)',
  desktopLarge: 'screen and (min-width: 120rem)',
} as const;
