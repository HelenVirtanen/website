import { globalStyle, style } from '@vanilla-extract/css';
import { dimensions, vars, media } from '@moscowcss/design-system';
import { inner as layoutInner, sectionPadding } from './sectionLayout.css';

export const section = style([
  sectionPadding,
  {
    color: vars.color.onSurfaceDark,
    background: vars.color.surfaceDark,
  },
]);

export const hero = style({
  position: vars.position.relative,
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: vars.alignItems.center,
  overflow: 'hidden',
});

export const heroWave = style({
  position: vars.position.absolute,
  top: vars.inset.zero,
  left: '50%',
  zIndex: 0,
  width: '100%',
  maxWidth: '90rem',
  color: vars.color.partnerBanner,
  pointerEvents: 'none',
  transform: 'translateX(-50%)',
});

globalStyle(`${heroWave} svg`, {
  display: vars.display.block,
  width: '100%',
  height: 'auto',
});

export const inner = style([
  layoutInner,
  {
    gap: vars.spacing['4xl'],
  },
]);

export const partnerHeader = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.l,
  alignItems: vars.alignItems.center,
  textAlign: 'center',
});

export const brandTitle = style({
  margin: 0,
  width: '100%',
});

export const brandLogo = style({
  display: vars.display.block,
  width: '100%',
  maxWidth: vars.size.partnerLogoWidth,
  height: 'auto',
  marginInline: 'auto',
  '@media': {
    [media.desktop]: {
      width: vars.size.partnerLogoWidth,
      height: vars.size.partnerLogoHeight,
      marginTop: `calc(${vars.size.partnerLogoOffsetTop} - ${vars.padding['4xl']})`,
    },
  },
});

// Партнёр без логотипа: название крупным кеглем на месте логотипа.
export const brandName = style({
  margin: 0,
  font: vars.font.shorthand.partnerAddress,
  letterSpacing: vars.font.letterSpacing.figmaWide,
  textTransform: 'uppercase',
});

export const handle = style({
  margin: 0,
  font: vars.font.shorthand.programTalkTitle,
  letterSpacing: vars.font.letterSpacing.figmaWide,
  textTransform: 'uppercase',
});

export const tagline = style({
  margin: 0,
  maxWidth: '28rem',
  font: vars.font.shorthand.programDescription,
  letterSpacing: vars.font.letterSpacing.figmaWide,
});

// QR — тёмные модули на светлой подложке: инверсный код читают не все камеры.
export const qrBackground = style({ fill: vars.color.white });
export const qrModules = style({ fill: vars.color.blackText });

export const qr = style({
  display: vars.display.block,
  // Код квадратный: сторона — ширина из токена, высота равна ей.
  width: vars.size.partnerQrCodeWidth,
  height: vars.size.partnerQrCodeWidth,
  marginInline: 'auto',
});



export const cardsRow = style({
  position: vars.position.relative,
  width: '100%',
});

export const cardsGrid = style({
  position: vars.position.relative,
  zIndex: 1,
  display: vars.display.grid,
  gap: vars.layout.gap.m,
  gridTemplateColumns: '1fr',
  alignItems: 'stretch',
  '@media': {
    [media.tablet]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    [media.desktop]: {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    },
  },
});

export const directionsBlock = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.xxl,
});

// Текст «как добраться» приходит отрендеренным Markdown-ом тела митапа: заголовок, адрес,
// список подсказок и подпись к фото маршрута. Контейнер — display: contents, поэтому его дети
// становятся элементами колонки `directionsBlock`: карта встаёт между списком и подписью (order).
export const directionsProse = style({
  display: 'contents',
});

globalStyle(`${directionsProse} > h2`, {
  width: 'fit-content',
  padding: `${vars.padding.xl} ${vars.padding.xxxl} ${vars.layout.inset.l} ${vars.padding.xxxl}`,
  color: vars.color.onSurfaceDark,
  font: vars.font.shorthand.subtitle,
  letterSpacing: 'normal',
  border: `${vars.border.width.thick} ${vars.border.style.dashed} ${vars.color.borderOnDark}`,
  '@media': {
    [media.tablet]: {
      font: vars.font.shorthand.blockTitle,
    },
  },
});

globalStyle(`${directionsProse} > p`, {
  margin: 0,
  font: vars.font.shorthand.partnerAddress,
  letterSpacing: vars.font.letterSpacing.figmaWide,
});

globalStyle(`${directionsProse} > ul`, {
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.spacing.s,
  margin: 0,
  paddingLeft: vars.layout.inset.l,
  font: vars.font.shorthand.partnerDirectionsHint,
  letterSpacing: vars.font.letterSpacing.figmaWide,
});

globalStyle(`${directionsProse} > ul > li`, {
  margin: 0,
});

globalStyle(`${directionsProse} > p:last-child`, {
  order: 1,
  font: vars.font.shorthand.partnerDirectionsHint,
});

export const mediaRow = style({
  order: 2,
  display: vars.display.grid,
  gap: vars.layout.gap.m,
  gridTemplateColumns: '1fr',
  '@media': {
    [media.tablet]: {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
});

export const mapFrame = style({
  width: '100%',
  aspectRatio: dimensions.mapFrame.aspectRatio,
  border: `${vars.border.width.superThick} ${vars.border.style.solid} ${vars.color.onSurfaceDark}`,
});

export const mediaTileFrame = style({
  width: '100%',
  aspectRatio: dimensions.mediaTile.aspectRatio,
  border: `${vars.border.width.superThick} ${vars.border.style.solid} ${vars.color.onSurfaceDark}`,
});
