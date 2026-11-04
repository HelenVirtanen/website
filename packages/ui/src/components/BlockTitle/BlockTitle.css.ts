import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const blockTitle = style({
  margin: 0,
  paddingBlock: `${vars.padding.xl} ${vars.padding.l}`,
  paddingInline: vars.adaptive.blockTitlePaddingInline,
  color: vars.color.text,
  font: vars.font.shorthand.blockTitle,
  letterSpacing: vars.font.letterSpacing.blockTitle,
  border: `${vars.border.width.thick} ${vars.border.style.dashed} ${vars.color.border}`,
  boxSizing: 'border-box',
  width: 'fit-content',
  maxWidth: '100%',
  // Длинное слово на узком экране делится по слогам, а не посреди буквы.
  hyphens: 'auto',
  overflowWrap: 'break-word',
});

export const blockTitleWhite = style({
  color: vars.color.white,
  border: `${vars.border.width.thick} ${vars.border.style.dashed} ${vars.color.white}`,
});

export const blockTitleInverse = style({
  color: vars.color.onSurfaceDark,
  border: `${vars.border.width.thick} ${vars.border.style.dashed} ${vars.color.borderOnDark}`,
});
