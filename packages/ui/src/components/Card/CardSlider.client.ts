import { media, vars } from '@moscowcss/design-system';
import Swiper from 'swiper';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import { loopSetCount, shuffled } from './sliderOrder';

const INITIALIZED = 'data-card-slider-initialized';
// Swiper закольцовывает ленту, только когда карточек больше, чем видно на экране; на широком окне видно до четырёх.
const MIN_LOOP_SLIDES = 8;

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

// Копии нужны только для кольца: скринридер и Tab проходят исходные карточки один раз.
function addLoopCopies(wrapper: Element) {
  const originals = Array.from(wrapper.children);
  const copies = loopSetCount(originals.length, MIN_LOOP_SLIDES) - 1;
  for (let set = 0; set < copies; set += 1) {
    for (const original of originals) {
      const copy = original.cloneNode(true) as HTMLElement;
      copy.setAttribute('aria-hidden', 'true');
      copy.querySelectorAll('a, button').forEach((control) => {
        control.setAttribute('tabindex', '-1');
      });
      wrapper.append(copy);
    }
  }
}

export function setupCardSlider(root: HTMLElement) {
  if (root.hasAttribute(INITIALIZED)) return;
  root.setAttribute(INITIALIZED, '');

  const container = root.querySelector<HTMLElement>('[data-card-slider-container]');
  const prev = root.querySelector<HTMLButtonElement>('[data-card-slider-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-card-slider-next]');
  const wrapper = root.querySelector('.swiper-wrapper');
  if (!container || !prev || !next || !wrapper) return;

  if (root.hasAttribute('data-card-slider-shuffle')) {
    wrapper.append(...shuffled(Array.from(wrapper.children), Math.random));
  }

  const autoplayMs = Number(root.dataset['cardSliderAutoplay']) || 0;
  const looped = autoplayMs > 0 && wrapper.children.length > 1;
  if (looped) addLoopCopies(wrapper);
  const autoplays = looped && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Отступ между слайдами меняется на этих ступенях; ширину слайда задаёт CSS (adaptive.cardWidth).
  // matchMedia — только внутри setupCardSlider: модуль импортируется и при серверном рендере.
  const gapQueries = [window.matchMedia(media.tablet), window.matchMedia(media.wide)];

  const swiper = new Swiper(container, {
    modules: [Navigation, Autoplay],
    loop: looped,
    autoplay: autoplays
      ? { delay: autoplayMs, disableOnInteraction: false, pauseOnMouseEnter: true }
      : false,
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

  // Пока человек читает карточку с клавиатуры, она не должна уезжать из-под фокуса.
  if (autoplays) {
    root.addEventListener('focusin', () => {
      swiper.autoplay.pause();
    });
    root.addEventListener('focusout', () => {
      swiper.autoplay.resume();
    });
  }
  gapQueries.forEach((query) => query.addEventListener('change', sync));
}
