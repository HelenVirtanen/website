import { readFileSync } from 'node:fs';
import type { APIRoute, GetStaticPaths } from 'astro';
import { CARD_SIZES, renderCard, renderTalkCover } from '@moscowcss/og';
import { loadCatalog } from '../../content/catalog';
import { talkCoverSourceOf } from '../../content/talk-cover';
import { CARD_TYPE, cardInputOf, cardParam, sizeOfParam } from '../../seo/og';
import { publicPagesOf } from '../../seo/pages';

// Карточки `/og/<адрес страницы>.png` и `/og/<адрес страницы>.twitter.png` для каждой публичной
// страницы. Рисуются на сборке: прод — статика, сервиса по запросу нет.
// `.png` входит в параметр, а не в имя файла маршрута: у `[...path].png.ts` при trailingSlash
// 'always' Astro 7.0.6 ищет путь со слэшем, а шаблон маршрута слэша не допускает.
const EXTENSION = '.png';

const readSource = (path: string): string => readFileSync(path, 'utf8');

export const getStaticPaths = (async () =>
  publicPagesOf(await loadCatalog()).flatMap((page) =>
    (['og', 'twitter'] as const).map((size) => ({ params: { path: `${cardParam(page, size)}${EXTENSION}` } })),
  )) satisfies GetStaticPaths;

// Страница ищется по адресу, а не по props: эндпоинту с расширением в параметре dev-сервер Astro 7 props не передаёт.
export const GET: APIRoute = async ({ url }) => {
  const param = url.pathname.replace(/\/$/, '').replace(/^\/og\//, '').slice(0, -EXTENSION.length);
  const size = sizeOfParam(param);
  const catalog = await loadCatalog();
  const page = publicPagesOf(catalog).find((candidate) => cardParam(candidate, size) === param);
  if (!page) return new Response(null, { status: 404 });

  // Превью доклада — его обложка, нарисованная под размер площадки.
  if (page.kind === 'talk') {
    const { photoFile, ...input } = talkCoverSourceOf(page.entry, catalog, readSource);
    const png = await renderTalkCover({ ...input, photo: photoFile ? readFileSync(photoFile) : undefined, size: CARD_SIZES[size] });
    return new Response(new Uint8Array(png), { headers: { 'Content-Type': CARD_TYPE } });
  }
  const png = await renderCard({ ...cardInputOf(page, catalog), size });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': CARD_TYPE } });
};
