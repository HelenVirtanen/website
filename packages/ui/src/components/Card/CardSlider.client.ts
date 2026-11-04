import { media, vars } from '@moscowcss/design-system';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

const INITIALIZED = 'data-card-slider-initialized';

// Имя переменной берём из контракта, а не строкой: при переименовании токена сломается сборка, а не слайдер.
const GAP_VAR = /^var\((--[^,)]+)/.exec(vars.adaptive.sliderGap)?.[1];
if (GAP_VAR === undefined) throw new Error(`CardSlider: неожиданный формат токена ${vars.adaptive.sliderGap}`);

// Значение токена в px по текущему корневому кеглю: выше 1920px корень растёт, поэтому читаем при каждом пересчёте.
function cssVarToPx(name: string): number {
  const style = getComputedStyle(document.documentElement);
  const raw = style.getPropertyValue(name).trim();
  if (!raw) return 0;
  if (raw.endsWith('rem')) return parseFloat(raw) * parseFloat(style.fontSize);
  return parseFloat(raw) || 0;
}

export function setupCardSlider(root: HTMLElement) {
  if (root.hasAttribute(INITIALIZED)) return;
  root.setAttribute(INITIALIZED, '');

  const container = root.querySelector<HTMLElement>('[data-card-slider-container]');
  const prev = root.querySelector<HTMLButtonElement>('[data-card-slider-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-card-slider-next]');
  if (!container || !prev || !next) return;

  // Отступ между слайдами меняется на этих ступенях; ширину слайда задаёт CSS (adaptive.cardWidth).
  // matchMedia — только внутри setupCardSlider: модуль импортируется и при серверном рендере.
  const gapQueries = [window.matchMedia(media.tablet), window.matchMedia(media.wide)];

  const swiper = new Swiper(container, {
    modules: [Navigation],
    direction: 'horizontal',
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    spaceBetween: cssVarToPx(GAP_VAR),
    navigation: {
      prevEl: prev,
      nextEl: next,
      disabledClass: 'swiper-button-disabled',
    },
    watchOverflow: true,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    resizeObserver: true,
  });

  // Высоту слайдов выравнивает CSS (stretch во flex-ряду, CardSlider.css.ts), ширину — тоже CSS.
  // Здесь — только отступ, и только когда он изменился: правка размеров слайдов из обработчика resize
  // будит ResizeObserver Swiper, и петля дёргала секцию и всё под ней на долю пикселя каждый кадр.
  const sync = () => {
    const gap = cssVarToPx(GAP_VAR);
    if (swiper.params.spaceBetween === gap) return;
    swiper.params.spaceBetween = gap;
    swiper.update();
  };

  swiper.on('resize', sync);
  gapQueries.forEach((query) => query.addEventListener('change', sync));
}
