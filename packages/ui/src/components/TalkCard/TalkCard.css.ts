import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

// Вся карточка — одна ссылка на доклад: обложка сверху, метка митапа, название крупно.
export const root = style({
  boxSizing: 'border-box',
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  height: '100%',
  color: vars.color.text,
  textDecoration: 'none',
  border: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.border}`,
  transitionProperty: 'translate, box-shadow',
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.standard,
  selectors: {
    '&:hover': {
      translate: `0 calc(-1 * ${vars.spacing.xs})`,
      boxShadow: `0 ${vars.spacing.s} 0 ${vars.color.text}`,
    },
  },
});

export const cover = style({
  display: vars.display.block,
  aspectRatio: '1200 / 630',
  overflow: 'hidden',
  borderBlockEnd: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.border}`,
});

export const image = style({
  display: vars.display.block,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const body = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: 'flex-start',
  gap: vars.spacing.m,
  padding: vars.padding.xl,
});

export const chip = style({
  paddingBlock: vars.spacing.xs,
  paddingInline: vars.padding.m,
  border: `${vars.border.width.thin} ${vars.border.style.dashed} ${vars.color.border}`,
  font: vars.font.shorthand.ui,
});

export const title = style({
  margin: 0,
  font: vars.font.shorthand.h4,
  letterSpacing: vars.font.letterSpacing.heading,
  textTransform: 'uppercase',
  overflowWrap: 'anywhere',
  textDecorationThickness: vars.border.width.thin,
  selectors: {
    [`${root}:hover &`]: { textDecorationLine: 'underline' },
  },
});

export const meta = style({
  font: vars.font.shorthand.caption,
});
