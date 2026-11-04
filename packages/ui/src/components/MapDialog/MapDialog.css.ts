import { globalStyle, style } from '@vanilla-extract/css';
import { dimensions, vars } from '@moscowcss/design-system';

export const root = style({
  display: vars.display.block,
});

const action = {
  boxSizing: 'border-box',
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  minHeight: vars.size.hitTarget,
  paddingInline: vars.padding.l,
  border: `${vars.border.width.thin} ${vars.border.style.solid} currentColor`,
  borderRadius: vars.radius.large,
  background: 'transparent',
  color: 'inherit',
  font: vars.font.shorthand.caption,
  textDecoration: 'none',
  cursor: 'pointer',
  transitionProperty: 'background-color, color',
  transitionDuration: vars.motion.duration.fast,
  transitionTimingFunction: vars.motion.easing.standard,
} as const;

// Цвет от блока вокруг: кнопка стоит на чёрном партнёрском блоке в обеих темах.
export const trigger = style({
  ...action,
  selectors: {
    '&[hidden]': {
      display: vars.display.none,
    },
  },
});

export const dialog = style({
  boxSizing: 'border-box',
  width: `min(100% - ${vars.spacing.l}, ${vars.size.mapDialogWidth})`,
  maxWidth: 'none',
  maxHeight: `calc(100dvh - ${vars.spacing.l})`,
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.large,
  overflow: 'auto',
  color: vars.color.text,
  background: vars.color.background,
  boxShadow: `inset 0 0 0 ${vars.border.width.thin} ${vars.color.surfaceDarkEdge}`,
  // Окно лежит внутри чёрного блока и наследует его кольцо; ссылочный синий на фоне окна читается в обеих темах.
  vars: { [vars.color.focus]: vars.color.link },
  selectors: {
    '&::backdrop': {
      background: vars.color.backdrop,
    },
  },
});

export const content = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.spacing.m,
  padding: vars.padding.l,
});

export const head = style({
  display: vars.display.flex,
  alignItems: 'flex-start',
  justifyContent: vars.justifyContent.spaceBetween,
  gap: vars.spacing.m,
});

export const title = style({
  margin: 0,
  font: vars.font.shorthand.h3,
});

export const closeButton = style({
  flexShrink: 0,
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  minWidth: vars.size.hitTarget,
  minHeight: vars.size.hitTarget,
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
});

globalStyle(`${closeButton} svg`, {
  display: vars.display.block,
  width: vars.size.burgerIcon,
  height: vars.size.burgerIcon,
});

export const frame = style({
  width: '100%',
  aspectRatio: dimensions.mapFrame.aspectRatio,
  minHeight: vars.size.mapDialogMinHeight,
  background: vars.color.surfaceDarkMuted,
});

globalStyle(`${frame} iframe`, {
  display: vars.display.block,
  width: '100%',
  height: '100%',
  border: 'none',
});

export const providersTitle = style({
  margin: 0,
  font: vars.font.shorthand.caption,
});

export const linkList = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  gap: vars.spacing.s,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const providerLink = style({
  ...action,
  selectors: {
    '&:hover': {
      color: vars.color.onButtonHover,
      background: vars.color.buttonHover,
      borderColor: vars.color.buttonHover,
    },
  },
});
