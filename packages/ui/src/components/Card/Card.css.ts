import { style } from '@vanilla-extract/css';
import { media, vars } from '@moscowcss/design-system';

// Ряд карточек: на мобиле — колонка, с tablet — в строку; stretch выравнивает высоту.
export const row = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  flexWrap: 'wrap',
  alignItems: vars.alignItems.stretch,
  gap: vars.layout.gap.l,

  '@media': {
    [media.tablet]: {
      flexDirection: vars.flexDirection.row,
    },
  },
});

export const root = style({
  boxSizing: 'border-box',
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  flex: '1 1 0',
  width: '100%',
  minWidth: 0,
  maxWidth: vars.size.cardWidthMobile,
  paddingBlock: vars.size.cardPaddingBlock,
  paddingInline: vars.size.cardPaddingInline,
  background: vars.color.background,
  border: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.border}`,

  '@media': {
    [media.mobile]: {
      flex: '0 0 auto',
    },
    [media.laptop]: {
      maxWidth: vars.size.cardWidthLaptop,
    },
  },

  selectors: {
    // height: 100% на карточке ломает stretch при auto-высоте ряда — явно тянем внутри row.
    [`${row} &`]: {
      alignSelf: vars.alignItems.stretch,
    },
  },
});

export const header = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.m,
});

export const title = style({
  margin: 0,
  color: vars.color.text,
  font: vars.font.shorthand.h3,
  letterSpacing: vars.font.letterSpacing.heading,
});

export const subtitle = style({
  margin: 0,
  color: vars.color.text,
  font: vars.font.shorthand.subtitle,
});

export const content = style({
  margin: 0,
  marginTop: vars.layout.gap.m,
  color: vars.color.text,
  font: vars.font.shorthand.body,
  flex: '1 1 auto',
});
