import { readFileSync } from 'node:fs';
import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { CARD_SIZES, renderCard, type CardInput } from '@moscowcss/og';
import { loadCatalog } from '../../content/catalog';
import { coverFileOf, isWide } from '../../content/talk-cover';
import { CARD_TYPE, cardInputOf, cardParam, sizeOfParam } from '../../seo/og';
import { publicPagesOf } from '../../seo/pages';

// Карточки `/og/<адрес страницы>.png` и `/og/<адрес страницы>.twitter.png` для каждой публичной
// страницы. Рисуются на сборке: прод — статика, сервиса по запросу нет.
// `.png` входит в параметр, а не в имя файла маршрута: у `[...path].png.ts` при trailingSlash
// 'always' Astro 7.0.6 ищет путь со слэшем, а шаблон маршрута слэша не допускает.
const EXTENSION = '.png';

interface Props {
  input: Omit<CardInput, 'size'>;
  /** Файл широкой обложки доклада: карточка — она, обрезанная по центру до размера */
  cover: string | undefined;
}

const readSource = (path: string): string => readFileSync(path, 'utf8');

export const getStaticPaths = (async () => {
  const catalog = await loadCatalog();
  return publicPagesOf(catalog).flatMap((page) => {
    const input = cardInputOf(page, catalog);
    const cover =
      page.kind === 'talk' && page.entry.data.cover && isWide(page.entry.data.cover)
        ? coverFileOf(page.entry, readSource)
        : undefined;
    return (['og', 'twitter'] as const).map((size) => ({
      params: { path: `${cardParam(page, size)}${EXTENSION}` },
      props: { input, cover } satisfies Props,
    }));
  });
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params, props }) => {
  const { input, cover } = props as Props;
  const param = (params['path'] ?? '').slice(0, -EXTENSION.length);
  const size = sizeOfParam(param);
  const png = cover
    ? await sharp(cover).resize({ ...CARD_SIZES[size], fit: 'cover', position: 'centre' }).png().toBuffer()
    : await renderCard({ ...input, size });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': CARD_TYPE } });
};
