import type { Locale } from './config';

// ru — язык-источник: набор его ключей задаёт тип `UiKey`, остальные языки обязаны
// покрыть все ключи (проверяет `satisfies` и ui.test.ts).
const ru = {
  'site.name': 'MoscowCSS Meetup',
  'site.description':
    'Митапы сообщества фронтендеров MoscowCSS: программа, спикеры, партнёры и регистрация.',
  'nav.registration': 'Регистрация',
  'nav.program': 'Программа',
  'nav.partners': 'Партнеры',
  'nav.address': 'Адрес',
  'nav.menu': 'Меню',
  'nav.closeMenu': 'Закрыть меню',
  'nav.telegram': 'Telegram Moscow CSS',
  'locale.label': 'Язык сайта',
} as const;

export type UiKey = keyof typeof ru;

const en = {
  'site.name': 'MoscowCSS Meetup',
  'site.description':
    'MoscowCSS meetups for the frontend community: schedule, speakers, partners and registration.',
  'nav.registration': 'Registration',
  'nav.program': 'Program',
  'nav.partners': 'Partners',
  'nav.address': 'Address',
  'nav.menu': 'Menu',
  'nav.closeMenu': 'Close menu',
  'nav.telegram': 'Telegram Moscow CSS',
  'locale.label': 'Site language',
} satisfies Record<UiKey, string>;

export const ui: Record<Locale, Record<UiKey, string>> = { ru, en };
