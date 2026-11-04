import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const root = style({
  display: vars.display.block,
});

export const list = style({
  display: vars.display.flex,
  alignItems: vars.alignItems.center,
  gap: vars.adaptive.navLangGap,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  font: vars.font.shorthand.navMono,
});

export const item = style({
  display: vars.display.flex,
  alignItems: vars.alignItems.center,
  gap: vars.adaptive.navLangGap,
  selectors: {
    '&:not(:first-child)::before': {
      content: '"/"',
      opacity: 0.3,
    },
  },
});

export const link = style({
  boxSizing: 'border-box',
  display: vars.display.flex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  minWidth: vars.size.hitTarget,
  minHeight: vars.size.hitTarget,
  color: vars.color.text,
  textDecoration: 'none',
  textTransform: 'uppercase',
  opacity: 0.4,
  transitionProperty: 'opacity',
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.standard,
  selectors: {
    '&:hover': {
      opacity: 1,
    },
    '&[aria-current="page"]': {
      opacity: 1,
    },
  },
});
