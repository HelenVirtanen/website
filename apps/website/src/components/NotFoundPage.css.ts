import { style } from '@vanilla-extract/css';
import { dimensions, vars, media } from '@moscowcss/design-system';
import { inner as layoutInner, sectionPadding } from '../sections/sectionLayout.css';

export const main = style([
  sectionPadding,
  {
    color: vars.color.text,
  },
]);

export const inner = style([
  layoutInner,
  {
    gap: vars.layout.gap.xxl,
  },
]);

// Сцена как Hero главной: плашки падают кучей поверх огромных цифр.
export const stage = style({
  position: vars.position.relative,
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: vars.alignItems.center,
});

export const pile = style({
  width: '100%',
  maxWidth: vars.size.reviewDialogWidth,
});

export const digits = style({
  margin: 0,
  font: vars.font.shorthand.heroDisplay,
  // Цифры занимают ширину окна, но не больше кегля Hero: «404» короче слова MOSCOW.
  fontSize: `min(calc(${vars.font.size.heroDisplay} * 1.6), calc((100vw - 2 * ${vars.adaptive.heroPaddingInline}) / ${dimensions.fit.heroWordEm} * 1.9))`,
  lineHeight: 0.85,
  letterSpacing: vars.font.letterSpacing.heroDisplay,
});

// «Сломанное» CSS-правило: ровно то, что случилось со страницей.
export const code = style({
  alignSelf: 'center',
  margin: 0,
  paddingBlock: vars.padding.l,
  paddingInline: vars.padding.xl,
  border: `${vars.border.width.thin} ${vars.border.style.dashed} ${vars.color.border}`,
  font: vars.font.shorthand.heroMeta,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

export const codeLine = style({
  display: vars.display.block,
});

export const codeProperty = style({
  color: vars.color.info,
});

export const codeComment = style({
  color: vars.color.pastNote,
});

export const blocks = style({
  display: vars.display.grid,
  gap: vars.layout.gap.xxl,
  paddingBlockStart: vars.layout.gap.xxl,
  borderBlockStart: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.divider}`,
  '@media': {
    [media.laptop]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  },
});

export const block = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: 'flex-start',
  gap: vars.layout.gap.l,
});

export const heading = style({
  margin: 0,
  font: vars.font.shorthand.h2,
  letterSpacing: vars.font.letterSpacing.heading,
});

export const text = style({
  margin: 0,
  font: vars.font.shorthand.body,
});
