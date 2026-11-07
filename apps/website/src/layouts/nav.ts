import { localizePath, type Locale, type UiKey } from '../i18n';

export interface NavLink {
  href: string;
  label: string;
  /** `page` — это и есть текущая страница, `true` — текущая страница внутри раздела */
  current?: 'page' | 'true';
}

// Страницы отзывов нет, пока нет ни одного опубликованного отзыва (спека 008): ссылка появляется вместе с ней.
const REVIEWS_PATH = 'reviews';

// Шапка ведёт по сайту, а не по экранам главной (спека 007): регистрацию ведёт плавающая кнопка,
// программа, партнёры и адрес — экраны главной под первым.
const SECTIONS: readonly { path: string; label: UiKey }[] = [
  { path: 'events', label: 'nav.history' },
  { path: 'talks', label: 'nav.talks' },
  { path: 'speakers', label: 'nav.speakers' },
  { path: REVIEWS_PATH, label: 'nav.reviews' },
  { path: 'about', label: 'nav.about' },
  { path: 'search', label: 'nav.search' },
];

/** Ссылки шапки; у раздела текущей страницы — `current`. `pathname` — путь со слэшем на конце. */
export function navLinksOf(
  locale: Locale,
  t: (key: UiKey) => string,
  pathname = '',
  { reviews = false }: { reviews?: boolean } = {},
): NavLink[] {
  return SECTIONS.filter(({ path }) => reviews || path !== REVIEWS_PATH).map(({ path, label }) => {
    const href = localizePath(locale, path);
    const current = pathname === href ? 'page' : pathname.startsWith(href) ? 'true' : undefined;
    return { href, label: t(label), ...(current && { current }) };
  });
}
