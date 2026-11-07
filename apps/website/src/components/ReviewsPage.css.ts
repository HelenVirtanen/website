import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';
import { inner as layoutInner, sectionPadding } from '../sections/sectionLayout.css';

export const main = style([
  sectionPadding,
  {
    color: vars.color.text,
  },
]);

export const inner = layoutInner;

export const head = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.m,
});
