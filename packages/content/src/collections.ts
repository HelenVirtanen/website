import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  DocumentSchema,
  EventSchema,
  FaqSchema,
  PageSchema,
  createOrganizerSchema,
  createPartnerSchema,
  TalkSchema,
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
  events: defineCollection({ loader: localized('events'), schema: EventSchema }),
  talks: defineCollection({ loader: localized('talks'), schema: TalkSchema }),
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
  faq: defineCollection({ loader: localized('faq'), schema: FaqSchema }),
  documents: defineCollection({ loader: localized('documents'), schema: DocumentSchema }),
};
