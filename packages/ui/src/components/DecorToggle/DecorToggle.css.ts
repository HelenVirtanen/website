import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const root = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  alignItems: vars.alignItems.center,
  columnGap: vars.spacing.l,
  color: vars.color.text,
  font: vars.font.shorthand.navMeta,
  selectors: {
    '&[hidden]': {
      display: vars.display.none,
    },
  },
});

export const option = style({
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  gap: vars.spacing.s,
  minHeight: vars.size.hitTarget,
  cursor: 'pointer',
  selectors: {
    '&:has(:disabled)': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
});

export const box = style({
  flexShrink: 0,
  width: vars.size.decorCheckbox,
  height: vars.size.decorCheckbox,
  margin: 0,
  accentColor: vars.color.link,
  cursor: 'inherit',
  selectors: {
    '&:focus-visible': {
      outline: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.focus}`,
      outlineOffset: vars.spacing.xs,
    },
  },
});
