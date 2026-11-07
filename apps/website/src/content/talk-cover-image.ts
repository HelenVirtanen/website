import { getImage } from 'astro:assets';
import type { TalkEntry } from './catalog';
import { TBD_COVER_PATH } from './talk-cover';

export interface CoverImage {
  src: string;
  width: number;
  height: number;
}

/** Обложка доклада для страницы и карточки: оптимизированная картинка анонса или общая заглушка TBD. */
export async function talkCoverImage(talk: Pick<TalkEntry, 'data'>, width = 1200): Promise<CoverImage> {
  const { cover } = talk.data;
  if (!cover) return { src: TBD_COVER_PATH, width: 1200, height: 630 };
  const optimized = await getImage({ src: cover, width: Math.min(width, cover.width), format: 'webp' });
  return {
    src: optimized.src,
    width: Number(optimized.attributes['width'] ?? cover.width),
    height: Number(optimized.attributes['height'] ?? cover.height),
  };
}
