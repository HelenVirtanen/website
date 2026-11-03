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
    // Акцентная кнопка (CTA): подложка, текст на ней и цвет кольца фокуса.
    action: null,
    onAction: null,
    actionHover: null,
    focus: null,
    border: null, // рамка
    divider: null, // разделитель (например, нижняя граница NavBar)
    tgBorder: null, // граница кнопки с сслыкой на телеграм
    // Инвертированная секция (партнёрский блок): фон, текст и рамки на тёмном фоне.
    surfaceDark: null,
    onSurfaceDark: null,
    borderOnDark: null,
    partnerAccent: null,
    partnerBanner: null,
    surfaceDarkMuted: null,
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
    action: palette.ink,
    onAction: palette.white,
    actionHover: palette.gray700,
    focus: palette.redDeep,
    border: palette.ink,
    divider: palette.gray300,
    tgBorder: palette.blue300,
    surfaceDark: palette.black,
    onSurfaceDark: palette.white,
    borderOnDark: palette.white,
    partnerAccent: palette.green,
    partnerBanner: palette.pink,
    surfaceDarkMuted: palette.gray700,
  },
};

// Пока dark повторяет light — при вводе тёмной темы меняем ТОЛЬКО значения здесь.
const dark: typeof light = {
  color: { ...light.color },
};

export const colors = { contract, light, dark };
