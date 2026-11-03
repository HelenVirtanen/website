import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

// Форма кнопки из макета: вытянутый шестиугольник со срезанными углами. Проценты —
// доли ширины/высоты bounding box макета (729×183.242), поэтому форма тянется за контентом. Одна и та же форма на
// подложке и на кольце фокуса — чтобы кольцо точно повторяло силуэт.
const shape =
  'polygon(29.33% 0, 70.89% 0, 100% 29.11%, 100% 71.11%, 71.11% 100%, 28.89% 100%, 0 71.11%, 0 28.89%)';

export const root = style({
  position: vars.position.relative,
  isolation: 'isolate',
  display: vars.display.inlineFlex,
  overflow: 'visible',
  padding: 0,
  border: 'none',
  background: 'none',
  color: 'inherit',
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: 'none',
    },
    // Кольцо фокуса и «зазор» перед ним — два слоя одной формы за подложкой.
    // clip-path режет только сам псевдоэлемент (root не обрезан), поэтому они
    // могут выступать за пределы кнопки.
    '&::before, &::after': {
      content: '""',
      position: vars.position.absolute,
      clipPath: shape,
      opacity: 0,
      transition: 'opacity 120ms ease',
      pointerEvents: 'none',
    },
    // Нижний слой — кольцо цвета brand, выступает на (зазор + толщина кольца).
    '&::before': {
      inset: `calc(${vars.spacing.xs} * -2)`,
      zIndex: vars.zIndex.ring,
      background: vars.color.focus,
    },
    // Средний слой — цвет фона, перекрывает внутреннюю часть кольца и создаёт
    // «расстояние» между кнопкой и кольцом.
    '&::after': {
      inset: `calc(${vars.spacing.xs} * -1)`,
      zIndex: vars.zIndex.mask,
      background: vars.color.background,
    },
    '&:focus-visible::before, &:focus-visible::after': {
      opacity: 1,
    },
  },
});

// Видимая грань кнопки — верхний слой над кольцом. Hover-обводка внутрь:
// ::before — контур border-цвета на полном размере, ::after — заливка с inset,
// чтобы кнопка не росла при наведении.
export const face = style({
  position: vars.position.relative,
  zIndex: vars.zIndex.content,
  display: vars.display.inlineFlex,
  overflow: 'visible',
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  width: '45rem',
  height: '11rem',
  paddingBlock: vars.padding.xl,
  paddingInline: `calc(${vars.layout.inset.xxl} * 2)`,
  color: vars.color.onAction,
  font: vars.font.shorthand.registration,
  letterSpacing: vars.font.letterSpacing.registration,
  textAlign: 'center',
  transition: 'color 120ms ease',
  selectors: {
    '&::before, &::after': {
      content: '""',
      position: vars.position.absolute,
      clipPath: shape,
      pointerEvents: 'none',
    },
    '&::before': {
      inset: 0,
      background: vars.color.action,
      zIndex: -2,
      transition: 'background 120ms ease',
    },
    '&::after': {
      inset: 0,
      background: vars.color.actionHover,
      zIndex: -1,
      opacity: 0,
      transition: 'opacity 120ms ease, inset 120ms ease',
    },
    [`${root}:hover &::before`]: {
      background: vars.color.border,
    },
    [`${root}:hover &::after`]: {
      inset: vars.border.width.superThick,
      opacity: 1,
    },
    [`${root}:active &::before`]: {
      background: vars.color.border,
    },
    [`${root}:active &::after`]: {
      inset: vars.border.width.superThick,
      opacity: 1,
      background: vars.color.background,
    },
    [`${root}:active &`]: {
      color: vars.color.text,
    },
    'a:hover &': {
      textDecoration: 'underline',
    },
  },
});
