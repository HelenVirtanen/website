import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

// Зона нажатия до hitTarget за счёт полей с компенсирующим отрицательным отступом: вёрстка не едет.
const hitInset = `max(calc(${vars.size.hitTarget} * 0), calc((${vars.size.hitTarget} - 1lh) / 2))`;

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
  color: vars.color.text,
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
  alignSelf: 'flex-start',
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  minWidth: vars.size.hitTarget,
  paddingBlock: hitInset,
  marginBlock: `calc(-1 * ${hitInset})`,
  color: vars.color.text,
  font: vars.font.shorthand.h3,
  overflowWrap: 'anywhere',
  selectors: {
    '&:hover': { textDecoration: 'underline' },
  },
});

export const description = style({
  margin: 0,
  color: vars.color.text,
  font: vars.font.shorthand.caption,
  overflowWrap: 'anywhere',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  overflow: 'hidden',
});
