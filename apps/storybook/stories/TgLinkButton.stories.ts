import TgLinkButton from '@moscowcss/ui/components/TgLinkButton';

export default {
  title: 'Components/TgLinkButton',
  component: TgLinkButton,
};

export const Default = {
  args: {
    href: 'https://t.me/moscowcss',
    'aria-label': 'Telegram Moscow CSS',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
};
