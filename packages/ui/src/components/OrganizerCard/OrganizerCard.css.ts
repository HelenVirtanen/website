import { globalStyle, style } from '@vanilla-extract/css';
import { dimensions, vars } from '@moscowcss/design-system';

export const root = style({
  boxSizing: 'border-box',
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: vars.alignItems.center,
  gap: vars.adaptive.organizerGap,
  width: '100%',
  minWidth: 0,
  paddingBlock: vars.size.organizerPadding,
  color: vars.color.onSurfaceDark,
  background: vars.color.surfaceDark,
});

// Подложка с восьмигранным срезом отдельным слоем: контур фото уже вырезан в самом файле,
// и обрезка по подложке сдвинула бы его.
export const photo = style({
  position: vars.position.relative,
  flex: '0 0 auto',
  width: vars.size.organizerPhoto,
  height: vars.size.organizerPhoto,
  selectors: {
    '&::before': {
      content: '""',
      position: vars.position.absolute,
      inset: vars.inset.zero,
      background: vars.color.speakerAccent,
      clipPath: dimensions.octagon,
    },
  },
});

globalStyle(`${photo} img`, {
  position: vars.position.relative,
  display: vars.display.block,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const content = style({
  boxSizing: 'border-box',
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  width: '100%',
  minWidth: 0,
  paddingInline: vars.size.organizerPadding,
});

export const name = style({
  margin: 0,
  marginBlockEnd: vars.spacing.l,
  font: vars.font.shorthand.cardTitle,
  lineHeight: vars.adaptive.cardTitleLine,
  letterSpacing: vars.font.letterSpacing.heading,
  textTransform: 'uppercase',
  overflowWrap: 'anywhere',
  selectors: {
    '&::before': {
      content: '"/ "',
    },
  },
});

export const regalia = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  font: vars.font.shorthand.cardBody,
  lineHeight: vars.adaptive.cardBodyLine,
  overflowWrap: 'anywhere',
});

globalStyle(`${regalia} li`, {
  display: vars.display.flex,
  gap: vars.spacing.s,
});

globalStyle(`${regalia} li::before`, {
  content: '">"',
  flex: '0 0 auto',
});

export const contacts = style({
  alignSelf: 'flex-end',
  margin: 0,
  marginBlockStart: vars.spacing.l,
  padding: 0,
  listStyle: 'none',
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: 'flex-end',
  font: vars.font.shorthand.cardBody,
  lineHeight: vars.adaptive.cardBodyLine,
  textAlign: 'right',
});

export const contact = style({
  display: vars.display.flex,
  alignItems: vars.alignItems.center,
  gap: vars.spacing.s,
});

export const contactLabel = style({
  color: vars.color.onSurfaceDark,
});

export const contactLink = style({
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  minHeight: vars.size.hitTarget,
  color: vars.color.speakerAccent,
  overflowWrap: 'anywhere',
  selectors: {
    '&:focus-visible': {
      outline: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.focus}`,
      outlineOffset: vars.spacing.xs,
    },
  },
});
