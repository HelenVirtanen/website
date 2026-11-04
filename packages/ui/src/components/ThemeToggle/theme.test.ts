import { describe, expect, it } from 'vitest';
import { readTheme, themeInitScript, writeTheme } from './theme';

const memoryStorage = (initial?: string) => {
  let value = initial ?? null;
  return {
    getItem: () => value,
    setItem: (_key: string, next: string) => {
      value = next;
    },
  };
};

const broken = {
  getItem: () => {
    throw new Error('запрещено');
  },
  setItem: () => {
    throw new Error('запрещено');
  },
};

describe('тема', () => {
  it('без выбора темы нет: она следует системной', () => {
    expect(readTheme(memoryStorage())).toBeUndefined();
    expect(readTheme(undefined)).toBeUndefined();
  });

  it('выбор сохраняется и читается', () => {
    const storage = memoryStorage();
    writeTheme(storage, 'dark');
    expect(readTheme(storage)).toBe('dark');
  });

  it('чужое значение не считается выбором', () => {
    expect(readTheme(memoryStorage('blue'))).toBeUndefined();
  });

  it('недоступное хранилище не роняет страницу', () => {
    expect(readTheme(broken)).toBeUndefined();
    expect(() => {
      writeTheme(broken, 'dark');
    }).not.toThrow();
  });
});

describe('themeInitScript', () => {
  const run = (localStorage: unknown) => {
    const documentElement = { dataset: {} as Record<string, string> };
    new Function('localStorage', 'document', themeInitScript)(localStorage, { documentElement });
    return documentElement.dataset['theme'];
  };

  it('ставит сохранённую тему и читает тот же ключ, что и writeTheme', () => {
    const storage = {
      value: '',
      setItem(_key: string, next: string) {
        this.value = next;
      },
      getItem() {
        return this.value;
      },
    };
    writeTheme(storage, 'dark');
    expect(run(storage)).toBe('dark');
  });

  it('без выбора и при недоступном хранилище ничего не ставит', () => {
    expect(run(memoryStorage())).toBeUndefined();
    expect(run(broken)).toBeUndefined();
    expect(run(memoryStorage('blue'))).toBeUndefined();
  });
});
