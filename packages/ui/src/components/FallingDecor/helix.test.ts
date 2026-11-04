import { describe, expect, it } from 'vitest';
import { helixBox, helixPaths, helixShapes, helixStretch } from './helix';

const pointsOf = (path: string): number[][] =>
  [...path.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map((match) => [Number(match[1]), Number(match[2])]);

const shape = helixShapes[0]!;

const spanOf = (stretch: number): number[] => {
  const { front, back } = helixPaths(shape, 0, stretch);
  const ys = pointsOf(front + back).map(([, y]) => y ?? 0);
  return [Math.min(...ys), Math.max(...ys)];
};

describe('helixPaths', () => {
  it('при любой фазе спираль остаётся в своём кадре', () => {
    for (const candidate of helixShapes) {
      const box = helixBox(candidate);
      for (const phase of [0, 1, 2, 3, 4, 5, 6]) {
        const { front, back } = helixPaths(candidate, phase);
        for (const [x, y] of pointsOf(front + back)) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(box.width);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThanOrEqual(box.height);
        }
      }
    }
  });

  it('вращение двигает концы пружинки: это поворот, а не сдвиг витков', () => {
    const first = (phase: number) => pointsOf(helixPaths(shape, phase).front + helixPaths(shape, phase).back);
    const startOf = (phase: number) => {
      const { front, back } = helixPaths(shape, phase);
      return pointsOf(Math.sin(phase) >= 0 ? front : back)[0];
    };
    expect(first(0)).not.toEqual(first(1));
    expect(startOf(0)?.[0]).toBeGreaterThan(startOf(Math.PI)?.[0] ?? Infinity);
  });

  it('полный оборот возвращает ту же форму', () => {
    expect(helixPaths(shape, 0.5)).toEqual(helixPaths(shape, 0.5 + Math.PI * 2));
  });

  it('спираль делится на переднюю и заднюю части', () => {
    const { front, back } = helixPaths(shape, 0);
    expect(pointsOf(front).length).toBeGreaterThan(10);
    expect(pointsOf(back).length).toBeGreaterThan(10);
  });

  it('сжатие укорачивает пружинку, растяжение удлиняет, середина остаётся на месте', () => {
    const [restTop = 0, restBottom = 0] = spanOf(1);
    const [tightTop = 0, tightBottom = 0] = spanOf(0.7);
    const [looseTop = 0, looseBottom = 0] = spanOf(1.3);
    expect(tightBottom - tightTop).toBeLessThan(restBottom - restTop);
    expect(looseBottom - looseTop).toBeGreaterThan(restBottom - restTop);
    expect((tightTop + tightBottom) / 2).toBeCloseTo((restTop + restBottom) / 2, -1);
    expect((looseTop + looseBottom) / 2).toBeCloseTo((restTop + restBottom) / 2, -1);
  });

  it('высота кадра растёт с числом витков', () => {
    expect(helixBox({ ...shape, turns: 10 }).height).toBeGreaterThan(helixBox(shape).height);
  });
});

describe('helixStretch', () => {
  it('в начале пружинка в покое', () => {
    expect(helixStretch(0)).toBe(1);
  });

  it('пружинка и сжимается, и разжимается, но не схлопывается', () => {
    const values = Array.from({ length: 2000 }, (_, index) => helixStretch(index / 10));
    expect(Math.min(...values)).toBeLessThan(0.8);
    expect(Math.max(...values)).toBeGreaterThan(1.2);
    expect(Math.min(...values)).toBeGreaterThanOrEqual(0.65);
    expect(Math.max(...values)).toBeLessThanOrEqual(1.35);
  });
});
