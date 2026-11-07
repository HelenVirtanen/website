import { globalStyle, style } from '@vanilla-extract/css';
import { dimensions, vars, media } from '@moscowcss/design-system';
import { inner as layoutInner, sectionPadding } from '../sections/sectionLayout.css';

// Общий язык страниц митапа и спикера: крупный герой как на главной, чипы, таблетки ссылок, карточки.

export const main = style([
  sectionPadding,
  {
    color: vars.color.text,
  },
]);

export const inner = style([
  layoutInner,
  {
    gap: vars.layout.gap.xxl,
  },
]);

export const hero = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.xxl,
  '@media': {
    [media.laptop]: {
      flexDirection: vars.flexDirection.row,
      alignItems: vars.alignItems.center,
    },
  },
});

export const heroText = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: 'flex-start',
  gap: vars.layout.gap.l,
  minWidth: 0,
  flex: '1 1 auto',
});

export const topRow = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.spaceBetween,
  gap: vars.layout.gap.m,
  width: '100%',
});

// Пунктирный чип, как «31 МИТАП» в Hero главной.
export const chip = style({
  boxSizing: 'border-box',
  paddingBlock: vars.adaptive.heroChipPaddingBlock,
  paddingInline: vars.adaptive.heroChipPaddingInline,
  border: `${vars.border.width.thin} ${vars.border.style.dashed} ${vars.color.border}`,
  borderRadius: vars.adaptive.heroChipRadius,
  font: vars.font.shorthand.heroChip,
  textTransform: 'uppercase',
});

export const date = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: 'flex-end',
  margin: 0,
  color: vars.color.info,
  font: vars.font.shorthand.heroDate,
});

export const dateTime = style({
  color: vars.color.text,
  font: vars.font.shorthand.heroMeta,
});

export const title = style({
  margin: 0,
  font: vars.font.shorthand.websiteTitle,
  letterSpacing: vars.font.letterSpacing.heading,
  overflowWrap: 'anywhere',
});

export const lead = style({
  margin: 0,
  maxWidth: vars.size.reviewDialogWidth,
  font: vars.font.shorthand.heroLead,
});

export const slashes = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  columnGap: vars.layout.gap.l,
  rowGap: vars.spacing.xs,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  font: vars.font.shorthand.heroMeta,
});

globalStyle(`${slashes} > li::before`, { content: '"/ "' });

// Цветные плашки тем, как падающие теги Hero.
export const tags = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  gap: vars.spacing.s,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const tag = style({
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  minHeight: vars.size.hitTarget,
  paddingInline: vars.adaptive.heroTagPaddingInline,
  borderRadius: vars.radius.pill,
  font: vars.font.shorthand.heroTag,
  textDecoration: 'none',
});

const tone = (background: string, color: string) => style({ background, color });

export const tagTones = [
  tone(vars.color.tagSky, vars.color.onTagSky),
  tone(vars.color.tagBlue, vars.color.onTagBlue),
  tone(vars.color.tagYellow, vars.color.onTagYellow),
  tone(vars.color.tagRed, vars.color.onTagRed),
  tone(vars.color.tagOrange, vars.color.onTagOrange),
];

// Ссылки страницы — контурные таблетки в один ряд.
export const actions = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  gap: vars.spacing.s,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const action = style({
  boxSizing: 'border-box',
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  minHeight: vars.size.hitTarget,
  paddingInline: vars.padding.xl,
  border: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.border}`,
  borderRadius: vars.radius.pill,
  color: vars.color.text,
  font: vars.font.shorthand.buttonLabel,
  textDecoration: 'none',
  transitionProperty: 'background-color, color, border-color',
  transitionDuration: vars.motion.duration.fast,
  transitionTimingFunction: vars.motion.easing.standard,
  selectors: {
    '&:hover': {
      color: vars.color.onButtonHover,
      background: vars.color.buttonHover,
      borderColor: vars.color.buttonHover,
    },
  },
});

// Главная ссылка (регистрация) — залитая.
export const actionPrimary = style({
  color: vars.color.background,
  background: vars.color.text,
  borderColor: vars.color.text,
});

// Портрет: восьмиугольник с розовой подложкой, сдвинутой как тень — по клику открывается крупно.
export const portrait = style({
  position: vars.position.relative,
  flexShrink: 0,
  display: vars.display.block,
  width: `min(100%, ${vars.size.detailPortrait})`,
  aspectRatio: '1',
  selectors: {
    '&::before': {
      content: '""',
      position: vars.position.absolute,
      inset: vars.inset.zero,
      translate: `${vars.spacing.l} ${vars.spacing.l}`,
      background: vars.color.speakerAccent,
      clipPath: dimensions.octagon,
    },
  },
});

export const portraitImage = style({
  position: vars.position.relative,
  display: vars.display.block,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  clipPath: dimensions.octagon,
  background: vars.color.dividerSoft,
});

export const prose = style({
  maxWidth: vars.size.reviewDialogWidth,
  font: vars.font.shorthand.body,
});

// Текст «как добраться» и другое тело митапа — плашкой, чтобы не терялся между героем и программой.
export const panel = style({
  padding: vars.padding.xxl,
  border: `${vars.border.width.thin} ${vars.border.style.dashed} ${vars.color.border}`,
});

export const block = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.l,
});

export const cards = style({
  display: vars.display.grid,
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))',
  gap: vars.layout.gap.l,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

// Галерея: первый снимок крупно, остальные плиткой.
export const gallery = style({
  display: vars.display.grid,
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gridAutoRows: vars.size.galleryRow,
  gap: vars.spacing.s,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  '@media': {
    [media.laptop]: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
  },
});

export const galleryItem = style({
  minWidth: 0,
  selectors: {
    '&:first-child': { gridColumn: 'span 2', gridRow: 'span 2' },
  },
});

export const galleryLink = style({
  display: vars.display.block,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

export const galleryImage = style({
  display: vars.display.block,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transitionProperty: 'scale',
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.standard,
  selectors: {
    [`${galleryLink}:hover &`]: { scale: '1.04' },
  },
});
