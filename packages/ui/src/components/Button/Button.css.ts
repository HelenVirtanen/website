import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const button = style({
  boxSizing: 'border-box',
  display: vars.display.flex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  width: '100%',
  minHeight: vars.size.hitTarget,
  paddingBlock: vars.adaptive.buttonPaddingBlock,
  paddingInline: vars.adaptive.buttonPaddingInline,
  border: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.border}`,
  borderRadius: vars.radius.large,
  background: 'transparent',
  color: vars.color.text,
  font: vars.font.shorthand.buttonLabel,
  textAlign: 'center',
  textDecoration: 'none',
  cursor: 'pointer',
  opacity: 0.8,
  transitionProperty: 'background-color, color, border-color, opacity',
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.standard,
  selectors: {
    '&:hover': {
      opacity: 1,
      backgroundColor: vars.color.buttonHover,
      borderColor: vars.color.buttonHover,
      color: vars.color.onButtonHover,
    },
    '&:focus-visible': {
      outline: `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.focus}`,
      outlineOffset: vars.spacing.xs,
    },
  },
});

export const nav = style({
  paddingBlock: vars.adaptive.navButtonPaddingBlock,
  paddingInline: vars.adaptive.navButtonPaddingInline,
  borderRadius: vars.adaptive.navButtonRadius,
  font: vars.font.shorthand.navMono,
  opacity: 1,
});
