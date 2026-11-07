import { getImage } from 'astro:assets';
import type { TalkEntry } from './catalog';
import { talkCoverPath } from './talk-cover';

export interface CoverImage {
  src: string;
  width: number;
  height: number;
}

/** Обложка доклада для страницы и карточки: оптимизированная карточка анонса или сгенерированная обложка. */
export async function talkCoverImage(talk: Pick<TalkEntry, 'id' | 'data'>, width = 1200): Promise<CoverImage> {
  const { cover } = talk.data;
  if (!cover) return { src: talkCoverPath(talk), width: 1200, height: 630 };
  const optimized = await getImage({ src: cover, width: Math.min(width, cover.width), format: 'webp' });
  return {
    src: optimized.src,
    width: Number(optimized.attributes['width'] ?? cover.width),
    height: Number(optimized.attributes['height'] ?? cover.height),
  };
}
