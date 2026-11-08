import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const root = style({
  border: `${vars.border.width.thin} ${vars.border.style.dashed} ${vars.color.border}`,
  color: vars.color.text,
});

export const summary = style({
  display: vars.display.flex,
  alignItems: vars.alignItems.center,
  justifyContent: 'space-between',
  gap: vars.spacing.m,
  minBlockSize: vars.size.hitTarget,
  paddingBlock: vars.padding.l,
  paddingInline: vars.padding.xl,
  font: vars.font.shorthand.h3,
  letterSpacing: vars.font.letterSpacing.heading,
  cursor: 'pointer',
  listStyle: 'none',
  selectors: {
    '&::-webkit-details-marker': { display: vars.display.none },
    // Плюс из двух линий фона: в открытом блоке вертикальная схлопывается и остаётся минус.
    '&::after': {
      content: '""',
      flexShrink: 0,
      inlineSize: vars.size.burgerIcon,
      blockSize: vars.size.burgerIcon,
      backgroundImage: `linear-gradient(currentColor, currentColor), linear-gradient(currentColor, currentColor)`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: `100% ${vars.border.width.medium}, ${vars.border.width.medium} 100%`,
    },
    [`${root}[open] > &::after`]: {
      backgroundSize: `100% ${vars.border.width.medium}, ${vars.border.width.medium} 0`,
    },
  },
});

export const body = style({
  paddingInline: vars.padding.xl,
  paddingBlockEnd: vars.padding.xl,
});

globalStyle(`${summary}:hover`, {
  color: vars.color.link,
});
