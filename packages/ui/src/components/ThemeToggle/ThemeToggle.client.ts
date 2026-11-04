import { readTheme, writeTheme, type Theme } from './theme';

const INITIALIZED = 'data-theme-toggle-initialized';

// Хранилище может быть запрещено настройками браузера уже на чтении свойства.
function storageOf(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function setupThemeToggles() {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const buttons = Array.from(document.querySelectorAll<HTMLElement>('[data-theme-toggle]'));

  const current = (): Theme => {
    const chosen = root.dataset['theme'] ?? readTheme(storageOf());
    if (chosen === 'light' || chosen === 'dark') return chosen;
    return system.matches ? 'dark' : 'light';
  };

  const sync = () => {
    const pressed = String(current() === 'dark');
    for (const button of buttons) {
      button.hidden = false;
      button.setAttribute('aria-pressed', pressed);
    }
  };

  for (const button of buttons) {
    if (button.hasAttribute(INITIALIZED)) continue;
    button.setAttribute(INITIALIZED, '');
    button.addEventListener('click', () => {
      const next: Theme = current() === 'dark' ? 'light' : 'dark';
      root.dataset['theme'] = next;
      writeTheme(storageOf(), next);
      sync();
    });
  }

  system.addEventListener('change', sync);
  sync();
}
