import { style } from '@vanilla-extract/css';
import { media, vars } from '@moscowcss/design-system';

export const blockTitle = style({
  padding: `${vars.padding.xl} ${vars.padding.xxxl} ${vars.layout.inset.l} ${vars.padding.xxxl}`,
  color: vars.color.text,
  font: vars.font.shorthand.subtitle,
  border: `${vars.border.width.thick} ${vars.border.style.dashed} ${vars.color.border}`,
  width: 'fit-content',
  '@media': {
    [media.tablet]: {
      font: vars.font.shorthand.blockTitle,
    },
  },
});

export const blockTitleWhite = style({
  color: vars.color.white,
  border: `${vars.border.width.thick} ${vars.border.style.dashed} ${vars.color.white}`,
});

export const blockTitleInverse = style({
  color: vars.color.onSurfaceDark,
  border: `${vars.border.width.thick} ${vars.border.style.dashed} ${vars.color.borderOnDark}`,
});
