import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const root = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.spacing.s,
  minWidth: 0,
  selectors: {
    '&[hidden]': {
      display: vars.display.none,
    },
  },
});

export const buttons = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  gap: vars.spacing.s,
});

// Выбранная кнопка — залитая плашка, как текущий раздел в переключателе списков.
export const button = style({
  boxSizing: 'border-box',
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  minWidth: vars.size.hitTarget,
  minHeight: vars.size.hitTarget,
  paddingInline: vars.padding.l,
  border: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.border}`,
  background: vars.color.background,
  color: vars.color.text,
  font: vars.font.shorthand.ui,
  cursor: 'pointer',
  selectors: {
    '&:hover': { background: vars.color.dividerSoft },
    '&[aria-pressed="true"]': { background: vars.color.text, color: vars.color.background },
  },
});

export const status = style({
  margin: 0,
  font: vars.font.shorthand.caption,
});
