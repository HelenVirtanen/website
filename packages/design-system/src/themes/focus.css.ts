import { globalStyle } from '@vanilla-extract/css';
import { vars } from '../contract';

// Единственное правило фокуса на весь сайт: компоненты своих не пишут, иначе кольца снова разъедутся.
// Блок с обратным фоном подменяет только токен цвета.
globalStyle(':focus-visible', {
  outline: `${vars.border.width.medium} ${vars.border.style.solid} ${vars.color.focus}`,
  outlineOffset: vars.spacing.xs,
  borderRadius: vars.radius.large,
});

globalStyle('::selection', {
  color: vars.color.onButtonHover,
  background: vars.color.buttonHover,
});
