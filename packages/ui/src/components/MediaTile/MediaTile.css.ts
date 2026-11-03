import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const frame = style({
  position: vars.position.relative,
  display: vars.display.block,
  width: '100%',
  height: '100%',
  minWidth: 0,
  margin: 0,
  overflow: 'hidden',
});

export const image = style({
  display: vars.display.block,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const placeholder = style({
  display: vars.display.flex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  width: '100%',
  height: '100%',
  background: vars.color.surfaceDarkMuted,
});

export const videoLink = style({
  position: vars.position.relative,
  display: vars.display.flex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  width: '100%',
  height: '100%',
  color: 'inherit',
  textDecoration: 'none',
});

export const play = style({
  display: vars.display.block,
  width: '3rem',
  height: '3rem',
  border: `${vars.border.width.thick} ${vars.border.style.solid} ${vars.color.onSurfaceDark}`,
  borderRadius: '50%',
  selectors: {
    '&::before': {
      content: '""',
      display: vars.display.block,
      width: 0,
      height: 0,
      marginTop: '0.65rem',
      marginLeft: '1.1rem',
      borderWidth: '0.6rem 0 0.6rem 1rem',
      borderStyle: 'solid',
      borderColor: `transparent transparent transparent ${vars.color.onSurfaceDark}`,
    },
  },
});
