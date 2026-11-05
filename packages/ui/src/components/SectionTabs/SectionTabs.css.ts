import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const root = style({
  minWidth: 0,
  color: vars.color.text,
});

export const list = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  gap: vars.spacing.s,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

// Текущий раздел — залитая плашка: отличие не только цветом, но и рамкой-заливкой.
export const link = style({
  boxSizing: 'border-box',
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  minWidth: vars.size.hitTarget,
  minHeight: vars.size.hitTarget,
  paddingInline: vars.padding.l,
  border: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.border}`,
  color: vars.color.text,
  font: vars.font.shorthand.ui,
  textDecoration: 'none',
  selectors: {
    '&:hover': { background: vars.color.dividerSoft },
    '&[aria-current="page"]': { background: vars.color.text, color: vars.color.background },
  },
});
