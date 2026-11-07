import { style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';
import { inner, sectionPadding } from './sectionLayout.css';

export const section = style([
  sectionPadding,
  {
    color: vars.color.text,
    // Не hidden: такую секцию браузер прокручивает вбок при фокусе на карточке за краем, и она остаётся сдвинутой.
    overflow: 'clip',
  },
]);

export { inner };

export const slider = style({
  width: '100%',
});

// Карточка организатора шире карточки ЧАВО, а ширину слайда задаёт CSS. Длинный селектор перебивает правило слайдера.
export const slide = style({
  selectors: {
    [`${slider} .swiper-wrapper &`]: {
      width: vars.adaptive.organizerWidth,
    },
  },
});
