import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

// Восьмиугольник, как у аватара спикера в программе.
const octagon = 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';

export const root = style({
  boxSizing: 'border-box',
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: 'flex-start',
  gap: vars.spacing.l,
  blockSize: '100%',
  padding: vars.padding.xxl,
  color: vars.color.text,
  textDecoration: 'none',
  transition: `background-color ${vars.motion.duration.fast} ${vars.motion.easing.standard}`,
  selectors: {
    '&:hover': { background: vars.color.dividerSoft },
  },
});

export const photo = style({
  display: vars.display.block,
  inlineSize: vars.size.archivePhoto,
  blockSize: vars.size.archivePhoto,
  objectFit: 'cover',
  clipPath: octagon,
  background: vars.color.dividerSoft,
});

export const name = style({
  font: vars.font.shorthand.h4,
  letterSpacing: vars.font.letterSpacing.heading,
  overflowWrap: 'anywhere',
  selectors: {
    [`${root}:hover &`]: { textDecoration: 'underline' },
  },
});

export const tags = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  gap: vars.spacing.s,
  marginBlockStart: 'auto',
});

export const tag = style({
  paddingBlock: vars.padding.xs,
  paddingInline: vars.padding.s,
  border: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.border}`,
  font: vars.font.shorthand.ui,
});

// Видно только скринридеру: связывает метки в фразу «Митапы: 31, 28».
export const hiddenLabel = style({
  position: vars.position.absolute,
  inlineSize: vars.border.width.thin,
  blockSize: vars.border.width.thin,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});
