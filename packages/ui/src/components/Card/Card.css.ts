import { globalStyle, style } from '@vanilla-extract/css';
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
  gap: vars.adaptive.cardGap,
  width: '100%',
  minWidth: 0,
  maxWidth: vars.adaptive.cardWidth,
  paddingBlock: vars.adaptive.cardPaddingBlock,
  paddingInline: vars.adaptive.cardPaddingInline,
  background: vars.color.background,
  border: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.border}`,

  '@media': {
    [media.mobile]: {
      flex: '0 0 auto',
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
  gap: vars.spacing.s,
});

export const title = style({
  margin: 0,
  color: vars.color.text,
  font: vars.font.shorthand.cardTitle,
  lineHeight: vars.adaptive.cardTitleLine,
  letterSpacing: vars.font.letterSpacing.heading,
  textTransform: 'uppercase',
  overflowWrap: 'anywhere',
});

export const subtitle = style({
  margin: 0,
  color: vars.color.text,
  font: vars.font.shorthand.subtitle,
});

export const content = style({
  margin: 0,
  minWidth: 0,
  color: vars.color.text,
  font: vars.font.shorthand.cardBody,
  lineHeight: vars.adaptive.cardBodyLine,
  overflowWrap: 'anywhere',
  flex: '1 1 auto',
});

// :where() обнуляет специфичность: класс ссылки в месте использования (например, в JoinBlock) выигрывает.
globalStyle(`:where(${content} a)`, {
  color: vars.color.link,
  textDecoration: 'underline',
});
