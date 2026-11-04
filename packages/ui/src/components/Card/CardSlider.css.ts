import { globalStyle, style } from '@vanilla-extract/css';
import { media, vars } from '@moscowcss/design-system';

export const root = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  gap: vars.adaptive.sliderHeaderGap,
  width: '100%',
});

// Заголовок и стрелки: на мобильном друг под другом, на планшете в строку, от wide снова колонкой.
export const head = style({
  display: vars.display.flex,
  flexDirection: vars.flexDirection.column,
  alignItems: 'flex-start',
  gap: vars.adaptive.sliderHeadGap,

  '@media': {
    [media.tablet]: {
      flexDirection: vars.flexDirection.row,
      flexWrap: 'wrap',
      alignItems: vars.alignItems.center,
      justifyContent: vars.justifyContent.spaceBetween,
      maxWidth: vars.size.sliderHeadWidth,
    },
    [media.wide]: {
      flexDirection: vars.flexDirection.column,
      flexWrap: 'nowrap',
      alignItems: 'flex-start',
      justifyContent: vars.justifyContent.flexStart,
      maxWidth: 'none',
    },
  },
});

export const nav = style({
  display: vars.display.flex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.flexStart,
  gap: vars.adaptive.arrowPairGap,
});

export const navButton = style({
  display: vars.display.inlineFlex,
  alignItems: vars.alignItems.center,
  justifyContent: vars.justifyContent.center,
  boxSizing: 'border-box',
  minWidth: `max(${vars.size.hitTarget}, ${vars.adaptive.arrowWidth})`,
  minHeight: `max(${vars.size.hitTarget}, ${vars.adaptive.arrowHeight})`,
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: vars.color.text,
  cursor: 'pointer',
  transition: `color ${vars.motion.duration.fast} ${vars.motion.easing.standard}`,
  selectors: {
    '&:hover:not(:disabled, .swiper-button-disabled)': {
      color: vars.color.link,
    },
    '&:disabled, &.swiper-button-disabled': {
      color: vars.color.disabled,
      cursor: 'not-allowed',
    },
  },
});

// Кончик и обводка стрелки выходят за viewBox, а preserveAspectRatio="none" иконка не наследует.
export const navButtonIcon = style({
  display: vars.display.block,
  width: vars.adaptive.arrowWidth,
  height: vars.adaptive.arrowHeight,
  flexShrink: 0,
  overflow: 'visible',
});

// Значок показывает, что сделает нажатие: идёт автопрокрутка — пауза, стоит — запуск.
export const pauseIcon = style({
  selectors: {
    '[aria-pressed="false"] > &': {
      display: vars.display.none,
    },
  },
});

export const playIcon = style({
  selectors: {
    '[aria-pressed="true"] > &': {
      display: vars.display.none,
    },
  },
});

export const navButtonIconPrev = style({
  transform: 'scaleX(-1)',
});

// Толщина зашита атрибутом на path, поэтому перекрываем на нём, а не на svg.
globalStyle(`${navButtonIcon} path`, {
  strokeWidth: vars.adaptive.arrowStroke,
});

// Справа лента уходит за край страницы, её режет секция, а слева обрезается по колонке текста.
export const swiper = style({
  width: '100%',
  overflow: 'hidden',
  selectors: {
    '&.swiper': {
      overflow: 'visible',
      clipPath: 'inset(0 -100vw 0 0)',
    },
    // Без скрипта стрелки не работают: лента листается сама, иначе карточки справа недоступны.
    [`${root}:not([data-card-slider-initialized]) &`]: {
      overflowX: 'auto',
    },
  },
});

globalStyle(`${root}:not([data-card-slider-initialized]) .swiper-wrapper`, {
  gap: vars.adaptive.sliderGap,
});

globalStyle(`${swiper} .swiper-wrapper`, {
  display: 'flex',
  alignItems: vars.alignItems.stretch,
  // Swiper по умолчанию height: 100% — без явной высоты контейнера stretch не работает.
  height: 'auto',
});

globalStyle(`${swiper} .swiper-slide`, {
  // Перебиваем swiper.css: height: 100% + display: block ломают выравнивание по самому высокому слайду.
  display: 'flex',
  height: 'auto',
  alignSelf: 'stretch',
  // slidesPerView: 'auto' — Swiper берёт ширину слайда из CSS, колонок не считает.
  width: vars.adaptive.cardWidth,
  maxWidth: '100%',
});

export const slide = style({
  boxSizing: 'border-box',
  display: vars.display.flex,
  flexShrink: 0,
  height: 'auto',
});

globalStyle(`${slide} > *`, {
  flex: '1 1 auto',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  minHeight: '100%',
  height: '100%',
});
