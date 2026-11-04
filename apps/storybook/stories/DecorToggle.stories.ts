import DecorToggle from '@moscowcss/ui/components/DecorToggle';

const show = ({ canvasElement }: { canvasElement: HTMLElement }) => {
  // Переключатели показывает скрипт падающего слоя; в истории его нет.
  canvasElement.querySelectorAll<HTMLElement>('[data-decor-toggle]').forEach((toggle) => {
    toggle.hidden = false;
  });
};

export default {
  title: 'Components/DecorToggle',
  component: DecorToggle,
};

export const Default = {
  args: {
    label: 'Выключить пружинки',
  },
  play: show,
};
