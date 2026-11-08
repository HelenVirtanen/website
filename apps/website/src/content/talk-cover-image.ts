import type { TalkEntry } from './catalog';
import { talkCoverPath } from './talk-cover';

export interface CoverImage {
  src: string;
  width: number;
  height: number;
}

/** Обложка доклада для страницы и карточки: у всех докладов одна, сгенерированная в едином стиле. */
export function talkCoverImage(talk: Pick<TalkEntry, 'id'>): CoverImage {
  return { src: talkCoverPath(talk), width: 1200, height: 630 };
}
