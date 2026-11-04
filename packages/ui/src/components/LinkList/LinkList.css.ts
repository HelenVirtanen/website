import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

// Зона нажатия до hitTarget за счёт полей с компенсирующим отрицательным отступом: вёрстка не едет.
const hitInset = `max(calc(${vars.size.hitTarget} * 0), calc((${vars.size.hitTarget} - 1lh) / 2))`;

export const root = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.l,
  minWidth: 0,
  color: vars.color.text,
});

export const title = style({
  margin: 0,
  font: vars.font.shorthand.h2,
  letterSpacing: vars.font.letterSpacing.heading,
});

export const list = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.spacing.m,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const item = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  alignItems: 'baseline',
  columnGap: vars.layout.gap.m,
  rowGap: vars.spacing.xs,
  minWidth: 0,
  font: vars.font.shorthand.body,
});

export const link = style({
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  minWidth: vars.size.hitTarget,
  paddingBlock: hitInset,
  marginBlock: `calc(-1 * ${hitInset})`,
  color: vars.color.text,
  overflowWrap: 'anywhere',
  selectors: {
    '&:focus-visible': {
      outline: `${vars.border.width.thick} ${vars.border.style.solid} ${vars.color.focus}`,
      outlineOffset: vars.spacing.xs,
    },
  },
});

export const caption = style({
  color: vars.color.divider,
  font: vars.font.shorthand.caption,
});
