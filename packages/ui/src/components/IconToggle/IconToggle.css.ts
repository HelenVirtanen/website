import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

export const root = style({
  position: vars.position.relative,
  boxSizing: 'border-box',
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  flexShrink: 0,
  minWidth: vars.size.hitTarget,
  minHeight: vars.size.hitTarget,
  padding: 0,
  border: 0,
  background: 'transparent',
  color: vars.color.text,
  cursor: 'pointer',
  transitionProperty: 'color',
  transitionDuration: vars.motion.duration.fast,
  transitionTimingFunction: vars.motion.easing.standard,
  selectors: {
    '&:hover': {
      color: vars.color.link,
    },
    '&[hidden]': {
      display: vars.display.none,
    },
  },
});

globalStyle(`${root} svg`, {
  display: vars.display.block,
  width: vars.size.burgerIcon,
  height: vars.size.burgerIcon,
});

export const crossed = style({
  selectors: {
    '&[aria-pressed="false"]::after': {
      content: '""',
      position: vars.position.absolute,
      insetBlockStart: '50%',
      insetInlineStart: '50%',
      width: `calc(${vars.size.burgerIcon} * 1.3)`,
      height: vars.border.width.medium,
      background: 'currentColor',
      borderRadius: vars.radius.small,
      transform: 'translate(-50%, -50%) rotate(-45deg)',
    },
  },
});
