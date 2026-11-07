import type { APIRoute, GetStaticPaths } from 'astro';
import { renderAvatar } from '@moscowcss/og';
import { loadCatalog } from '../../content/catalog';
import { reviewAvatarPath, avatarPath, needsAvatar } from '../../content/speaker-image';

// Аватары `/avatars/<язык>/<имя>.png` спикеров без фото: инициалы на языке страницы.
// `.png` в параметре, а не в имени файла маршрута — по той же причине, что у og/[...path].ts.
interface Props {
  name: string;
}

export const getStaticPaths = (async () => {
  const { speakers, reviews } = await loadCatalog();
  const authors = reviews
    .filter((entry) => !entry.data.draft && entry.data.photo === undefined)
    .map((entry) => ({
      params: { path: reviewAvatarPath(entry).replace(/^\/avatars\//, '') },
      props: { name: entry.data.name } satisfies Props,
    }));
  const people = speakers
    .filter((entry) => !entry.data.draft && needsAvatar(entry))
    .map((entry) => ({
      params: { path: avatarPath(entry).replace(/^\/avatars\//, '') },
      props: { name: entry.data.name } satisfies Props,
    }));
  return [...people, ...authors];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { name } = props as Props;
  const png = await renderAvatar({ name });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
