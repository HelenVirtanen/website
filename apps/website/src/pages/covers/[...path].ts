import { readFileSync } from 'node:fs';
import type { APIRoute, GetStaticPaths } from 'astro';
import { renderTalkCover } from '@moscowcss/og';
import { loadCatalog } from '../../content/catalog';
import { talkCoverPath, talkCoverSourceOf, type TalkCoverSource } from '../../content/talk-cover';
import { CARD_TYPE } from '../../seo/og';

// Обложки `/covers/<язык>/<доклад>.png` докладов без своей карточки анонса: метка митапа, название,
// спикер и его фото в стиле карточек из канала. `.png` — в параметре, как у og/[...path].ts.
const readSource = (path: string): string => readFileSync(path, 'utf8');

export const getStaticPaths = (async () => {
  const catalog = await loadCatalog();
  return catalog.talks
    .filter((talk) => !talk.data.draft && talk.data.cover === undefined)
    .map((talk) => ({
      params: { path: talkCoverPath(talk).replace(/^\/covers\//, '') },
      props: talkCoverSourceOf(talk, catalog, readSource),
    }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { photoFile, ...input } = props as TalkCoverSource;
  const png = await renderTalkCover({ ...input, photo: photoFile ? readFileSync(photoFile) : undefined });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': CARD_TYPE } });
};
