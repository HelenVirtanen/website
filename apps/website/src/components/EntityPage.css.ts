import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';
import { inner as layoutInner, sectionPadding } from '../sections/sectionLayout.css';

export const main = style([
  sectionPadding,
  {
    color: vars.color.text,
    background: vars.color.background,
  },
]);

export const inner = layoutInner;

export const header = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.m,
});

export const body = style({
  maxWidth: '48rem',
  font: vars.font.shorthand.body,
});

export const photo = style({
  display: vars.display.block,
  inlineSize: '100%',
  maxInlineSize: '24rem',
  blockSize: 'auto',
  objectFit: 'cover',
});

// Обложка доклада: не шире текста страницы, пропорции — из файла.
export const cover = style({
  display: vars.display.block,
  inlineSize: '100%',
  maxInlineSize: '48rem',
  blockSize: 'auto',
  border: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.border}`,
});
