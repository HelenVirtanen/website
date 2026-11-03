import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const MAX_DIFF_RATIO = 0.001;
const PIXELMATCH_THRESHOLD = 0.1;
const DIFF_DIR = 'diff';

const args = process.argv.slice(2);
// --exact: для рефакторингов, которые не должны менять ни пикселя; порог 0.1% на крупном снимке
// пропускает тысячи пикселей (например, сдвиг разделителя на всю ширину).
const exact = args.includes('--exact');
// --ignore <префикс>: снимки, чьё изменение задумано (например, шапка с новым элементом). Печатаются в итоге.
const ignored = args.flatMap((arg, i) => (arg === '--ignore' && args[i + 1] ? [args[i + 1]] : []));
const [baseDir, nextDir] = args.filter((arg, i) => arg !== '--exact' && arg !== '--ignore' && args[i - 1] !== '--ignore');
const isIgnored = (file) => ignored.some((prefix) => file.startsWith(prefix));
if (!baseDir || !nextDir) {
  console.error('Использование: node tools/visual/compare.mjs [--exact] [--ignore <префикс>]… <base-dir> <next-dir>');
  process.exit(2);
}

async function manifestLine(dir) {
  try {
    const { commit, dirty, capturedAt } = JSON.parse(await readFile(join(dir, 'manifest.json'), 'utf8'));
    return `${commit.slice(0, 7)}${dirty ? ' (грязное дерево)' : ''}, ${capturedAt}`;
  } catch {
    return 'манифеста нет — не известно, с какого кода сняты снимки';
  }
}
console.log(`база:     ${baseDir} — ${await manifestLine(baseDir)}`);
console.log(`проверка: ${nextDir} — ${await manifestLine(nextDir)}\n`);

async function listPngs(root, dir = root) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (dir === root && entry.name === DIFF_DIR) continue;
      files.push(...(await listPngs(root, path)));
    } else if (entry.name.endsWith('.png')) {
      files.push(relative(root, path));
    }
  }
  return files.sort();
}

const readPng = async (path) => PNG.sync.read(await readFile(path));

let baseFiles;
try {
  baseFiles = await listPngs(baseDir);
} catch (error) {
  console.error(`ОШИБКА: не удалось прочитать ${baseDir}: ${error.message}`);
  process.exit(1);
}
if (baseFiles.length === 0) {
  console.error(`ОШИБКА: в ${baseDir} нет ни одного PNG`);
  process.exit(1);
}

const rows = [];
let failed = 0;

for (const file of baseFiles) {
  if (isIgnored(file)) {
    rows.push([file, 'ИСКЛЮЧЁН (--ignore)']);
    continue;
  }
  const nextPath = join(nextDir, file);
  let next;
  try {
    next = await readPng(nextPath);
  } catch {
    rows.push([file, 'ОТСУТСТВУЕТ']);
    failed += 1;
    continue;
  }
  const base = await readPng(join(baseDir, file));
  if (base.width !== next.width || base.height !== next.height) {
    rows.push([file, `РАЗМЕР ${base.width}x${base.height} -> ${next.width}x${next.height}`]);
    failed += 1;
    continue;
  }
  const diff = new PNG({ width: base.width, height: base.height });
  const mismatched = pixelmatch(base.data, next.data, diff.data, base.width, base.height, {
    threshold: PIXELMATCH_THRESHOLD,
  });
  const ratio = mismatched / (base.width * base.height);
  const bad = exact ? mismatched > 0 : ratio > MAX_DIFF_RATIO;
  if (mismatched > 0) {
    const diffPath = join(nextDir, DIFF_DIR, file);
    await mkdir(join(diffPath, '..'), { recursive: true });
    await writeFile(diffPath, PNG.sync.write(diff));
  }
  rows.push([file, `${(ratio * 100).toFixed(4)}%${bad ? ' ПРЕВЫШЕНИЕ' : ''}`]);
  if (bad) failed += 1;
}

// Снимки, которых нет в базе, означают, что база неполная и часть покрытия молча выпала.
const baseSet = new Set(baseFiles);
for (const file of await listPngs(nextDir).catch(() => [])) {
  if (!baseSet.has(file) && !isIgnored(file)) {
    rows.push([file, 'НЕТ В БАЗЕ']);
    failed += 1;
  }
}

const width = Math.max(...rows.map(([file]) => file.length));
for (const [file, result] of rows) console.log(`${file.padEnd(width)}  ${result}`);
console.log(`\nфайлов: ${rows.length}, ошибок: ${failed}, порог: ${exact ? '0 пикселей (--exact)' : `${MAX_DIFF_RATIO * 100}%`}`);
process.exit(failed > 0 ? 1 : 0);
