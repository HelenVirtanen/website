import { style } from '@vanilla-extract/css';
import { dimensions, vars, media } from '@moscowcss/design-system';

export const section = style({
  boxSizing: 'border-box',
  position: vars.position.relative,
  paddingBlockStart: vars.adaptive.heroPaddingTop,
  paddingBlockEnd: vars.adaptive.heroPaddingBottom,
  paddingInline: vars.adaptive.heroPaddingInline,
  color: vars.color.text,
  background: vars.color.background,
  overflow: 'hidden',
});

export const inner = style({
  position: vars.position.relative,
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.adaptive.heroGap,
  width: '100%',
});

export const group = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.adaptive.heroGroupGap,
});

export const stage = style({
  position: vars.position.relative,
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.adaptive.heroGroupGap,
});

export const pile = style({
  selectors: {
    // Без скрипта и при сниженной анимации плашки лежат рядами: держим их между чипом и датой.
    '&:not([data-pile])': {
      paddingInline: vars.adaptive.heroPileInset,
    },
  },
  '@media': {
    [media.tablet]: {
      pointerEvents: 'none',
    },
  },
});

export const metaRow = style({
  display: vars.display.flex,
  alignItems: 'end',
  justifyContent: vars.justifyContent.spaceBetween,
  gap: vars.spacing.m,
  '@media': {
    [media.tablet]: {
      position: vars.position.absolute,
      insetInline: 0,
      insetBlockEnd: 0,
    },
  },
});

export const chip = style({
  boxSizing: 'border-box',
  paddingBlock: vars.adaptive.heroChipPaddingBlock,
  paddingInline: vars.adaptive.heroChipPaddingInline,
  border: `${vars.border.width.thin} ${vars.border.style.dashed} ${vars.color.border}`,
  borderRadius: vars.adaptive.heroChipRadius,
  font: vars.font.shorthand.heroChip,
  letterSpacing: vars.font.letterSpacing.heroChip,
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
});

export const date = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: 'end',
  gap: vars.adaptive.heroDateGap,
  margin: 0,
  marginInlineStart: 'auto',
  textAlign: 'right',
});

export const pastNote = style({
  margin: 0,
  color: vars.color.pastNote,
  font: vars.font.shorthand.navMeta,
});

export const day = style({
  margin: 0,
  color: vars.color.link,
  font: vars.font.shorthand.heroDate,
});

export const time = style({
  margin: 0,
  font: vars.font.shorthand.navMono,
});

export const title = style({
  margin: 0,
  font: vars.font.shorthand.heroDisplay,
  // Уже 375 кегль уменьшается вместе с окном, иначе слово обрезается краем экрана.
  fontSize: `min(${vars.font.size.heroDisplay}, calc((100vw - 2 * ${vars.adaptive.heroPaddingInline}) / ${dimensions.fit.heroWordEm}))`,
  letterSpacing: vars.font.letterSpacing.heroDisplay,
  textTransform: 'uppercase',
  // На мобильном заголовок складывается в два слова столбиком, от планшета идёт одной строкой.
  width: 'min-content',
  '@media': {
    [media.tablet]: {
      fontSize: vars.font.size.heroDisplay,
      width: 'auto',
      whiteSpace: 'nowrap',
    },
  },
});

export const modes = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  columnGap: vars.adaptive.heroMetaGap,
  rowGap: vars.spacing.xs,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  font: vars.font.shorthand.heroMeta,
});

export const modeItem = style({
  selectors: {
    '&::before': {
      content: '"/ "',
    },
  },
});

export const about = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.adaptive.heroAboutGap,
  '@media': {
    [media.wide]: {
      maxWidth: vars.adaptive.heroAboutWidth,
    },
  },
});

// Справа на мобильном стоит закреплённая кнопка: текст не заходит под неё.
export const aboutBesideCta = style({
  '@media': {
    [media.mobile]: {
      paddingInlineEnd: `calc(${vars.adaptive.ctaSize} + ${vars.spacing.l})`,
    },
  },
});

export const lead = style({
  margin: 0,
  font: vars.font.shorthand.heroLead,
  letterSpacing: vars.font.letterSpacing.heroText,
});

export const body = style({
  margin: 0,
  font: vars.font.shorthand.heroBody,
  letterSpacing: vars.font.letterSpacing.heroText,
});

export const dim = style({
  opacity: 0.7,
});

export const link = style({
  color: vars.color.link,
});
