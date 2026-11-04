import Button from '@moscowcss/ui/components/Button';

// Канвас общий для всех историй: ширину задаёт каждая история, иначе она перетекает в соседние.
const withWidth =
  (inlineSize: string) =>
  async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    canvasElement.style.inlineSize = inlineSize;
  };

export default {
  title: 'Components/Button',
  component: Button,
};

export const Default = {
  args: {
    slots: { default: 'Регистрация' },
  },
  play: withWidth(''),
};

export const Link = {
  args: {
    href: 'https://t.me/moscowcss',
    slots: { default: 'Telegram' },
  },
  play: withWidth(''),
};

export const Nav = {
  args: {
    size: 'nav',
    slots: { default: 'Telegram' },
  },
  play: withWidth(''),
};

export const NarrowParent = {
  args: {
    slots: { default: 'Зарегистрироваться на митап' },
  },
  play: withWidth('12rem'),
};

export const WideParent = {
  args: {
    slots: { default: 'Регистрация' },
  },
  play: withWidth('60rem'),
};
