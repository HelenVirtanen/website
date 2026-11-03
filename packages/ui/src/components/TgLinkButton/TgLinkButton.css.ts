import { style } from '@vanilla-extract/css';
import { vars, media } from '@moscowcss/design-system';

export const root = style({
  boxSizing: 'border-box',
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  width: vars.size.tgLinkButton,
  height: vars.size.tgLinkButton,
  padding: 0,
  borderRadius: 0,
  background: vars.color.background,
  border: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.divider}`,
  color: vars.color.tgBorder,
  textDecoration: 'none',
  selectors: {
    '&:focus-visible': {
      outline: `${vars.border.width.medium} ${vars.border.style.solid} ${vars.color.focus}`,
      outlineOffset: vars.spacing.xs,
    },
  },
  '@media': {
    [media.mobile]: {
      width: vars.size.tgLinkButtonCompact,
      height: vars.size.tgLinkButtonCompact,
    },
  },
});

const iconBase = {
  height: 'auto',
  flexShrink: 0,
} as const;

export const iconLarge = style({
  ...iconBase,
  display: vars.display.block,
  width: vars.size.tgLinkButtonIcon,
  '@media': {
    [media.mobile]: {
      display: vars.display.none,
    },
  },
});

export const iconSmall = style({
  ...iconBase,
  display: vars.display.none,
  width: vars.size.tgLinkButtonIconCompact,
  '@media': {
    [media.mobile]: {
      display: vars.display.block,
    },
  },
});
