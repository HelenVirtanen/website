// CLI гейта: проверяет собранный dist, при нарушениях выходит с кодом 1.
//   node scripts/check-seo.mjs [dist-dir]
import { fileURLToPath } from 'node:url';
import { checkDist } from './seo-checks.mjs';

const SITE_URL = 'https://css.moscow';

const dist = process.argv[2] ?? fileURLToPath(new URL('../dist/', import.meta.url));
const { errors, htmlCount, indexableCount } = await checkDist(dist, SITE_URL);

if (errors.length > 0) {
  const list = errors.map((e) => `  ✖ ${e}`).join('\n');
  console.error(`check-seo: ${errors.length} нарушений в ${dist}\n${list}`);
  process.exit(1);
}
console.log(`check-seo: OK — ${htmlCount} HTML, индексируемых ${indexableCount}, site ${SITE_URL}`);
