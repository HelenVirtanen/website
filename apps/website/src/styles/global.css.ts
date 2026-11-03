import { globalStyle } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});

globalStyle('body', {
  margin: 0,
  color: vars.color.text,
  background: vars.color.background,
  font: vars.font.shorthand.body,
});
