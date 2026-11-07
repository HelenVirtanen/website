import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

// Точки — стена, на которой висят листки; фона у неё нет, поэтому падающие фигуры видны насквозь.
export const root = style({
  paddingBlock: vars.padding.xl,
  paddingInline: vars.padding.l,
  backgroundImage: `radial-gradient(${vars.color.dividerSoft} ${vars.border.width.medium}, transparent 0)`,
  backgroundSize: `${vars.size.reviewDots} ${vars.size.reviewDots}`,
});

export const grid = style({
  display: vars.display.grid,
  gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${vars.size.reviewSticker}), 1fr))`,
  gap: vars.layout.gap.xxl,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

// Без скрипта адрес стикера ведёт на якорь окна. У окна без showModal нет верхнего слоя браузера, а родитель стены —
// свой контекст наложения, поэтому над шапку поднимаем его, иначе шапка закроет имя и ссылку закрытия.
globalStyle(`:has(> ${root}:not([data-review-ready]) dialog:target)`, {
  zIndex: vars.zIndex.skipLink,
});

globalStyle(`${root}:not([data-review-ready]) dialog:target`, {
  display: vars.display.block,
  position: vars.position.fixed,
  inset: vars.inset.zero,
  height: 'fit-content',
  margin: 'auto',
  zIndex: vars.zIndex.skipLink,
});
