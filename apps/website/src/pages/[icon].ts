import type { APIRoute, GetStaticPaths } from 'astro';
import { defaultLocale, useTranslations } from '../i18n';
import { iconFiles } from '../seo/icons';

const files = iconFiles(useTranslations(defaultLocale)('site.name'));

export const getStaticPaths = (() => files.map((file) => ({ params: { icon: file.name } }))) satisfies GetStaticPaths;

// Файл ищется по адресу, а не по params: так же, как у RSS (pages/[...locale]/rss.xml.ts).
export const GET: APIRoute = async ({ url }) => {
  const name = url.pathname.replace(/^\/|\/$/g, '');
  const file = files.find((candidate) => candidate.name === name);
  if (!file) throw new Error(`иконка: нет файла ${name}`);
  const body = await file.body();
  return new Response(typeof body === 'string' ? body : new Uint8Array(body), {
    headers: { 'Content-Type': file.contentType },
  });
};
