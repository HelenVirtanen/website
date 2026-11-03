// Генератор Astro-компонентов из SVG ("SVGR для Astro").
// Читает src/svg/*.svg, чистит каждый через SVGO и пишет по одному
// src/generated/<PascalName>.astro на иконку плюс barrel-файл index.ts.
//
// Зависимости (ставить latest): pnpm --filter @moscowcss/icons add -D svgo
import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';
import svgoConfig from '../svgo.config.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(root, 'src/svg');
const OUT = join(root, 'src/generated');

const pascal = (name) =>
  name
    .replace(/\.svg$/, '')
    .split(/[-_\s]+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');

// Растровые/многоцветные SVG — SVGO ломает вложенные image/pattern.
const skipOptimize = new Set(['zvuk-logo.svg', 'qr-code.svg']);

function parse(svg) {
  const open = (svg.match(/<svg[^>]*>/) || [''])[0];
  const viewBox = (open.match(/viewBox="([^"]+)"/) || [])[1] ?? '0 0 24 24';
  // fill корня уважаем из исходника: обводочные иконки экспортируются с fill="none"
  // (тогда открытый контур не зальётся), заливочные — с currentColor. Нет атрибута —
  // по умолчанию currentColor, чтобы иконка красилась через `color`.
  const fill = (open.match(/\bfill="([^"]+)"/) || [])[1] ?? 'currentColor';
  const inner = (svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/) || [])[1] ?? '';
  return { viewBox, fill, inner: inner.trim() };
}

const template = (viewBox, fill, inner) => `---
interface Props extends astroHTML.JSX.SVGAttributes {
  size?: string | number;
}
const { size, width, height, ...rest } = Astro.props;
---
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="${viewBox}"
  width={width ?? size ?? '1em'}
  height={height ?? size ?? '1em'}
  fill="${fill}"
  aria-hidden="true"
  {...rest}
  set:html={${JSON.stringify(inner)}}
/>
`;

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const files = (await readdir(SRC)).filter((f) => f.endsWith('.svg'));
  const names = [];

  for (const file of files) {
    const raw = await readFile(join(SRC, file), 'utf8');
    const data = skipOptimize.has(file) ? raw : optimize(raw, { ...svgoConfig, path: file }).data;
    const { viewBox, fill, inner } = parse(data);
    const name = pascal(basename(file));
    await writeFile(join(OUT, `${name}.astro`), template(viewBox, fill, inner));
    names.push(name);
  }

  const barrel = names
    .sort()
    .map((n) => `export { default as ${n} } from './${n}.astro';`)
    .join('\n');
  await writeFile(join(OUT, 'index.ts'), barrel + '\n');

  console.log(`Generated ${names.length} icon component(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
