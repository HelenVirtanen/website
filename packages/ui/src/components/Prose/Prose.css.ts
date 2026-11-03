import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

// Шрифт и цвет наследуются от контейнера: Prose живёт в карточке, секции и на тёмном фоне.
export const root = style({
  margin: 0,
  color: 'inherit',
  font: 'inherit',
  overflowWrap: 'break-word',
});

// :where() обнуляет специфичность: контейнер перекрывает любое правило обычным селектором.
globalStyle(`${root} :where(p, ul, ol, h2, h3, h4)`, {
  margin: 0,
});

globalStyle(`${root} > :where(* + *)`, {
  marginBlockStart: vars.spacing.m,
});

globalStyle(`${root} :where(li + li)`, {
  marginBlockStart: vars.spacing.s,
});

globalStyle(`${root} :where(ul, ol)`, {
  paddingInlineStart: vars.layout.inset.l,
});

globalStyle(`${root} :where(h2)`, {
  font: vars.font.shorthand.h2,
  letterSpacing: vars.font.letterSpacing.heading,
});

globalStyle(`${root} :where(h3)`, {
  font: vars.font.shorthand.h3,
  letterSpacing: vars.font.letterSpacing.heading,
});

globalStyle(`${root} :where(strong)`, {
  fontWeight: 'bolder',
});
