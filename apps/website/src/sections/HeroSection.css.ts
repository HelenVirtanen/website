import { globalStyle, style } from '@vanilla-extract/css';
import { vars, media } from '@moscowcss/design-system';
import { inner as layoutInner, sectionPadding } from './sectionLayout.css';

export const section = style([
  sectionPadding,
  {
    position: vars.position.relative,
    color: vars.color.text,
    background: vars.color.background,
    overflow: 'hidden',
    selectors: {
      '&::before': {
        content: '""',
        position: vars.position.absolute,
        inset: vars.inset.zero,
        opacity: 0.08,
        backgroundImage: `radial-gradient(circle at 15% 20%, ${vars.color.divider} 0, transparent 40%),
        radial-gradient(circle at 85% 75%, ${vars.color.divider} 0, transparent 35%)`,
        pointerEvents: 'none',
      },
    },
  },
]);

export const inner = style([
  layoutInner,
  {
    gap: vars.spacing['4xl'],
  },
]);

export const intro = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.xxl,
  width: '100%',
});

export const introHead = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: vars.alignItems.center,
  gap: vars.layout.gap.l,
  textAlign: 'center',
});

export const star = style({
  display: vars.display.block,
  width: '8rem',
  height: 'auto',
  color: vars.color.focus,
  '@media': {
    [media.desktop]: {
      width: vars.size.heroLogoWidth,
      height: vars.size.heroLogoHeight,
    },
  },
});

export const title = style({
  margin: 0,
  font: vars.font.shorthand.heroTitle,
  letterSpacing: vars.font.letterSpacing.figmaHeroTitle,
  textTransform: 'uppercase',
  '@media': {
    [media.laptop]: {
      whiteSpace: 'nowrap',
    },
  },
});

export const modes = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  gap: vars.spacing.s,
  alignItems: vars.alignItems.center,
  justifyContent: 'flex-start',
  width: '100%',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  font: vars.font.shorthand.heroLightLabel,
  letterSpacing: vars.font.letterSpacing.figmaWide,
});

export const modeItem = style({
  display: vars.display.flex,
  gap: vars.spacing.s,
  alignItems: vars.alignItems.center,
  selectors: {
    '& + &::before': {
      content: "'/'",
    },
  },
});

export const footer = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.xxl,
  width: '100%',
  '@media': {
    [media.laptop]: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: vars.justifyContent.spaceBetween,
      gap: vars.layout.gap.xxl,
    },
  },
});

export const details = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.m,
  alignSelf: 'flex-start',
  width: '100%',
  maxWidth: '100%',
  textAlign: 'left',
});

export const infoLine = style({
  margin: 0,
  font: vars.font.shorthand.heroInfoLine,
  letterSpacing: vars.font.letterSpacing.figmaWide,
});

export const meetupLine = style([
  infoLine,
  {
    textTransform: 'uppercase',
  },
]);

export const passportNote = style([
  infoLine,
  {
    color: vars.color.focus,
  },
]);

export const ctaColumn = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.m,
  alignItems: 'flex-start',
  width: '100%',
  '@media': {
    [media.laptop]: {
      alignItems: 'flex-end',
      alignSelf: 'flex-end',
      width: 'auto',
    },
  },
});

export const ctaButton = style({});

globalStyle(`${ctaButton} span`, {
  boxSizing: 'border-box',
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  width: '100%',
  maxWidth: vars.size.heroCtaWidth,
  height: vars.size.heroCtaHeight,
  paddingBlock: 0,
  paddingInline: vars.layout.inset.l,
  font: vars.font.shorthand.heroCtaLabel,
  letterSpacing: vars.font.letterSpacing.registration,
  textAlign: 'center',
  '@media': {
    [media.laptop]: {
      width: vars.size.heroCtaWidth,
    },
  },
});

export const onlineNote = style({
  margin: 0,
  font: vars.font.shorthand.heroLightLabel,
  letterSpacing: vars.font.letterSpacing.figmaWide,
  textAlign: 'left',
  '@media': {
    [media.laptop]: {
      alignSelf: 'flex-end',
      maxWidth: 'none',
      whiteSpace: 'nowrap',
      textAlign: 'right',
    },
  },
});
