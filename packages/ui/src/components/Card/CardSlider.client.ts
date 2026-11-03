import { breakpoints } from '@moscowcss/design-system';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

const INITIALIZED = 'data-card-slider-initialized';

function cssVarToPx(name: string): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return 0;
  if (raw.endsWith('rem')) {
    const rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return parseFloat(raw) * rootFont;
  }
  if (raw.endsWith('px')) return parseFloat(raw);
  return parseFloat(raw) || 0;
}

function remToPx(rem: string): number {
  const rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return parseFloat(rem) * rootFont;
}

function laptopMinWidthPx(): number {
  return Math.round(remToPx(breakpoints.laptop));
}

function desktopMinWidthPx(): number {
  return Math.round(remToPx(breakpoints.desktop));
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

  const spaceBetween = cssVarToPx('--layout-gap-l');
  const laptop = laptopMinWidthPx();
  const desktop = desktopMinWidthPx();

  const swiper = new Swiper(container, {
    modules: [Navigation],
    direction: 'horizontal',
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween,
    breakpoints: {
      [laptop]: {
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween,
      },
      [desktop]: {
        slidesPerView: 4,
        slidesPerGroup: 1,
        spaceBetween,
      },
    },
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
      swiper.update();
      requestAnimationFrame(() => {
        equalizeSlideHeights(container);
      });
    });
  };

  swiper.on('init resize slideChange transitionEnd', refresh);
  refresh();
}

