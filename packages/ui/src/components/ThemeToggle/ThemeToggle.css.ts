import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

// Значок показывает, куда переключит нажатие: на светлой теме луна, на тёмной солнце.
export const moon = style({
  selectors: {
    '[aria-pressed="true"] > &': {
      display: vars.display.none,
    },
  },
});

export const sun = style({
  selectors: {
    '[aria-pressed="false"] > &': {
      display: vars.display.none,
    },
  },
});
