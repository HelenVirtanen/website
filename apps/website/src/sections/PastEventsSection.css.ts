import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';
import { inner as layoutInner, sectionPadding } from './sectionLayout.css';

// Зона нажатия до hitTarget за счёт полей с компенсирующим отрицательным отступом: вёрстка не едет.
const hitInset = `max(calc(${vars.size.hitTarget} * 0), calc((${vars.size.hitTarget} - 1lh) / 2))`;

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
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  minWidth: vars.size.hitTarget,
  paddingBlock: hitInset,
  marginBlock: `calc(-1 * ${hitInset})`,
  color: vars.color.text,
});
