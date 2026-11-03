import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const root = style({
  margin: 0,
  color: vars.color.text,
  font: vars.font.shorthand.h3,
  letterSpacing: vars.font.letterSpacing.heading,
});
