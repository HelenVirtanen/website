import CardSliderDemo from './CardSlider.astro';

export default {
  title: 'Components/Card',
  component: CardSliderDemo,
};

type PlayContext = { canvasElement: HTMLElement };

// Слайдер оживает асинхронно (декоратор в preview.ts), поэтому ждём его инициализации.
async function clickNext(canvasElement: HTMLElement, times: number) {
  const root = canvasElement.querySelector<HTMLElement>('[data-card-slider]');
  for (let attempt = 0; attempt < 50 && !root?.hasAttribute('data-card-slider-initialized'); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  const next = canvasElement.querySelector<HTMLButtonElement>('[data-card-slider-next]');
  for (let i = 0; i < times; i++) next?.click();
}

// Начало ленты: «назад» недоступна (серая, not-allowed), «вперёд» активна (чёрная, при наведении синяя).
export const Slider = {};

// Сама листается раз в две секунды и идёт по кругу, как организаторы на главной.
export const SliderAutoplay = {
  args: { autoplayMs: 2000 },
};

// Середина ленты: обе стрелки активны.
export const SliderMiddle = {
  play: ({ canvasElement }: PlayContext) => clickNext(canvasElement, 1),
};

// Конец ленты: «вперёд» недоступна.
export const SliderEnd = {
  play: ({ canvasElement }: PlayContext) => clickNext(canvasElement, 10),
};

// Карточек мало, лента не листается: обе стрелки недоступны.
export const SliderShort = {
  args: { count: 1 },
};
