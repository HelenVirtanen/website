import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const blockTitle = style({
  margin: 0,
  padding: `${vars.padding.xl} ${vars.padding.xxxl} ${vars.layout.inset.l} ${vars.padding.xxxl}`,
  color: vars.color.text,
  font: vars.font.shorthand.blockTitle,
  letterSpacing: vars.font.letterSpacing.blockTitle,
  border: `${vars.border.width.thick} ${vars.border.style.dashed} ${vars.color.border}`,
  boxSizing: 'border-box',
  width: 'fit-content',
  maxWidth: '100%',
  overflowWrap: 'anywhere',
});

export const blockTitleWhite = style({
  color: vars.color.white,
  border: `${vars.border.width.thick} ${vars.border.style.dashed} ${vars.color.white}`,
});

export const blockTitleInverse = style({
  color: vars.color.onSurfaceDark,
  border: `${vars.border.width.thick} ${vars.border.style.dashed} ${vars.color.borderOnDark}`,
});
