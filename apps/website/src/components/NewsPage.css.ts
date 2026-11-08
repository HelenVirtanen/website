import { style } from '@vanilla-extract/css';
import { vars, media } from '@moscowcss/design-system';

// Обложка новости в герое: справа от текста на широком экране, под ним — на узком.
export const heroCover = style({
  flex: '0 1 auto',
  width: '100%',
  minWidth: 0,
  '@media': {
    [media.laptop]: { flex: '0 0 45%', maxWidth: '45%' },
  },
});

// Соседние новости: две клетки с пунктирной рамкой, «Раньше» слева, «Позже» справа.
export const pager = style({
  display: vars.display.grid,
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: vars.spacing.s,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  '@media': {
    [media.tablet]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  },
});

export const pagerNext = style({
  '@media': {
    [media.tablet]: { gridColumn: '2', textAlign: 'end' },
  },
});

export const pagerLink = style({
  boxSizing: 'border-box',
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.spacing.s,
  height: '100%',
  minHeight: vars.size.hitTarget,
  padding: vars.padding.xl,
  color: vars.color.text,
  textDecoration: 'none',
  border: `${vars.border.width.thin} ${vars.border.style.dashed} ${vars.color.border}`,
  transitionProperty: 'background-color, color',
  transitionDuration: vars.motion.duration.fast,
  transitionTimingFunction: vars.motion.easing.standard,
  selectors: {
    '&:hover': { background: vars.color.buttonHover, color: vars.color.onButtonHover },
  },
});

export const pagerLabel = style({
  font: vars.font.shorthand.ui,
  textTransform: 'uppercase',
});

export const pagerTitle = style({
  font: vars.font.shorthand.h4,
  letterSpacing: vars.font.letterSpacing.heading,
  overflowWrap: 'anywhere',
});

export const moreHead = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.spaceBetween,
  gap: vars.layout.gap.m,
});

// Обложка и галерея листаются в одном окне просмотра, поэтому их общая обёртка повторяет отступы страницы.
export const stack = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.xxl,
});
