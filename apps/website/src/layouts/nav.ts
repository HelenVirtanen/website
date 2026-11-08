import { localizePath, type Locale, type UiKey } from '../i18n';

export interface NavLink {
  href: string;
  label: string;
  /** `page` — это и есть текущая страница, `true` — текущая страница внутри раздела */
  current?: 'page' | 'true';
  /** Только в меню телефона: на широком экране раздел доступен через другой пункт */
  mobileOnly?: true;
}

// Страницы отзывов нет, пока нет ни одного опубликованного отзыва (спека 008): ссылка появляется вместе с ней.
const REVIEWS_PATH = 'reviews';

interface Section {
  path: string;
  label: UiKey;
  /** Разделы, страницы которых тоже подсвечивают этот пункт */
  includes?: readonly string[];
  mobileOnly?: true;
}

// Шапка ведёт по сайту, а не по экранам главной (спеки 007 и 009). Доклады и спикеры — вкладки
// «Истории», поэтому на широком экране их отдельных пунктов нет, а в меню телефона они остаются.
const SECTIONS: readonly Section[] = [
  { path: 'about', label: 'nav.about' },
  { path: 'events', label: 'nav.history', includes: ['talks', 'speakers'] },
  { path: REVIEWS_PATH, label: 'nav.reviews' },
  { path: 'news', label: 'nav.news' },
  { path: 'help', label: 'nav.help' },
  { path: 'talks', label: 'nav.talks', mobileOnly: true },
  { path: 'speakers', label: 'nav.speakers', mobileOnly: true },
  { path: 'search', label: 'nav.search' },
];

/** Ссылки шапки; у раздела текущей страницы — `current`. `pathname` — путь со слэшем на конце. */
export function navLinksOf(
  locale: Locale,
  t: (key: UiKey) => string,
  pathname = '',
  { reviews = false }: { reviews?: boolean } = {},
): NavLink[] {
  return SECTIONS.filter(({ path }) => reviews || path !== REVIEWS_PATH).map(({ path, label, includes = [], mobileOnly }) => {
    const href = localizePath(locale, path);
    const inside = [href, ...includes.map((other) => localizePath(locale, other))].some((prefix) => pathname.startsWith(prefix));
    const current = pathname === href ? 'page' : inside ? 'true' : undefined;
    return { href, label: t(label), ...(current && { current }), ...(mobileOnly && { mobileOnly }) };
  });
}
