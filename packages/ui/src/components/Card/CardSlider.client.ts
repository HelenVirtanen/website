import { media, vars } from '@moscowcss/design-system';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

const INITIALIZED = 'data-card-slider-initialized';

// Имя переменной берём из контракта, а не строкой: при переименовании токена сломается сборка, а не слайдер.
const GAP_VAR = /^var\((--[^,)]+)/.exec(vars.layout.gap.l)?.[1];
if (GAP_VAR === undefined) throw new Error(`CardSlider: неожиданный формат токена ${vars.layout.gap.l}`);

// Значение токена в px по текущему корневому кеглю: выше 1920px корень растёт, поэтому читаем при каждом пересчёте.
function cssVarToPx(name: string): number {
  const style = getComputedStyle(document.documentElement);
  const raw = style.getPropertyValue(name).trim();
  if (!raw) return 0;
  if (raw.endsWith('rem')) return parseFloat(raw) * parseFloat(style.fontSize);
  return parseFloat(raw) || 0;
}

// Пороги — те же строки медиазапросов, что в CSS. Пересчёт rem в px через кегль корня здесь неверен:
// rem в @media считается от исходного кегля браузера, а корень выше 1920px растёт (ADR-002).
// matchMedia — только внутри setupCardSlider: модуль импортируется и при серверном рендере.
function slidesPerView(laptop: MediaQueryList, desktop: MediaQueryList): number {
  if (desktop.matches) return 4;
  if (laptop.matches) return 3;
  return 1;
}

function equalizeSlideHeights(container: HTMLElement) {
  const slides = Array.from(container.querySelectorAll<HTMLElement>('.swiper-slide'));
  if (slides.length === 0) return;

  slides.forEach((slide) => {
    slide.style.height = '';
  });

  const maxHeight = slides.reduce((max, slide) => Math.max(max, slide.offsetHeight), 0);
  if (maxHeight <= 0) return;

  const height = `${maxHeight}px`;
  slides.forEach((slide) => {
    slide.style.height = height;
  });
}

export function setupCardSlider(root: HTMLElement) {
  if (root.hasAttribute(INITIALIZED)) return;
  root.setAttribute(INITIALIZED, '');

  const container = root.querySelector<HTMLElement>('[data-card-slider-container]');
  const prev = root.querySelector<HTMLButtonElement>('[data-card-slider-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-card-slider-next]');
  if (!container || !prev || !next) return;

  const laptopQuery = window.matchMedia(media.laptop);
  const desktopQuery = window.matchMedia(media.desktop);

  const swiper = new Swiper(container, {
    modules: [Navigation],
    direction: 'horizontal',
    slidesPerView: slidesPerView(laptopQuery, desktopQuery),
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

  const refresh = () => {
    requestAnimationFrame(() => {
      const slides = container.querySelectorAll<HTMLElement>('.swiper-slide');
      slides.forEach((slide) => {
        slide.style.height = '';
      });
      swiper.params.slidesPerView = slidesPerView(laptopQuery, desktopQuery);
      swiper.params.spaceBetween = cssVarToPx(GAP_VAR);
      swiper.update();
      requestAnimationFrame(() => {
        equalizeSlideHeights(container);
      });
    });
  };

  swiper.on('init resize slideChange transitionEnd', refresh);
  laptopQuery.addEventListener('change', refresh);
  desktopQuery.addEventListener('change', refresh);
  refresh();
}

