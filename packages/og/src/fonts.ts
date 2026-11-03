import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

type Weight = 400 | 600 | 700;

export interface LoadedFont {
  name: string;
  data: Buffer;
  weight: Weight;
  style: 'normal';
}

export const FONT_FAMILY = 'Montserrat';

// TTF, а не WOFF2: satori не читает WOFF2. Файлы лежат в @moscowcss/fonts, копий здесь нет.
const FILES: readonly { file: string; weight: Weight }[] = [
  { file: 'Montserrat-Regular.ttf', weight: 400 },
  { file: 'Montserrat-SemiBold.ttf', weight: 600 },
  { file: 'Montserrat-Bold.ttf', weight: 700 },
];

let cache: Promise<LoadedFont[]> | undefined;

// Каталог — от package.json шрифтового пакета, а не от import.meta.url: сборка сайта бандлит
// исходники в свои чанки, и путь относительно модуля уводит в dist/.
const fontsDir = (): string =>
  join(dirname(createRequire(import.meta.url).resolve('@moscowcss/fonts/package.json')), 'montserrat');

export function loadFonts(): Promise<LoadedFont[]> {
  cache ??= Promise.all(
    FILES.map(async ({ file, weight }) => ({
      name: FONT_FAMILY,
      weight,
      style: 'normal' as const,
      data: await readFile(join(fontsDir(), file)),
    })),
  ).catch((error: unknown) => {
    // Отказ не запоминаем: следующий вызов повторит чтение.
    cache = undefined;
    throw error;
  });
  return cache;
}
