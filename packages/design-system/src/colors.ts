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
    brand: null, // фирменный красный: значки сайта
    focus: null, // кольцо фокуса
    focusOnInverse: null, // кольцо на чёрном блоке
    border: null, // рамка
    divider: null, // разделитель (например, нижняя граница NavBar)
    cardText: null, // карточка партнёра
    cardBackground: null,
    cardWave: null, // декоративная волна на карточке
    // Инвертированная секция (партнёрский блок): фон, текст и рамки на тёмном фоне.
    surfaceDark: null,
    onSurfaceDark: null,
    borderOnDark: null,
    accentOnInverse: null, // ссылки на чёрном блоке
    surfaceDarkEdge: null, // граница чёрной карточки: на графите она иначе сливается с фоном
    partnerAccent: null,
    partnerBanner: null,
    // Блок партнёра в цветах Школы 21: одинаков в обеих темах.
    schoolSurface: null,
    onSchoolSurface: null,
    schoolAccent: null,
    schoolCard: null,
    onSchoolCard: null,
    schoolPanel: null,
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
    decorMuted: null, // падающие фигуры поверх текста
    backdrop: null, // затемнение под модальным окном
    tagSky: null,
    onTagSky: null,
    founder: null, // основатель сообщества: свой цвет, больше нигде не встречается
    onFounder: null,
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
    brand: palette.redDeep,
    focus: palette.blue,
    focusOnInverse: palette.bluePale,
    border: palette.ink,
    divider: palette.gray300,
    cardText: palette.black,
    cardBackground: palette.white,
    cardWave: palette.gray300,
    surfaceDark: palette.black,
    onSurfaceDark: palette.white,
    borderOnDark: palette.white,
    accentOnInverse: palette.pink,
    surfaceDarkEdge: 'transparent',
    partnerAccent: palette.green,
    partnerBanner: palette.pink,
    schoolSurface: palette.school21Ink,
    onSchoolSurface: palette.white,
    schoolAccent: palette.school21Green,
    schoolCard: palette.school21Mist,
    onSchoolCard: palette.school21Ink,
    schoolPanel: palette.school21Slate,
    surfaceDarkMuted: palette.gray700,
    dividerSoft: palette.inkA20,
    link: palette.blue,
    buttonHover: palette.blue,
    onButtonHover: palette.white,
    disabled: palette.gray300,
    speakerAccent: palette.pink,
    pastNote: palette.orangeDeep,
    decorMuted: palette.gray500,
    backdrop: palette.blackA50,
    tagSky: palette.sky,
    onTagSky: palette.ink,
    founder: palette.violet,
    onFounder: palette.white,
    tagBlue: palette.blue,
    onTagBlue: palette.white,
    tagYellow: palette.yellow,
    onTagYellow: palette.ink,
    tagRed: palette.red,
    onTagRed: palette.ink,
    tagOrange: palette.orange,
    onTagOrange: palette.ink,
  },
};

// Значения палитры — литералы, поэтому тип шире, чем у светлой темы.
const dark: { color: Record<keyof typeof light.color, string> } = {
  color: {
    ...light.color,
    background: palette.graphite,
    text: palette.paper,
    info: palette.bluePale,
    focus: palette.bluePale,
    border: palette.paper,
    divider: palette.graphiteLine,
    cardText: palette.paper,
    cardBackground: palette.graphite,
    cardWave: palette.graphiteText,
    // Чёрные блоки (партнёр, карточки организаторов) остаются чёрными и в тёмной теме.
    surfaceDarkEdge: palette.paper,
    surfaceDarkMuted: palette.graphiteMuted,
    dividerSoft: palette.paperA20,
    link: palette.bluePale,
    buttonHover: palette.bluePale,
    onButtonHover: palette.graphiteDeep,
    disabled: palette.graphiteDisabled,
    tagBlue: palette.blueSoft,
    pastNote: palette.orange,
  },
};

export const colors = { contract, light, dark };
