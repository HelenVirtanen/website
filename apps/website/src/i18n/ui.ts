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
  'hero.title': 'Moscow\u00A0CSS',
  'hero.address': 'Адрес: {address}',
  'hero.dateTime': '{day} {year} в {time}',
  'hero.passport': 'Вход строго по паспорту',
  'hero.registration': 'Регистрация',
  'hero.onlineNote': 'Для онлайн просмотра регистрация не нужна',
  'hero.watchStream': 'Смотри трансляцию',
  'hero.watchRecording': 'Смотреть запись',
  'hero.pastNote': 'Митап уже прошёл',
  'date.long': '{day} {year}',
  'about.title': 'О митапе',
  'program.title': 'Программа',
  'program.hint':
    'Задай вопрос спикеру на митапе в чате MoscowCSS, обязательно укажи тег #вопросспикеру',
  'partner.qrLabel': 'QR-код {handle}',
  'route.photoFirst': 'Фото маршрута 1',
  'route.photoSecond': 'Фото маршрута 2',
  'route.video': 'Видео маршрута',
  'faq.title': 'ЧАВО',
  'events.past': 'Прошедшие митапы',
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
  'hero.title': 'Moscow\u00A0CSS',
  'hero.address': 'Address: {address}',
  'hero.dateTime': '{day}, {year} at {time}',
  'hero.passport': 'Admission strictly by passport',
  'hero.registration': 'Registration',
  'hero.onlineNote': 'No registration is needed to watch online',
  'hero.watchStream': 'Watch the broadcast',
  'hero.watchRecording': 'Watch the recording',
  'hero.pastNote': 'This meetup has already taken place',
  'date.long': '{day}, {year}',
  'about.title': 'About the meetup',
  'program.title': 'Program',
  'program.hint':
    'Ask the speaker a question at the meetup in the MoscowCSS chat and be sure to include the tag #moscowcss_questions',
  'partner.qrLabel': 'QR code {handle}',
  'route.photoFirst': 'Route photo 1',
  'route.photoSecond': 'Route photo 2',
  'route.video': 'Route video',
  'faq.title': 'FAQ',
  'events.past': 'Past meetups',
} satisfies Record<UiKey, string>;

export const ui: Record<Locale, Record<UiKey, string>> = { ru, en };
