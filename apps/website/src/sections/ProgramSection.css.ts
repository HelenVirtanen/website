import { style } from '@vanilla-extract/css';
import { vars, media } from '@moscowcss/design-system';
import { inner, sectionPadding } from './sectionLayout.css';

export const section = style([
  sectionPadding,
  {
    position: vars.position.relative,
    color: vars.color.text,
    overflow: 'hidden',
    selectors: {
      '&::before': {
        content: '""',
        position: vars.position.absolute,
        inset: vars.inset.zero,
        opacity: 0.08,
        backgroundImage: `radial-gradient(circle at 20% 30%, ${vars.color.divider} 0, transparent 45%),
        radial-gradient(circle at 80% 70%, ${vars.color.divider} 0, transparent 40%)`,
        pointerEvents: 'none',
      },
    },
  },
]);

export { inner };

export const header = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.layout.gap.l,
  '@media': {
    [media.laptop]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: vars.justifyContent.spaceBetween,
      gap: vars.layout.gap.xxl,
    },
  },
});

export const hint = style({
  margin: 0,
  maxWidth: vars.size.programHintMaxWidth,
  color: vars.color.text,
  font: vars.font.shorthand.programDescription,
  letterSpacing: vars.font.letterSpacing.figmaWide,
});
