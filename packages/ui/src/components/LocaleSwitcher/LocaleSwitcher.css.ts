import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const root = style({
  display: vars.display.block,
});

export const list = style({
  display: vars.display.flex,
  alignItems: vars.alignItems.center,
  gap: vars.spacing.m,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const link = style({
  display: vars.display.block,
  paddingBlock: vars.padding.xs,
  color: vars.color.text,
  font: vars.font.shorthand.caption,
  textDecoration: 'none',
  selectors: {
    '&:hover': {
      textDecoration: 'underline',
    },
    '&[aria-current="page"]': {
      textDecoration: 'underline',
      textUnderlineOffset: vars.spacing.xs,
    },
    '&:focus-visible': {
      outline: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.focus}`,
      outlineOffset: vars.spacing.xs,
    },
  },
});
