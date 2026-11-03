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

export const inner = layoutInner;

export const title = style({
  margin: 0,
  font: vars.font.shorthand.h2,
  letterSpacing: vars.font.letterSpacing.heading,
});

export const body = style({
  maxWidth: '48rem',
  font: vars.font.shorthand.body,
});
