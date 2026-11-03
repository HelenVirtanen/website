import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const root = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.m,
  minWidth: 0,
  color: vars.color.text,
  font: vars.font.shorthand.body,
});

export const status = style({
  margin: 0,
  selectors: { '&:empty': { display: vars.display.none } },
});

export const note = style({
  margin: 0,
  color: vars.color.divider,
  font: vars.font.shorthand.caption,
  selectors: { '&[hidden]': { display: vars.display.none } },
});

export const list = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.m,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const item = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.spacing.xs,
  minWidth: 0,
});

export const link = style({
  color: vars.color.text,
  font: vars.font.shorthand.h3,
  overflowWrap: 'anywhere',
  selectors: {
    '&:hover': { textDecoration: 'underline' },
    '&:focus-visible': {
      outline: `${vars.border.width.medium} ${vars.border.style.solid} ${vars.color.focus}`,
      outlineOffset: vars.spacing.xs,
    },
  },
});

export const description = style({
  margin: 0,
  color: vars.color.divider,
  font: vars.font.shorthand.caption,
  overflowWrap: 'anywhere',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  overflow: 'hidden',
});
