import NavBar from '@moscowcss/ui/components/NavBar';
import { setupNavBar } from '../../../packages/ui/src/components/NavBar/NavBar.client';

export default {
  title: 'Components/NavBar',
  component: NavBar,
};

export const Default = {
  args: {
    links: [
      { href: '#registration', label: 'Регистрация' },
      { href: '#program', label: 'Программа' },
      { href: '#partners', label: 'Партнеры' },
      { href: '#address', label: 'Адрес' },
    ],
    telegramHref: 'https://t.me/moscowcss',
    telegramLabel: 'Telegram Moscow CSS',
    menuLabel: 'Меню',
    closeLabel: 'Закрыть меню',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    canvasElement.querySelectorAll<HTMLElement>('[data-navbar]').forEach(setupNavBar);
  },
};
