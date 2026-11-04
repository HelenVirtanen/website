import { palette } from './palette';

// Семантический слой цвета: токены названы по смыслу, значения берутся из палитры.
// Компоненты обращаются только к `vars.color.*`, а не к палитре напрямую.
const contract = {
  color: {
    background: null,
    white: null,
    text: null,
    blackText: null,
    blackBg: null,
    success: null,
    danger: null,
    info: null,
    warning: null,
    focus: null, // кольцо фокуса
    border: null, // рамка
    divider: null, // разделитель (например, нижняя граница NavBar)
    // Инвертированная секция (партнёрский блок): фон, текст и рамки на тёмном фоне.
    surfaceDark: null,
    onSurfaceDark: null,
    borderOnDark: null,
    partnerAccent: null,
    partnerBanner: null,
    surfaceDarkMuted: null,
    dividerSoft: null, // мягкий разделитель на светлом фоне
    link: null,
    // Наведение на кнопку: подложка и текст на ней.
    buttonHover: null,
    onButtonHover: null,
    disabled: null,
    speakerAccent: null,
    pastNote: null, // пометка «митап уже прошёл»
    // Цветные плашки: подложка и текст на ней.
    tagSky: null,
    onTagSky: null,
    tagBlue: null,
    onTagBlue: null,
    tagYellow: null,
    onTagYellow: null,
    tagRed: null,
    onTagRed: null,
    tagOrange: null,
    onTagOrange: null,
  },
} as const;

const light = {
  color: {
    background: palette.white,
    white: palette.white,
    text: palette.ink,
    blackText: palette.black,
    blackBg: palette.black,
    success: palette.green,
    danger: palette.red,
    info: palette.blue,
    warning: palette.yellow,
    focus: palette.redDeep,
    border: palette.ink,
    divider: palette.gray300,
    surfaceDark: palette.black,
    onSurfaceDark: palette.white,
    borderOnDark: palette.white,
    partnerAccent: palette.green,
    partnerBanner: palette.pink,
    surfaceDarkMuted: palette.gray700,
    dividerSoft: palette.inkA20,
    link: palette.blue,
    buttonHover: palette.blue,
    onButtonHover: palette.white,
    disabled: palette.gray300,
    speakerAccent: palette.pink,
    pastNote: palette.orange,
    tagSky: palette.sky,
    onTagSky: palette.ink,
    tagBlue: palette.blue,
    onTagBlue: palette.white,
    tagYellow: palette.yellow,
    onTagYellow: palette.ink,
    tagRed: palette.red,
    onTagRed: palette.white,
    tagOrange: palette.orange,
    onTagOrange: palette.white,
  },
};

// Пока dark повторяет light — при вводе тёмной темы меняем ТОЛЬКО значения здесь.
const dark: typeof light = {
  color: { ...light.color },
};

export const colors = { contract, light, dark };
