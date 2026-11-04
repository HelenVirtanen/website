import { describe, expect, it } from 'vitest';
import { createRandom } from '../TagPile/pile';
import { defaultDecor, fallingCount, fallingItems, readDecor, writeDecor } from './falling';

const memoryStorage = (initial: string | null = null) => {
  let value = initial;
  return {
    getItem: () => value,
    setItem: (_key: string, next: string) => {
      value = next;
    },
  };
};

describe('readDecor', () => {
  it('без сохранённого выбора пружинки включены', () => {
    expect(readDecor(memoryStorage())).toEqual(defaultDecor);
    expect(readDecor(undefined)).toEqual(defaultDecor);
  });

  it('читает то, что записал writeDecor', () => {
    const storage = memoryStorage();
    writeDecor(storage, { enabled: false, kind: 'snow' });
    expect(readDecor(storage)).toEqual({ enabled: false, kind: 'snow' });
  });

  it('испорченная запись и незнакомый вид дают значения по умолчанию', () => {
    expect(readDecor(memoryStorage('{не json'))).toEqual(defaultDecor);
    expect(readDecor(memoryStorage('{"kind":"rain"}'))).toEqual(defaultDecor);
  });

  it('запрет на чтение и запись не роняет страницу', () => {
    const blocked = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };
    expect(readDecor(blocked)).toEqual(defaultDecor);
    expect(() => {
      writeDecor(blocked, defaultDecor);
    }).not.toThrow();
  });
});

describe('fallingCount', () => {
  it('растёт с шириной окна и не выходит за пределы', () => {
    expect(fallingCount(320)).toBe(6);
    expect(fallingCount(1440)).toBe(12);
    expect(fallingCount(3840)).toBe(24);
  });
});

describe('fallingItems', () => {
  it('фигуры идут по своим столбцам, а значения в разумных пределах', () => {
    const items = fallingItems(12, createRandom(3));
    expect(items).toHaveLength(12);
    items.forEach((item, index) => {
      expect(item.leftPercent).toBeGreaterThanOrEqual((index / 12) * 100);
      expect(item.leftPercent).toBeLessThan(((index + 1) / 12) * 100);
      expect(item.fallMs).toBeGreaterThanOrEqual(20000);
      expect(item.delayMs).toBeLessThanOrEqual(0);
      expect(item.delayMs).toBeGreaterThanOrEqual(-item.fallMs);
      expect(item.spinMs).toBeGreaterThan(0);
    });
  });

  it('разные сиды дают разное падение, одинаковые — одинаковое', () => {
    expect(fallingItems(6, createRandom(1))).toEqual(fallingItems(6, createRandom(1)));
    expect(fallingItems(6, createRandom(1))).not.toEqual(fallingItems(6, createRandom(2)));
  });
});
