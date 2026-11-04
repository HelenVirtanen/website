import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';
import { inner, sectionPadding } from './sectionLayout.css';

export const section = style([
  sectionPadding,
  {
    color: vars.color.text,
    background: vars.color.background,
    overflow: 'hidden',
  },
]);

export { inner };

export const slider = style({
  width: '100%',
});
