import { globalStyle, style } from '@vanilla-extract/css';
import { vars, media } from '@moscowcss/design-system';
import { inner as layoutInner, sectionPadding } from './sectionLayout.css';

// Цвета плашки одинаковы в обеих темах сайта: это фирменные цвета партнёра.
export const section = style([
  sectionPadding,
  {
    color: vars.color.onSchoolSurface,
    background: vars.color.schoolSurface,
    overflow: 'hidden',
    vars: { [vars.color.focus]: vars.color.schoolAccent },
  },
]);

export const inner = style([
  layoutInner,
  {
    gap: vars.layout.gap.xxl,
  },
]);

// Ступенька из пикселей, как в логотипе «21»: квадраты «высыпаются» из угла карточки с QR.
export const pixels = style({
  position: vars.position.absolute,
  insetBlockStart: `calc(${vars.size.schoolPixelSmall} * -2)`,
  insetInlineEnd: `calc(${vars.size.schoolPixelSmall} * -2)`,
  width: `calc(${vars.size.schoolPixelSmall} * 5)`,
  height: `calc(${vars.size.schoolPixelSmall} * 4)`,
  pointerEvents: 'none',
});

export const pixel = style({
  fill: vars.color.onSchoolSurface,
  opacity: 0.12,
});

export const pixelAccent = style({
  fill: vars.color.schoolAccent,
  opacity: 1,
});

export const intro = style({
  position: vars.position.relative,
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.xxl,
  '@media': {
    [media.laptop]: {
      flexDirection: vars.flexDirection.row,
      alignItems: 'flex-end',
      justifyContent: vars.justifyContent.spaceBetween,
    },
  },
});

export const introText = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: 'flex-start',
  gap: vars.layout.gap.l,
  maxWidth: vars.size.reviewDialogWidth,
});

export const brand = style({
  margin: 0,
});

export const brandLogo = style({
  display: vars.display.block,
  width: vars.size.partnerLogoSquare,
  height: vars.size.partnerLogoSquare,
});

export const headline = style({
  margin: 0,
  font: vars.font.shorthand.h1,
  letterSpacing: vars.font.letterSpacing.heading,
  overflowWrap: 'anywhere',
});

// Кнопка-таблетка, как «Поступить» на их сайте.
export const pill = style({
  boxSizing: 'border-box',
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  minHeight: `calc(${vars.size.hitTarget} * 1.25)`,
  paddingInline: vars.padding.xxl,
  borderRadius: vars.radius.pill,
  color: vars.color.onSchoolCard,
  background: vars.color.schoolAccent,
  font: vars.font.shorthand.h4,
  textDecoration: 'none',
  transitionProperty: 'background-color',
  transitionDuration: vars.motion.duration.fast,
  transitionTimingFunction: vars.motion.easing.standard,
  selectors: {
    '&:hover': { background: vars.color.schoolCard },
  },
});

export const qrCard = style({
  position: vars.position.relative,
  flexShrink: 0,
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: vars.alignItems.center,
  gap: vars.spacing.m,
  width: 'fit-content',
  margin: 0,
  padding: vars.padding.l,
  borderRadius: vars.radius.card,
  color: vars.color.onSchoolCard,
  background: vars.color.schoolCard,
});

export const qrCode = style({
  display: vars.display.block,
  width: vars.size.partnerQrCodeWidth,
  height: vars.size.partnerQrCodeWidth,
});

// QR — тёмные модули на светлой подложке: инверсный код читают не все камеры.
export const qrBackground = style({ fill: vars.color.schoolCard });
export const qrModules = style({ fill: vars.color.onSchoolCard });

export const qrCaption = style({
  maxWidth: vars.size.partnerQrCodeWidth,
  font: vars.font.shorthand.caption,
  textAlign: 'center',
});

