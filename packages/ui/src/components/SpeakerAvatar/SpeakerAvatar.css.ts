import { style } from '@vanilla-extract/css';
import { vars, media } from '@moscowcss/design-system';

// Восьмиугольник из макета — срезанные углы квадрата.
const octagon =
  'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';

export const frame = style({
  position: vars.position.relative,
  flexShrink: 0,
  width: vars.size.speakerAvatar,
  height: vars.size.speakerAvatar,
  background: vars.color.danger,
  clipPath: octagon,
  '@media': {
    [media.laptop]: {
      width: vars.size.speakerAvatarLaptop,
      height: vars.size.speakerAvatarLaptop,
    },
  },
});

export const image = style({
  position: vars.position.absolute,
  inset: vars.border.width.thick,
  width: `calc(100% - 2 * ${vars.border.width.thick})`,
  height: `calc(100% - 2 * ${vars.border.width.thick})`,
  objectFit: 'cover',
  clipPath: octagon,
});

export const placeholder = style({
  position: vars.position.absolute,
  inset: vars.border.width.thick,
  display: vars.display.block,
  width: `calc(100% - 2 * ${vars.border.width.thick})`,
  height: `calc(100% - 2 * ${vars.border.width.thick})`,
  background: vars.color.divider,
  clipPath: octagon,
});
