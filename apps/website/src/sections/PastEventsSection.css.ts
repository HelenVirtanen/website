import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';
import { inner as layoutInner, sectionPadding } from './sectionLayout.css';

export const section = style([
  sectionPadding,
  {
    color: vars.color.text,
    background: vars.color.background,
  },
]);

export const inner = style([
  layoutInner,
  {
    display: vars.display.flex,
    flexDirection: vars.flexDirection.column,
    gap: vars.layout.gap.l,
  },
]);

export const feedLink = style({
  color: vars.color.text,
  selectors: {
    '&:focus-visible': {
      outline: `${vars.border.width.thick} ${vars.border.style.solid} ${vars.color.focus}`,
      outlineOffset: vars.spacing.xs,
    },
  },
});
