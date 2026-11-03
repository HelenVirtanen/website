// Заготовки контента сразу на всех языках из шаблонов packages/content/templates.
//
//   pnpm new:event 32            → events/{ru,en}/32.md
//   pnpm new:talk <имя>          → talks/{ru,en}/<имя>.md
//   pnpm new:speaker <имя>       → speakers/{ru,en}/<имя>.md и общее фото-заглушка speakers/assets/<имя>.jpg
//   pnpm new:partner <имя>       → partners/{ru,en}/<имя>.md
//   pnpm new:faq <имя>           → faq/{ru,en}/<имя>.md
//
// Шаблоны лежат вне src/, поэтому на сайт не попадают. Существующие файлы скрипт не перезаписывает:
// при любом конфликте он ничего не создаёт.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Совпадение с `locales` сайта проверяет тест.
export const LOCALES = ['ru', 'en'];

// Тип заготовки → коллекция и правило имени (имя становится частью адреса и ссылок).
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const KINDS = {
  event: { collection: 'events', name: /^[1-9][0-9]*$/, hint: 'номер митапа, например pnpm new:event 32' },
  talk: { collection: 'talks', name: SLUG, hint: 'например pnpm new:talk gamification-in-business' },
  speaker: { collection: 'speakers', name: SLUG, hint: 'например pnpm new:speaker daria-egorova' },
  partner: { collection: 'partners', name: SLUG, hint: 'например pnpm new:partner zvuk' },
  faq: { collection: 'faq', name: SLUG, hint: 'например pnpm new:faq afterparty' },
};

const root = fileURLToPath(new URL('../../../packages/content/', import.meta.url));
export const DEFAULT_DIRS = { content: join(root, 'src'), templates: join(root, 'templates') };

/** Дата в формате frontmatter (`ГГГГ-ММ-ДД`) по местному времени автора. */
export function isoDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const fill = (template, values) =>
  Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{{${key}}}`, value), template);

/**
 * Какие файлы создать. Ничего не пишет: на вход — что уже есть на диске, на выход — список
 * `{ path, content }` (для фото-заглушки спикера `{ path, source }`) или ошибка с понятным текстом.
 */
export function planEntry({ kind, name, today, dirs = DEFAULT_DIRS, exists = existsSync, read = (p) => readFileSync(p, 'utf8') }) {
  const spec = Object.hasOwn(KINDS, kind) ? KINDS[kind] : undefined;
  if (spec === undefined) throw new Error(`неизвестный тип «${kind ?? ''}»: ${Object.keys(KINDS).join(', ')}`);
  if (!spec.name.test(name ?? '')) {
    throw new Error(`имя «${name ?? ''}» не подходит: ${spec.hint}. Латиница в нижнем регистре, цифры и дефисы`);
  }

  const values = { name, date: isoDate(today) };
  const files = LOCALES.map((locale) => ({
    path: join(dirs.content, spec.collection, locale, `${name}.md`),
    content: fill(read(join(dirs.templates, locale, `${kind}.md`)), values),
  }));
  if (kind === 'speaker') {
    files.push({
      path: join(dirs.content, 'speakers', 'assets', `${name}.jpg`),
      source: join(dirs.templates, 'placeholder-photo.jpg'),
    });
  }

  const taken = files.filter((file) => exists(file.path));
  if (taken.length > 0) throw new Error(`уже есть: ${taken.map((file) => file.path).join(', ')}. Ничего не создано`);
  return files;
}

/** CLI: `node new-entry.mjs <тип> <имя>`. Возвращает код выхода. */
export function runNewEntry(argv, { today = new Date(), dirs = DEFAULT_DIRS, log = console.log, error = console.error } = {}) {
  const [kind, name] = argv;
  let files;
  try {
    files = planEntry({ kind, name, today, dirs });
  } catch (err) {
    error(`new-entry: ${err.message}`);
    return 1;
  }
  const written = [];
  try {
    for (const file of files) {
      mkdirSync(dirname(file.path), { recursive: true });
      const data = file.source === undefined ? file.content : readFileSync(file.source);
      writeFileSync(file.path, data, { flag: 'wx' });
      written.push(file.path);
    }
  } catch (err) {
    // Сбой посреди записи (гонка, права, место) — убираем уже созданное: «ничего не создано» должно быть правдой.
    for (const path of written) rmSync(path, { force: true });
    error(`new-entry: ${err.message}. Ничего не создано`);
    return 1;
  }
  for (const path of written) log(`создан ${path}`);
  log('Заготовки — черновики (draft: true); заполните их по packages/content/README.md.');
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runNewEntry(process.argv.slice(2));
}
