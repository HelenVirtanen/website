import { getImage } from 'astro:assets';
import { AVATAR_SIZE } from '@moscowcss/og';
import type { ImageMetadata } from 'astro';
import { localeOf, slugOf, type ReviewEntry, type SpeakerEntry } from './catalog';

/** Ширина оптимизированного фото: кружок аватара — 12.5rem, с запасом под ретину. */
const PHOTO_WIDTH = 480;

export interface SpeakerImage {
  src: string;
  width: number;
  height: number;
}

/** Адрес сгенерированного аватара спикера без фото: `/avatars/ru/daria-egorova.png`. */
export const avatarPath = (entry: { id: string }): string =>
  `/avatars/${localeOf(entry)}/${slugOf(entry)}.png`;

/** Адрес аватара автора отзыва без фото: своя папка, потому что слаг может совпасть со спикером. */
export const reviewAvatarPath = (entry: { id: string }): string =>
  `/avatars/reviews/${localeOf(entry)}/${slugOf(entry)}.png`;

/** Нужен ли спикеру сгенерированный аватар. */
export const needsAvatar = (entry: SpeakerEntry): boolean => entry.data.photo === undefined;

/** Картинка спикера: оптимизированное фото или аватар с инициалами. */
export async function speakerImage(entry: SpeakerEntry): Promise<SpeakerImage> {
  const { photo } = entry.data;
  if (photo === undefined) {
    return { src: avatarPath(entry), width: AVATAR_SIZE, height: AVATAR_SIZE };
  }
  return optimizedPhoto(photo);
}

/** Картинка автора отзыва: оптимизированное фото или аватар с инициалами. */
export async function reviewImage(entry: ReviewEntry): Promise<SpeakerImage> {
  const { photo } = entry.data;
  return photo === undefined
    ? { src: reviewAvatarPath(entry), width: AVATAR_SIZE, height: AVATAR_SIZE }
    : optimizedPhoto(photo);
}

export async function optimizedPhoto(photo: ImageMetadata, width = PHOTO_WIDTH): Promise<SpeakerImage> {
  const optimized = await getImage({ src: photo, width: Math.min(width, photo.width), format: 'webp' });
  return {
    src: optimized.src,
    width: Number(optimized.attributes['width'] ?? photo.width),
    height: Number(optimized.attributes['height'] ?? photo.height),
  };
}
