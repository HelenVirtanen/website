import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { vars, media } from '@moscowcss/design-system';

const line = `${vars.border.width.thin} ${vars.border.style.solid} ${vars.color.border}`;

// Рамка таблицы из макета: у сетки — верх и лево, у ячейки — право и низ, соседние линии не двоятся.
export const root = style({
  display: vars.display.grid,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  borderBlockStart: line,
  borderInlineStart: line,
  color: vars.color.text,
  selectors: {
    '&[hidden]': { display: vars.display.none },
  },
});

globalStyle(`${root} > li`, {
  minWidth: 0,
  borderInlineEnd: line,
  borderBlockEnd: line,
});

export const columnsOf = styleVariants({
  single: { gridTemplateColumns: '1fr' },
  auto: {
    gridTemplateColumns: '1fr',
    '@media': {
      [media.tablet]: {
        gridTemplateColumns: `repeat(auto-fill, minmax(${vars.size.archiveCardMin}, 1fr))`,
      },
    },
  },
});
