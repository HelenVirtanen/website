import type { APIRoute, GetStaticPaths } from 'astro';
import { renderCard, type CardInput } from '@moscowcss/og';
import { loadCatalog } from '../../content/catalog';
import { CARD_TYPE, cardInputOf, cardParam, sizeOfParam } from '../../seo/og';
import { publicPagesOf } from '../../seo/pages';

// Карточки `/og/<адрес страницы>.png` и `/og/<адрес страницы>.twitter.png` для каждой публичной
// страницы. Рисуются на сборке: прод — статика, сервиса по запросу нет.
// `.png` входит в параметр, а не в имя файла маршрута: у `[...path].png.ts` при trailingSlash
// 'always' Astro 7.0.6 ищет путь со слэшем, а шаблон маршрута слэша не допускает.
const EXTENSION = '.png';

interface Props {
  input: Omit<CardInput, 'size'>;
}

export const getStaticPaths = (async () => {
  const catalog = await loadCatalog();
  return publicPagesOf(catalog).flatMap((page) => {
    const input = cardInputOf(page, catalog);
    return (['og', 'twitter'] as const).map((size) => ({
      params: { path: `${cardParam(page, size)}${EXTENSION}` },
      props: { input } satisfies Props,
    }));
  });
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params, props }) => {
  const { input } = props as Props;
  const param = (params['path'] ?? '').slice(0, -EXTENSION.length);
  const png = await renderCard({ ...input, size: sizeOfParam(param) });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': CARD_TYPE } });
};
