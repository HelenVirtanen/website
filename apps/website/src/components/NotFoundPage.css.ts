import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export { main, inner } from './SearchPage.css';

export const block = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.m,
});

export const blocks = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  // Языковые блоки — две самостоятельные страницы на одной: разрыв вдвое больше шага внутри блока.
  gap: `calc(${vars.layout.gap.xxl} * 2)`,
});
