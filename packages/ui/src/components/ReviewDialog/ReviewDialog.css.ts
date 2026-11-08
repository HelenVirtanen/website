import { globalStyle, style } from '@vanilla-extract/css';
import { dimensions, vars } from '@moscowcss/design-system';

export const root = style({
  boxSizing: 'border-box',
  width: `min(100% - ${vars.spacing.l}, ${vars.size.reviewDialogWidth})`,
  maxWidth: 'none',
  maxHeight: `calc(100dvh - ${vars.spacing.l})`,
  padding: 0,
  border: 'none',
  overflow: 'auto',
  color: vars.color.text,
  background: vars.color.background,
  boxShadow: `inset 0 0 0 ${vars.border.width.thin} ${vars.color.surfaceDarkEdge}`,
  selectors: {
    '&::backdrop': {
      background: vars.color.backdrop,
    },
  },
});

// Шапка окна того же цвета, что листок на стене. Синее кольцо на синем листке пропало бы, поэтому кольцо — цвета текста.
export const head = style({
  display: vars.display.flex,
  alignItems: 'flex-start',
  gap: vars.spacing.m,
  padding: vars.padding.l,
  vars: { [vars.color.focus]: 'currentColor' },
});

export const profile = style({
  flexGrow: 1,
  display: vars.display.flex,
  alignItems: vars.alignItems.center,
  gap: vars.spacing.m,
  minWidth: 0,
  color: 'inherit',
  textDecoration: 'none',
});

globalStyle(`a${profile}:hover h2`, { textDecorationLine: 'underline' });

export const photo = style({
  flexShrink: 0,
  display: vars.display.block,
  width: vars.size.reviewPhotoLarge,
  height: vars.size.reviewPhotoLarge,
  objectFit: 'cover',
  clipPath: dimensions.octagon,
});

export const who = style({
  flexGrow: 1,
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.spacing.xs,
  minWidth: 0,
});

export const name = style({
  margin: 0,
  font: vars.font.shorthand.h3,
  overflowWrap: 'anywhere',
});

export const caption = style({
  margin: 0,
  font: vars.font.shorthand.caption,
});

export const close = style({
  flexShrink: 0,
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  width: vars.size.hitTarget,
  height: vars.size.hitTarget,
  color: 'inherit',
});

export const closeIcon = style({
  display: vars.display.block,
  width: vars.size.burgerIcon,
  height: vars.size.burgerIcon,
});

export const content = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.spacing.l,
  padding: vars.padding.l,
});

export const gallery = style({
  display: vars.display.grid,
  gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${vars.size.reviewGalleryMin}), 1fr))`,
  gap: vars.spacing.s,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const galleryImage = style({
  display: vars.display.block,
  width: '100%',
  height: 'auto',
});

export const footer = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  alignItems: vars.alignItems.center,
  gap: vars.spacing.m,
});

export const copy = style({
  boxSizing: 'border-box',
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  minHeight: vars.size.hitTarget,
  paddingInline: vars.padding.l,
  border: `${vars.border.width.thin} ${vars.border.style.solid} currentColor`,
  borderRadius: vars.radius.large,
  color: 'inherit',
  font: vars.font.shorthand.caption,
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

export const status = style({
  font: vars.font.shorthand.caption,
});
