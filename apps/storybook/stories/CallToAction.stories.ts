import CallToAction from '@moscowcss/ui/components/CallToAction';

export default {
  title: 'Components/CallToAction',
  component: CallToAction,
};

export const Button = {
  args: {
    slots: { default: 'Регистрация' },
  },
};

export const Link = {
  args: {
    href: 'https://moscowcss.timepad.ru/event/4044448/#register',
    slots: { default: 'Регистрация' },
  },
};
