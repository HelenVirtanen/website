import { createVar, style } from '@vanilla-extract/css';
import { dimensions, vars } from '@moscowcss/design-system';

const angle = createVar();
const shift = createVar();

export const root = style({
  boxSizing: 'border-box',
  position: vars.position.relative,
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.spacing.m,
  height: '100%',
  minHeight: vars.size.reviewSticker,
  padding: vars.padding.l,
  paddingBlockEnd: vars.padding.xl,
  textDecoration: 'none',
  rotate: angle,
  translate: `0 ${shift}`,
  boxShadow: `0 ${vars.spacing.xs} ${vars.spacing.m} ${vars.color.backdrop}`,
  transitionProperty: 'rotate, translate',
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.standard,
  selectors: {
    // Полоска скотча, которой листок приклеен к стене.
    '&::before': {
      content: '""',
      position: vars.position.absolute,
      insetBlockStart: `calc(${vars.size.reviewTapeHeight} / -2)`,
      insetInlineStart: '50%',
      width: vars.size.reviewTapeWidth,
      height: vars.size.reviewTapeHeight,
      translate: '-50% 0',
      rotate: '-3deg',
      background: `color-mix(in srgb, ${vars.color.text} 25%, transparent)`,
    },
    // Загнутый угол: половина квадрата цвета страницы, половина — изнанка листка.
    '&::after': {
      content: '""',
      position: vars.position.absolute,
      insetBlockEnd: 0,
      insetInlineEnd: 0,
      width: vars.size.reviewFold,
      height: vars.size.reviewFold,
      background: `linear-gradient(135deg, color-mix(in srgb, currentColor 30%, transparent) 50%, ${vars.color.background} 50%)`,
    },
  },
});

const tone = (background: string, color: string) => style({ background, color });

export const tones = [
  tone(vars.color.tagSky, vars.color.onTagSky),
  tone(vars.color.tagYellow, vars.color.onTagYellow),
  tone(vars.color.tagRed, vars.color.onTagRed),
  tone(vars.color.tagOrange, vars.color.onTagOrange),
  tone(vars.color.tagBlue, vars.color.onTagBlue),
];

// Наклон задан переменными, поэтому наведение и сниженная анимация выравнивают листок одним правилом.
const tilt = (turn: string, offset: string) =>
  style({
    vars: { [angle]: turn, [shift]: offset },
    selectors: {
      '&:hover, &:focus-visible': {
        vars: { [angle]: '0deg', [shift]: `calc(-1 * ${vars.spacing.xs})` },
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        vars: { [angle]: '0deg', [shift]: '0rem' },
      },
    },
  });

export const tilts = [
  tilt('-2deg', '0rem'),
  tilt('1.5deg', vars.spacing.s),
  tilt('-1deg', vars.spacing.xs),
  tilt('2deg', '0rem'),
];

export const head = style({
  display: vars.display.flex,
  alignItems: vars.alignItems.center,
  gap: vars.spacing.m,
  minWidth: 0,
});

export const photo = style({
  flexShrink: 0,
  display: vars.display.block,
  width: vars.size.reviewPhoto,
  height: vars.size.reviewPhoto,
  objectFit: 'cover',
  clipPath: dimensions.octagon,
});

export const who = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.spacing.xs,
  minWidth: 0,
});

export const name = style({
  margin: 0,
  font: vars.font.shorthand.h4,
  overflowWrap: 'anywhere',
});

export const role = style({
  margin: 0,
  font: vars.font.shorthand.caption,
});

export const text = style({
  margin: 0,
  font: vars.font.shorthand.body,
  overflowWrap: 'anywhere',
});
