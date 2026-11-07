import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const root = style({
  display: 'contents',
});

// Окно на весь экран: фото на тёмной подложке, как в просмотрщике.
export const dialog = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 'none',
  height: '100%',
  maxHeight: 'none',
  margin: 0,
  padding: vars.padding.l,
  border: 'none',
  color: vars.color.onSurfaceDark,
  background: 'transparent',
  vars: { [vars.color.focus]: vars.color.focusOnInverse },
  selectors: {
    '&[open]': {
      display: vars.display.flex,
      flexDirection: vars.flexDirection.column,
      alignItems: vars.alignItems.center,
      justifyContent: vars.justifyContent.center,
      gap: vars.spacing.m,
    },
    '&::backdrop': {
      background: `color-mix(in srgb, ${vars.color.blackBg} 94%, transparent)`,
    },
  },
});

export const figure = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: vars.alignItems.center,
  gap: vars.spacing.s,
  minHeight: 0,
  margin: 0,
});

export const image = style({
  display: vars.display.block,
  maxWidth: '100%',
  maxHeight: `calc(100dvh - ${vars.size.hitTarget} * 4)`,
  objectFit: 'contain',
});

export const caption = style({
  maxWidth: vars.size.reviewDialogWidth,
  font: vars.font.shorthand.caption,
  textAlign: 'center',
});

const iconButton = {
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
} as const;

export const closeButton = style({
  ...iconButton,
  position: vars.position.absolute,
  insetBlockStart: vars.spacing.s,
  insetInlineEnd: vars.spacing.s,
});

globalStyle(`${closeButton} svg`, {
  width: vars.size.burgerIcon,
  height: vars.size.burgerIcon,
});

export const nav = style({
  display: vars.display.flex,
  gap: vars.spacing.l,
  selectors: {
    '&[hidden]': { display: vars.display.none },
  },
});

export const navButton = style({
  ...iconButton,
  paddingInline: vars.padding.s,
});

globalStyle(`${navButton} svg`, {
  width: vars.size.sliderArrowWidth,
  height: vars.size.sliderArrowHeight,
});

export const prevIcon = style({
  transform: 'scaleX(-1)',
});
