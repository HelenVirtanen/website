import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

// Без скрипта и при сниженной анимации плашки лежат рядами снизу вверх; скрипт добавляет
// data-pile, и те же плашки ложатся абсолютно в зону фиксированной высоты.
export const root = style({
  boxSizing: 'border-box',
  position: vars.position.relative,
  display: vars.display.flex,
  flexWrap: 'wrap-reverse',
  alignContent: 'flex-start',
  justifyContent: vars.justifyContent.center,
  gap: vars.spacing.s,
  minHeight: vars.adaptive.heroTagsHeight,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  selectors: {
    '&[data-pile]': {
      display: vars.display.block,
      height: vars.adaptive.heroTagsHeight,
    },
  },
});

export const tag = style({
  boxSizing: 'border-box',
  width: 'max-content',
  maxWidth: '100%',
  overflow: 'hidden',
  paddingBlock: vars.adaptive.heroTagPaddingBlock,
  paddingInline: vars.adaptive.heroTagPaddingInline,
  borderRadius: vars.adaptive.heroTagRadius,
  font: vars.font.shorthand.heroTag,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  selectors: {
    [`${root}[data-pile] &`]: {
      position: vars.position.absolute,
      top: 0,
      left: 0,
    },
  },
});

const tone = (background: string, color: string) => style({ background, color });

export const tones = [
  tone(vars.color.tagSky, vars.color.onTagSky),
  tone(vars.color.tagBlue, vars.color.onTagBlue),
  tone(vars.color.tagYellow, vars.color.onTagYellow),
  tone(vars.color.tagRed, vars.color.onTagRed),
  tone(vars.color.tagOrange, vars.color.onTagOrange),
];
