import type { APIRoute, GetStaticPaths } from 'astro';
import { renderAvatar } from '@moscowcss/og';
import { loadCatalog } from '../../content/catalog';
import { reviewAvatarPath, avatarPath, needsAvatar } from '../../content/speaker-image';

// Аватары `/avatars/<язык>/<имя>.png` спикеров и `/avatars/reviews/<язык>/<имя>.png` авторов отзывов без фото.
// `.png` в параметре, а не в имени файла маршрута — по той же причине, что у og/[...path].ts.
async function avatars(): Promise<Map<string, string>> {
  const { speakers, reviews } = await loadCatalog();
  return new Map([
    ...speakers.filter((entry) => !entry.data.draft && needsAvatar(entry)).map((entry) => [avatarPath(entry), entry.data.name] as const),
    ...reviews
      .filter((entry) => !entry.data.draft && entry.data.photo === undefined)
      .map((entry) => [reviewAvatarPath(entry), entry.data.name] as const),
  ]);
}

export const getStaticPaths = (async () =>
  [...(await avatars()).keys()].map((path) => ({ params: { path: path.replace(/^\/avatars\//, '') } }))) satisfies GetStaticPaths;

// Имя ищется по адресу, а не по props: эндпоинту с расширением в параметре dev-сервер Astro 7 props не передаёт.
export const GET: APIRoute = async ({ url }) => {
  const name = (await avatars()).get(url.pathname.replace(/\/$/, ''));
  if (name === undefined) return new Response(null, { status: 404 });
  const png = await renderAvatar({ name });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
