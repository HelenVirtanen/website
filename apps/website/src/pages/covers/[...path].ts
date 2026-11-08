import { readFileSync } from 'node:fs';
import type { APIRoute, GetStaticPaths } from 'astro';
import { renderTalkCover } from '@moscowcss/og';
import { loadCatalog } from '../../content/catalog';
import { talkCoverPath, talkCoverSourceOf } from '../../content/talk-cover';
import { CARD_TYPE } from '../../seo/og';

// Обложки `/covers/<язык>/<доклад>.png` всех докладов в одном стиле: название, спикер, метка митапа и его фото. `.png` — в параметре, как у og/[...path].ts.
const readSource = (path: string): string => readFileSync(path, 'utf8');

async function publishedTalks() {
  const catalog = await loadCatalog();
  return { catalog, talks: catalog.talks.filter((talk) => !talk.data.draft) };
}

export const getStaticPaths = (async () =>
  (await publishedTalks()).talks.map((talk) => ({
    params: { path: talkCoverPath(talk).replace(/^\/covers\//, '') },
  }))) satisfies GetStaticPaths;

// Доклад ищется по адресу, а не по props: эндпоинту с расширением в параметре dev-сервер Astro 7 props не передаёт.
export const GET: APIRoute = async ({ url }) => {
  const { catalog, talks } = await publishedTalks();
  const pathname = url.pathname.replace(/\/$/, '');
  const talk = talks.find((item) => talkCoverPath(item) === pathname);
  if (!talk) return new Response(null, { status: 404 });
  const { photoFile, ...input } = talkCoverSourceOf(talk, catalog, readSource);
  const png = await renderTalkCover({ ...input, photo: photoFile ? readFileSync(photoFile) : undefined });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': CARD_TYPE } });
};
