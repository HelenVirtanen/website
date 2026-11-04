import FallingDecor from '@moscowcss/ui/components/FallingDecor';
import { setupFallingDecor } from '../../../packages/ui/src/components/FallingDecor/FallingDecor.client';

// Скрипт Astro-компонента в канвасе Storybook не запускается: поднимаем слой вручную.
const start =
  (kind: 'springs' | 'snow') =>
  ({ canvasElement }: { canvasElement: HTMLElement }) => {
    window.localStorage.setItem('moscowcss-decor', JSON.stringify({ enabled: true, kind }));
    canvasElement.querySelectorAll<HTMLElement>('[data-falling-decor]').forEach(setupFallingDecor);
  };

export default {
  title: 'Components/FallingDecor',
  component: FallingDecor,
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, height: '30rem' } } },
};

export const Springs = { play: start('springs') };

export const Snow = { play: start('snow') };
