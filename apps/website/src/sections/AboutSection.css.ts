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

export const privacy = style({
  margin: 0,
  font: vars.font.shorthand.caption,
});

export const privacyLink = style({
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  minWidth: vars.size.hitTarget,
  paddingBlock: hitInset,
  marginBlock: `calc(-1 * ${hitInset})`,
  color: vars.color.text,
  selectors: {
    '&:focus-visible': {
      outline: `${vars.border.width.thick} ${vars.border.style.solid} ${vars.color.focus}`,
      outlineOffset: vars.spacing.xs,
    },
  },
});
