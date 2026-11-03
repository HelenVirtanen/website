import { localizePath, type Locale, type UiKey } from '../i18n';

export interface NavLink {
  href: string;
  label: string;
}

// Разделы главной, на которые ведёт шапка. Якорь — `id` секции на главной.
const HOME_SECTIONS: readonly { anchor: string; label: UiKey }[] = [
  { anchor: 'registration', label: 'nav.registration' },
  { anchor: 'program', label: 'nav.program' },
  { anchor: 'partners', label: 'nav.partners' },
  { anchor: 'address', label: 'nav.address' },
  { anchor: 'events', label: 'nav.history' },
];

/**
 * Ссылки шапки. Разделы — якоря главной своего языка с путём (`/en/#program`): голый `#program`
 * на странице митапа или спикера никуда не ведёт, а на главной путь к ней же не перезагружает страницу.
 */
export function navLinksOf(locale: Locale, t: (key: UiKey) => string): NavLink[] {
  const home = localizePath(locale);
  return [
    ...HOME_SECTIONS.map(({ anchor, label }) => ({ href: `${home}#${anchor}`, label: t(label) })),
    { href: localizePath(locale, 'search'), label: t('nav.search') },
  ];
}
