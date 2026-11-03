import { ICON_BACKGROUND, iconSvg, renderIcon, toIco } from '@moscowcss/og';

// Иконки сайта: набор по «How to Favicon» (Evil Martians) — ico для старых клиентов и поисковиков,
// SVG для браузеров, PNG для iOS и манифеста. Всё рисуется на сборке из знака в packages/og.

// Поле вокруг знака там, где система сама скругляет или подрезает углы (iOS, Android).
const SAFE_PADDING = 0.125;

export interface IconFile {
  /** Имя файла в корне сайта */
  name: string;
  contentType: string;
  body: () => Promise<Buffer | string>;
}

const png = (size: number) => renderIcon(size, { background: ICON_BACKGROUND, padding: SAFE_PADDING });

/** Манифест веб-приложения: имя и иконки для «На экран Домой» на Android. */
export function manifestOf(name: string): string {
  return JSON.stringify(
    {
      name,
      short_name: name,
      icons: [192, 512].map((size) => ({
        src: `/web-app-manifest-${String(size)}x${String(size)}.png`,
        sizes: `${String(size)}x${String(size)}`,
        type: 'image/png',
      })),
      theme_color: ICON_BACKGROUND,
      background_color: ICON_BACKGROUND,
      display: 'browser',
    },
    null,
    2,
  );
}

export const iconFiles = (siteName: string): IconFile[] => [
  {
    name: 'favicon.ico',
    contentType: 'image/x-icon',
    body: async () => toIco(await Promise.all([16, 32, 48].map(async (size) => ({ size, png: await renderIcon(size) })))),
  },
  { name: 'favicon.svg', contentType: 'image/svg+xml', body: () => Promise.resolve(iconSvg()) },
  { name: 'apple-touch-icon.png', contentType: 'image/png', body: () => png(180) },
  { name: 'web-app-manifest-192x192.png', contentType: 'image/png', body: () => png(192) },
  { name: 'web-app-manifest-512x512.png', contentType: 'image/png', body: () => png(512) },
  {
    name: 'site.webmanifest',
    contentType: 'application/manifest+json',
    body: () => Promise.resolve(manifestOf(siteName)),
  },
];

