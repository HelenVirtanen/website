import type { Decorator } from 'storybook/internal/csf';
import '@moscowcss/fonts';
// Один раз подключаем слой дизайн-токенов, чтобы у каждой истории были
// :root CSS-переменные, которые используют стили vanilla-extract компонентов.
import '@moscowcss/design-system';
// Глобальный отступ канваса — чтобы выступающие детали историй не обрезались.
import './preview.css';
import { setupCardSlider } from '../../../packages/ui/src/components/Card/CardSlider.client';
import { setupNavBar } from '../../../packages/ui/src/components/NavBar/NavBar.client';
import { setupThemeToggles } from '../../../packages/ui/src/components/ThemeToggle/ThemeToggle.client';

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

const initThemeToggles: Decorator = (Story, { canvasElement }) => {
  observeCanvasInit(canvasElement, '[data-theme-toggle]', () => {
    setupThemeToggles();
  });
  return Story();
};

const initCardSliders: Decorator = (Story, { canvasElement }) => {
  observeCanvasInit(canvasElement, '[data-card-slider]', setupCardSlider);
  return Story();
};

// Тема меняет только цвет: фон холста берётся из токена, а не из настроек Storybook.
const applyTheme: Decorator = (story, context) => {
  document.documentElement.dataset['theme'] = String(context.globals['theme'] ?? 'light');
  return story();
};

const preview = {
  decorators: [applyTheme, initNavBars, initThemeToggles, initCardSliders],
  globalTypes: {
    theme: {
      description: 'Тема',
      toolbar: {
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Светлая' },
          { value: 'dark', title: 'Тёмная' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  // Автодок для каждого компонента без ручного тега на каждой истории.
  tags: ['autodocs'],
};

export default preview;