// Рассказ о партнёре: подзаголовок, крупный тезис слева и пояснение справа.
export const about = style({
  display: vars.display.grid,
  gap: vars.layout.gap.l,
  paddingBlockStart: vars.layout.gap.xxl,
  borderBlockStart: `${vars.border.width.thin} ${vars.border.style.solid} color-mix(in srgb, ${vars.color.onSchoolSurface} 20%, transparent)`,
  '@media': {
    [media.laptop]: {
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      columnGap: vars.layout.gap.xxl,
    },
  },
});

globalStyle(`${about} > *`, { margin: 0 });

globalStyle(`${about} > h3`, {
  gridColumn: '1 / -1',
  color: vars.color.schoolAccent,
  font: vars.font.shorthand.caption,
  textTransform: 'uppercase',
  letterSpacing: vars.font.letterSpacing.ui,
});

globalStyle(`${about} > p:first-of-type`, {
  font: vars.font.shorthand.h2,
  letterSpacing: vars.font.letterSpacing.heading,
});

globalStyle(`${about} > p:not(:first-of-type)`, {
  font: vars.font.shorthand.programDescription,
  letterSpacing: vars.font.letterSpacing.figmaWide,
});

export const stats = style({
  display: vars.display.grid,
  gridTemplateColumns: '1fr',
  // Цифр четыре: 2×2 или в ряд, чтобы ни одна карточка не повисла в строке одна.
  '@media': {
    [media.tablet]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    [media.desktop]: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
  },
  gap: vars.spacing.m,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const stat = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  justifyContent: vars.justifyContent.spaceBetween,
  gap: vars.layout.gap.l,
  padding: vars.padding.xxl,
  borderRadius: vars.radius.card,
  color: vars.color.onSchoolCard,
  background: vars.color.schoolCard,
  selectors: {
    // Первая карточка — зелёная, как акцентные плашки на их сайте.
    '&:first-child': { background: vars.color.schoolAccent },
  },
  '@media': {
    // На телефоне карточки идут столбцом: одинаковая высота им не нужна.
    [media.tablet]: { minHeight: vars.size.schoolStatHeight },
  },
});

export const statValue = style({
  margin: 0,
  font: vars.font.shorthand.websiteTitle,
  letterSpacing: vars.font.letterSpacing.heading,
});

export const statLabel = style({
  margin: 0,
  font: vars.font.shorthand.programDescription,
  letterSpacing: vars.font.letterSpacing.figmaWide,
});

// Адрес — отдельная плашка, как контакты на странице кампуса.
export const place = style({
  display: vars.display.flex,
  alignItems: 'flex-start',
  gap: vars.layout.gap.l,
  padding: vars.padding.xxl,
  borderRadius: vars.radius.card,
  background: vars.color.schoolPanel,
});

export const placeIcon = style({
  flexShrink: 0,
  width: vars.size.schoolPixel,
  height: vars.size.schoolPixel,
  color: vars.color.schoolAccent,
});

export const placeText = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: 'flex-start',
  gap: vars.spacing.m,
});

globalStyle(`${placeText} > *`, { margin: 0 });

globalStyle(`${placeText} > h2`, {
  color: vars.color.schoolAccent,
  font: vars.font.shorthand.caption,
  textTransform: 'uppercase',
  letterSpacing: vars.font.letterSpacing.ui,
});

globalStyle(`${placeText} > p`, {
  font: vars.font.shorthand.h3,
  letterSpacing: vars.font.letterSpacing.heading,
});

// Ссылка на карту — тоже таблетка, но контурная: главная кнопка блока — Telegram.
globalStyle(`${placeText} a`, {
  boxSizing: 'border-box',
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  minHeight: vars.size.hitTarget,
  paddingInline: vars.padding.xl,
  border: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.schoolAccent}`,
  borderRadius: vars.radius.pill,
  color: vars.color.schoolAccent,
  font: vars.font.shorthand.caption,
  textDecoration: 'none',
});

globalStyle(`${placeText} a:hover`, {
  color: vars.color.onSchoolCard,
  background: vars.color.schoolAccent,
});
