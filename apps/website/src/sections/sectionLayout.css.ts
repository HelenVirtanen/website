import { style } from '@vanilla-extract/css';
import { breakpoints, vars, media } from '@moscowcss/design-system';

export const sectionPadding = style({
  paddingBlock: vars.padding['4xl'],
  paddingInline: vars.layout.inset.xxl,
  '@media': {
    [media.mobile]: {
      paddingInline: vars.layout.inset.l,
    },
  },
});

export const inner = style({
  position: vars.position.relative,
  zIndex: 1,
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.xxl,
  width: '100%',
  maxWidth: breakpoints.desktop,
  marginInline: 'auto',
});
