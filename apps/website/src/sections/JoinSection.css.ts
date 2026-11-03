import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';
import { inner, sectionPadding } from './sectionLayout.css';

export const section = style([
  sectionPadding,
  {
    position: vars.position.relative,
    color: vars.color.text,
    background: vars.color.blackBg,
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
