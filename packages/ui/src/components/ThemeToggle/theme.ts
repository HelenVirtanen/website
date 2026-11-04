export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'moscowcss-theme';

type ThemeStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** Сохранённый выбор; без выбора тема следует системной. Хранилище может быть недоступно. */
export function readTheme(storage: ThemeStorage | undefined): Theme | undefined {
  try {
    const value = storage?.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : undefined;
  } catch {
    return undefined;
  }
}

export function writeTheme(storage: ThemeStorage | undefined, theme: Theme): void {
  try {
    storage?.setItem(STORAGE_KEY, theme);
  } catch {
    // Без хранилища выбор живёт до конца страницы.
  }
}

/**
 * Скрипт для `<head>`: выполняется до первой отрисовки, поэтому светлая страница не мелькает перед тёмной.
 * Модульный скрипт для этого не подходит, он отложенный.
 */
export const themeInitScript = `try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;
