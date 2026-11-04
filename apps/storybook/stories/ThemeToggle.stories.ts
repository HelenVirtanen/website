import ThemeToggle from '@moscowcss/ui/components/ThemeToggle';
import { setupThemeToggles } from '../../../packages/ui/src/components/ThemeToggle/ThemeToggle.client';

export default {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
};

export const Default = {
  args: {
    label: 'Тёмная тема',
  },
  play: () => {
    setupThemeToggles();
  },
};
