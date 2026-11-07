import { describe, expect, it } from 'vitest';
import { createRandom } from '../TagPile/pile';
import { fallingCount, fallingItems, gridPoints, overlapsAny, readDecorOff, writeDecorOff } from './falling';

const memoryStorage = () => {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
};

describe('readDecorOff', () => {
  it('без сохранённого выбора фигуры включены', () => {
    expect(readDecorOff(memoryStorage())).toBe(false);
    expect(readDecorOff(undefined)).toBe(false);
  });

  it('читает то, что записал writeDecorOff, в обе стороны', () => {
    const storage = memoryStorage();
    writeDecorOff(storage, true);
    expect(readDecorOff(storage)).toBe(true);
    writeDecorOff(storage, false);
    expect(readDecorOff(storage)).toBe(false);
  });

  it('запрет на чтение и запись не роняет страницу', () => {
    const fail = () => {
      throw new Error('SecurityError');
    };
    const blocked = { getItem: fail, setItem: fail, removeItem: fail };
    expect(readDecorOff(blocked)).toBe(false);
    expect(() => {
      writeDecorOff(blocked, true);
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
      expect(item.bounceMs).toBeGreaterThan(0);
    });
  });

  it('разные сиды дают разное падение, одинаковые — одинаковое', () => {
    expect(fallingItems(6, createRandom(1))).toEqual(fallingItems(6, createRandom(1)));
    expect(fallingItems(6, createRandom(1))).not.toEqual(fallingItems(6, createRandom(2)));
  });
});

describe('gridPoints', () => {
  it('раскладывает точки равномерно внутри фигуры', () => {
    const points = gridPoints({ left: 10, right: 40, top: 0, bottom: 30 }, 3);
    expect(points).toHaveLength(9);
    expect(points[0]).toEqual({ x: 15, y: 5 });
    expect(points[8]).toEqual({ x: 35, y: 25 });
  });
});

describe('overlapsAny', () => {
  const box = { left: 10, right: 20, top: 10, bottom: 20 };

  it('видит пересечение с любым блоком', () => {
    expect(overlapsAny(box, [{ left: 100, right: 200, top: 0, bottom: 50 }, { left: 15, right: 30, top: 15, bottom: 30 }])).toBe(true);
  });

  it('фигура вплотную к блоку и вне блока его не задевает', () => {
    expect(overlapsAny(box, [{ left: 20, right: 30, top: 10, bottom: 20 }])).toBe(false);
    expect(overlapsAny(box, [{ left: 100, right: 200, top: 100, bottom: 200 }])).toBe(false);
    expect(overlapsAny(box, [])).toBe(false);
  });

  it('скрытый элемент с нулевым размером не считается текстом', () => {
    expect(overlapsAny(box, [{ left: 15, right: 15, top: 15, bottom: 15 }])).toBe(false);
  });
});
