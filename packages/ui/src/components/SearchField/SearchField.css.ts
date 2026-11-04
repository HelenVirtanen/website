import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const root = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  gap: vars.spacing.m,
  minWidth: 0,
  color: vars.color.text,
});

export const input = style({
  boxSizing: 'border-box',
  flex: '1 1 auto',
  minWidth: 0,
  minHeight: vars.size.hitTarget,
  padding: vars.layout.inset.l,
  border: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.divider}`,
  borderRadius: vars.radius.medium,
  background: vars.color.background,
  color: vars.color.text,
  font: vars.font.shorthand.body,
  selectors: {
    '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
  },
});

export const submit = style({
  boxSizing: 'border-box',
  minWidth: vars.size.hitTarget,
  minHeight: vars.size.hitTarget,
  padding: vars.layout.inset.l,
  border: 'none',
  borderRadius: vars.radius.medium,
  background: vars.color.success,
  color: vars.color.background,
  font: vars.font.shorthand.body,
  cursor: 'pointer',
  selectors: {
    '&:hover': { opacity: 0.9 },
    '&:active': { opacity: 0.8 },
    '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
  },
});
