import type { Decorator } from 'storybook/internal/csf';
import '@moscowcss/fonts';
// Один раз подключаем слой дизайн-токенов, чтобы у каждой истории были
// :root CSS-переменные, которые используют стили vanilla-extract компонентов.
import '@moscowcss/design-system';
// Глобальный отступ канваса — чтобы выступающие детали историй не обрезались.
import './preview.css';
import { setupCardSlider } from '../../../packages/ui/src/components/Card/CardSlider.client';
import { setupNavBar } from '../../../packages/ui/src/components/NavBar/NavBar.client';

// Astro-компонентные <script> в renderMode 'server' не попадают в канвас — инициализируем вручную.
function observeCanvasInit(
  canvasElement: HTMLElement,
  selector: string,
  init: (el: HTMLElement) => void,
): void {
  const tryInit = () => {
    const nodes = canvasElement.querySelectorAll<HTMLElement>(selector);
    if (nodes.length === 0) return false;
    nodes.forEach(init);
    return true;
  };

  const observer = new MutationObserver(() => {
    if (tryInit()) observer.disconnect();
  });

  observer.observe(canvasElement, { childList: true, subtree: true });
  tryInit();
}

const initNavBars: Decorator = (Story, { canvasElement }) => {
  observeCanvasInit(canvasElement, '[data-navbar]', setupNavBar);
  return Story();
};

const initCardSliders: Decorator = (Story, { canvasElement }) => {
  observeCanvasInit(canvasElement, '[data-card-slider]', setupCardSlider);
  return Story();
};

const preview = {
  decorators: [initNavBars, initCardSliders],
  // Автодок для каждого компонента без ручного тега на каждой истории.
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      options: {
        light: { name: 'Light', value: '#ffffff' },
        dark: { name: 'Dark', value: '#0f172a' },
      },
    },
  },
};

export default preview;
