import { dirname, resolve } from 'node:path';
import type { TalkEntry } from './catalog';

// Обложка доклада — карточка анонса из Telegram (спека 007, продолжение). На странице доклада
// она стоит под заголовком; широкая обложка заменяет и сгенерированную OG-карточку.

/** Адрес общей заглушки для доклада без обложки: одна картинка на оба языка. */
export const TBD_COVER_PATH = '/covers/tbd.png';

/** Не уже этого обложка годится в OG 1200×630: обрезка по центру съест не больше нескольких процентов. */
export const MIN_OG_ASPECT = 1.6;

export const isWide = (size: { width: number; height: number }): boolean => size.width / size.height >= MIN_OG_ASPECT;

const COVER_LINE = /^cover:\s*["']?([^"'\n]+?)["']?\s*$/m;

/**
 * Путь файла обложки на диске. После схемы `cover` — метаданные картинки без пути к исходнику,
 * поэтому путь берётся из frontmatter и разрешается от файла доклада, как его разрешает Astro.
 */
export function coverFileOf(talk: Pick<TalkEntry, 'filePath'>, readSource: (path: string) => string): string | undefined {
  if (!talk.filePath) return undefined;
  const written = COVER_LINE.exec(readSource(talk.filePath))?.[1];
  return written === undefined ? undefined : resolve(dirname(resolve(talk.filePath)), written);
}
