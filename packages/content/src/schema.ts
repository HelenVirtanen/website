import { z } from 'astro/zod';
import type { ImageFunction } from 'astro/content/config';

// Слаг — короткое имя файла без языка и расширения: `31`, `daria-egorova`.
// Связи пишутся слагом, а не полным id, чтобы их было удобно набирать с телефона.
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slug = z
  .string()
  .regex(SLUG_PATTERN, 'слаг: латиница в нижнем регистре, цифры и дефисы, например daria-egorova');

// Начало: `19:10`; перерыв и активность — интервал `19:40—20:00` (дефис, en- или em-dash).
const clockTime = z.string().regex(/^\d{2}:\d{2}$/, 'время в формате ЧЧ:ММ, например 19:10');
const timeRange = z
  .string()
  .regex(/^\d{2}:\d{2}(?:[—–-]\d{2}:\d{2})?$/, 'время ЧЧ:ММ или интервал ЧЧ:ММ—ЧЧ:ММ');

const url = z.string().url();

export const PageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  telegramUrl: url,
});

const ScheduleItemSchema = z.object({
  time: timeRange,
  title: z.string().min(1),
  kind: z.enum(['break', 'activity']),
});

export const EventSchema = z.object({
  // Дата, время и смещение: `2026-07-09T18:00:00+03:00`.
  date: z.coerce.date(),
  tagline: z.string().min(1),
  venue: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    mapUrl: url.optional(),
    // Точка на карте-заглушке; одинакова во всех языках.
    coordinates: z
      .object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        zoom: z.number().int().positive(),
      })
      .optional(),
  }),
  modes: z.array(z.string().min(1)).min(1),
  passportRequired: z.boolean(),
  registrationUrl: url.optional(),
  streamUrl: url.optional(),
  recordingUrl: url.optional(),
  partner: slug.optional(),
  // Перерывы и активности без спикера: у них нет своей страницы, доклады идут отдельными файлами.
  schedule: z.array(ScheduleItemSchema).default([]),
  draft: z.boolean().default(false),
});

export const TalkSchema = z.object({
  event: slug,
  speakers: z.array(slug).min(1),
  time: clockTime,
  title: z.string().min(1),
  slidesUrl: url.optional(),
  videoUrl: url.optional(),
  draft: z.boolean().default(false),
});

// `image()` доступна только в схеме-функции, поэтому схема спикера — фабрика.
export const createSpeakerSchema = (image: ImageFunction) =>
  z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    photo: image(),
    photoAlt: z.string().min(1),
    links: z.array(z.object({ label: z.string().min(1), url })).optional(),
    draft: z.boolean().default(false),
  });

export const PartnerSchema = z.object({
  name: z.string().min(1),
  handle: z.string().min(1),
  url: url.optional(),
  tagline: z.string().min(1),
  features: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        footnote: z.string().min(1).optional(),
      }),
    )
    .min(1),
});

export const FaqSchema = z.object({
  title: z.string().min(1),
  // Порядок карточек: меньше — левее.
  order: z.number().int().nonnegative(),
});
