import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const root = style({
  boxSizing: 'border-box',
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  minWidth: vars.size.hitTarget,
  minHeight: vars.size.hitTarget,
  padding: 0,
  border: 0,
  background: 'transparent',
  color: vars.color.text,
  cursor: 'pointer',
});

export const icon = style({
  display: vars.display.block,
  width: vars.size.burgerIcon,
  height: vars.size.burgerIcon,
  flexShrink: 0,
});
