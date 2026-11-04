import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

// Спрятана за верхним краем, а не через display: иначе на неё нельзя попасть клавишей Tab.
export const skipLink = style({
  position: vars.position.fixed,
  insetBlockStart: vars.spacing.s,
  insetInlineStart: vars.spacing.s,
  zIndex: vars.zIndex.skipLink,
  padding: vars.padding.m,
  color: vars.color.text,
  background: vars.color.background,
  border: `${vars.border.width.medium} ${vars.border.style.solid} ${vars.color.border}`,
  borderRadius: vars.radius.large,
  font: vars.font.shorthand.body,
  transform: 'translateY(-200%)',
  selectors: {
    '&:focus': {
      transform: 'none',
    },
  },
});
