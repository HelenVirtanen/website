import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

// Заголовок сайта — семантически h2, но с отдельным дизайном: свой шорткат
// vars.font.shorthand.websiteTitle, а не роль h2.
export const root = style({
  margin: 0,
  color: vars.color.text,
  font: vars.font.shorthand.websiteTitle,
  letterSpacing: vars.font.letterSpacing.heading,
});
