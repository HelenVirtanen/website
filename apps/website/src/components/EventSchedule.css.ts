import { style } from '@vanilla-extract/css';
import { vars, media } from '@moscowcss/design-system';

export const root = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.l,
});

export const list = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const row = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.spacing.xs,
  paddingBlock: vars.layout.inset.l,
  borderTop: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.divider}`,
  '@media': {
    [media.laptop]: {
      display: 'grid',
      gridTemplateColumns: `${vars.size.programTimeColumn} 1fr`,
      columnGap: vars.layout.gap.xxl,
      alignItems: 'baseline',
    },
  },
});

export const time = style({
  margin: 0,
  font: vars.font.shorthand.body,
  color: vars.color.text,
});

export const main = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.spacing.xs,
  minWidth: 0,
});

export const title = style({
  margin: 0,
  font: vars.font.shorthand.h3,
  letterSpacing: vars.font.letterSpacing.heading,
  overflowWrap: 'anywhere',
});

export const people = style({
  margin: 0,
  font: vars.font.shorthand.caption,
  color: vars.color.text,
});

export const link = style({
  // У строчной ссылки поля не двигают строку, но увеличивают зону нажатия.
  paddingBlock: `calc((${vars.size.hitTarget} - 1lh) / 2)`,
  color: vars.color.text,
});
