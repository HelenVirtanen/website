import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  DocumentSchema,
  createEventSchema,
  FaqSchema,
  PageSchema,
  createOrganizerSchema,
  createPartnerSchema,
  createCommunitySchema,
  createNewsSchema,
  createReviewSchema,
  createTalkSchema,
  createSpeakerSchema,
} from './schema';

// Каждая коллекция делится на папки языков (`ru/`, `en/`). Id записи — путь без
// расширения вместе с языком (`ru/31`, `en/daria-egorova`); по умолчанию loader берёт id
// из `slug` во frontmatter, и записи разных языков склеились бы в одну.
const localized = (dir: string) =>
  glob({
    pattern: '**/*.md',
    base: new URL(`./${dir}`, import.meta.url),
    generateId: ({ entry }) => entry.replace(/\.[^.]+$/, ''),
  });

export const collections = {
  pages: defineCollection({ loader: localized('pages'), schema: PageSchema }),
  events: defineCollection({ loader: localized('events'), schema: ({ image }) => createEventSchema(image) }),
  talks: defineCollection({ loader: localized('talks'), schema: ({ image }) => createTalkSchema(image) }),
  speakers: defineCollection({
    loader: localized('speakers'),
    schema: ({ image }) => createSpeakerSchema(image),
  }),
  partners: defineCollection({
    loader: localized('partners'),
    schema: ({ image }) => createPartnerSchema(image),
  }),
  organizers: defineCollection({
    loader: localized('organizers'),
    schema: ({ image }) => createOrganizerSchema(image),
  }),
  reviews: defineCollection({
    loader: localized('reviews'),
    schema: ({ image }) => createReviewSchema(image),
  }),
  communities: defineCollection({
    loader: localized('communities'),
    schema: ({ image }) => createCommunitySchema(image),
  }),
  news: defineCollection({
    loader: localized('news'),
    schema: ({ image }) => createNewsSchema(image),
  }),
  faq: defineCollection({ loader: localized('faq'), schema: FaqSchema }),
  documents: defineCollection({ loader: localized('documents'), schema: DocumentSchema }),
};
