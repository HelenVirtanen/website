import type { Decorator } from 'storybook/internal/csf';
import CallToAction from '@moscowcss/ui/components/CallToAction';

// Закреплённая кнопка привязана к вьюпорту; transform на обёртке делает её контейнером для fixed,
// поэтому кнопка остаётся в кадре истории и документации, а фон родителя задаёт контраст.
const onBackground =
  (background: string, color: string): Decorator =>
  (Story, { canvasElement }) => {
    Object.assign(canvasElement.style, {
      transform: 'translateZ(0)',
      minHeight: '20rem',
      background,
      color,
    });
    return Story();
  };

export default {
  title: 'Components/CallToAction',
  component: CallToAction,
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 360 } },
  },
};

export const Button = {
  args: {
    'aria-label': 'Регистрация на митап',
    slots: { default: 'position: в зале' },
  },
  decorators: [onBackground('var(--color-white)', 'var(--color-text)')],
};

export const Link = {
  args: {
    href: 'https://moscowcss.timepad.ru/event/4044448/#register',
    'aria-label': 'Регистрация на митап',
    slots: { default: 'position: в зале' },
  },
  decorators: [onBackground('var(--color-white)', 'var(--color-text)')],
};

export const OnBlack = {
  args: {
    href: 'https://moscowcss.timepad.ru/event/4044448/#register',
    'aria-label': 'Регистрация на митап',
    slots: { default: 'position: в зале' },
  },
  decorators: [onBackground('var(--color-blackBg)', 'var(--color-white)')],
};
