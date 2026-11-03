import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const root = style({
  boxSizing: 'border-box',
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  width: vars.size.tgLinkButtonCompact,
  height: vars.size.tgLinkButtonCompact,
  padding: 0,
  borderRadius: 0,
  background: vars.color.background,
  border: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.divider}`,
  color: vars.color.tgBorder,
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `${vars.border.width.medium} ${vars.border.style.solid} ${vars.color.focus}`,
      outlineOffset: vars.spacing.xs,
    },
  },
});

export const icon = style({
  display: vars.display.block,
  width: vars.size.burgerIconCompact,
  height: 'auto',
  flexShrink: 0,
});
