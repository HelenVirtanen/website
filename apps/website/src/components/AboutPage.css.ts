import { style } from '@vanilla-extract/css';
import { vars, media } from '@moscowcss/design-system';

// Цифры сообщества: три клетки с пунктирной рамкой, как плашка митапа в Hero.
export const stats = style({
  display: vars.display.grid,
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: vars.spacing.s,
  width: '100%',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const stat = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.spacing.xs,
  minWidth: 0,
  padding: vars.padding.l,
  border: `${vars.border.width.thin} ${vars.border.style.dashed} ${vars.color.border}`,
  '@media': {
    [media.laptop]: { padding: vars.padding.xxl },
  },
});

export const statValue = style({
  font: vars.font.shorthand.websiteTitle,
  letterSpacing: vars.font.letterSpacing.heading,
  color: vars.color.info,
});

export const statLabel = style({
  font: vars.font.shorthand.heroMeta,
  textTransform: 'uppercase',
  overflowWrap: 'anywhere',
});

export const contactsLead = style({
  margin: 0,
  maxWidth: vars.size.reviewDialogWidth,
  font: vars.font.shorthand.heroLead,
});

export const card = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: 'flex-start',
  gap: vars.spacing.m,
  height: '100%',
  boxSizing: 'border-box',
  padding: vars.padding.xxl,
  border: `${vars.border.width.thin} ${vars.border.style.dashed} ${vars.color.border}`,
});

export const cardTitle = style({
  margin: 0,
  font: vars.font.shorthand.h3,
  letterSpacing: vars.font.letterSpacing.heading,
});

export const cardText = style({
  margin: 0,
  flexGrow: 1,
  font: vars.font.shorthand.body,
});
