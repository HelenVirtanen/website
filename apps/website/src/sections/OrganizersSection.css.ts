import { style } from '@vanilla-extract/css';
import { vars, media } from '@moscowcss/design-system';
import { inner, sectionPadding } from './sectionLayout.css';

export const section = style([
  sectionPadding,
  {
    color: vars.color.text,
    background: vars.color.background,
  },
]);

export { inner };

export const list = style({
  display: vars.display.flex,
  flexWrap: 'wrap',
  alignItems: vars.alignItems.stretch,
  gap: vars.layout.gap.l,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const item = style({
  display: vars.display.flex,
  flex: '0 1 auto',
  width: '100%',
  minWidth: 0,
  '@media': {
    [media.tablet]: { width: vars.adaptive.organizerWidth },
  },
});
