// Слой 1 — примитивы: сырые значения, названы по своей сути. В компонентах
// напрямую не используются — их читают только семантические токены (colors.ts).
export const palette = {
  // Нейтральные
  white: '#FFFFFF',
  black: '#000000',
  ink: '#0B0400', // фирменный тёплый «чёрный»
  gray300: '#C4C4C4',
  gray500: '#9B9B9B',
  gray700: '#494949',

  // Графит и тёплый светлый — основа тёмной темы
  graphite: '#23252B',
  graphiteDeep: '#16181D',
  graphiteLine: '#4A4D56',
  graphiteMuted: '#3A3D45',
  graphiteDisabled: '#6B6E77',
  graphiteText: '#A6A8B0',
  paper: '#ECEBE6',

  // Полупрозрачные из набора — альфа зашита в значение (hex8)
  blackA50: '#00000080',
  blackA30: '#0000004D',
  whiteA75: '#FFFFFFBF',
  inkA20: '#0B040033',
  paperA20: '#ECEBE633',

  // Цветные
  red: '#F05133',
  redDeep: '#CA3035', // brand
  orange: '#F16528',
  orangeDeep: '#C2410C',
  yellow: '#F9DC3E',
  school21Ink: '#1D2633',
  school21Green: '#00DB00',
  school21Mist: '#F4F4F9',
  school21Slate: '#334048',
  green: '#70DC55',
  greenDeep: '#468834',
  sky: '#8ED6FB',
  blue: '#3845CF',
  blue300: '#002E41',
  bluePale: '#9AA5FF',
  blueSoft: '#5563E8',
  magenta: '#C75FB8',
  pink: '#FF4E8D',
} as const;
