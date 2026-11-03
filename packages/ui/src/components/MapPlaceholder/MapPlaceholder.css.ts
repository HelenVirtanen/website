import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const frame = style({
  display: vars.display.block,
  width: '100%',
  margin: 0,
  overflow: 'hidden',
});

export const map = style({
  display: vars.display.block,
  width: '100%',
  height: '100%',
  minHeight: '100%',
  border: 'none',
  background: vars.color.divider,
});

export const label = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  gap: vars.spacing.s,
  width: '100%',
  height: '100%',
  minHeight: '100%',
  margin: 0,
  color: vars.color.text,
  font: vars.font.shorthand.caption,
  textAlign: 'center',
  background: vars.color.divider,
});

export const link = style({
  display: vars.display.block,
  marginTop: vars.spacing.s,
  color: vars.color.info,
  font: vars.font.shorthand.caption,
  textDecoration: 'underline',
});
