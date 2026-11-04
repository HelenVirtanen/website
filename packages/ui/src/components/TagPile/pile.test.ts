import { describe, expect, it } from 'vitest';
import {
  colorsFor,
  createRandom,
  layoutPile,
  pileDurationMs,
  shuffled,
  toneCount,
  type PileInput,
} from './pile';

const tagHeight = 36;
const eps = 1e-6;

const widthsOf = (count: number, seed: number): number[] => {
  const random = createRandom(seed);
  return Array.from({ length: count }, () => 60 + Math.round(random() * 140));
};

const zones = [
  { name: 'узкая', zoneWidth: 343, zoneHeight: 200 },
  { name: 'широкая', zoneWidth: 1760, zoneHeight: 352 },
] as const;

const build = (count: number, zone: (typeof zones)[number], seed: number): PileInput => ({
  widths: widthsOf(count, 7),
  tagHeight,
  zoneWidth: zone.zoneWidth,
  zoneHeight: zone.zoneHeight,
  gap: 8,
  fallMs: 900,
  random: createRandom(seed),
});

const bounds = (input: PileInput, index: number, placement: { x: number; y: number; rotation: number }) => {
  const width = Math.min(input.widths[index] ?? 0, input.zoneWidth);
  const rad = (placement.rotation * Math.PI) / 180;
  const boxWidth = width * Math.abs(Math.cos(rad)) + input.tagHeight * Math.abs(Math.sin(rad));
  const boxHeight = width * Math.abs(Math.sin(rad)) + input.tagHeight * Math.abs(Math.cos(rad));
  const centerX = placement.x + width / 2;
  const centerY = placement.y + input.tagHeight / 2;
  return {
    left: centerX - boxWidth / 2,
    right: centerX + boxWidth / 2,
    top: centerY - boxHeight / 2,
    bottom: centerY + boxHeight / 2,
  };
};

describe('createRandom и shuffled', () => {
  it('одинаковый сид даёт одинаковую последовательность', () => {
    const a = createRandom(42);
    const b = createRandom(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('значения лежат в [0, 1)', () => {
    const random = createRandom(1);
    for (let i = 0; i < 1000; i += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('перемешивание сохраняет состав, не меняет исходный список и зависит от сида', () => {
    const list = Array.from({ length: 20 }, (_, i) => i);
    const first = shuffled(list, createRandom(1));
    expect([...first].sort((a, b) => a - b)).toEqual(list);
    expect(list).toEqual(Array.from({ length: 20 }, (_, i) => i));
    expect(shuffled(list, createRandom(1))).toEqual(first);
    expect(shuffled(list, createRandom(2))).not.toEqual(first);
  });
});

describe('colorsFor', () => {
  it('соседние плашки не одного цвета, номера в пределах палитры', () => {
    for (const seed of [1, 2, 3, 99]) {
      const colors = colorsFor(60, createRandom(seed));
      expect(colors).toHaveLength(60);
      colors.forEach((color, i) => {
        expect(color).toBeGreaterThanOrEqual(0);
        expect(color).toBeLessThan(toneCount);
        if (i > 0) expect(color).not.toBe(colors[i - 1]);
      });
    }
  });

  it('разные сиды дают разные цвета, один сид один результат', () => {
    expect(colorsFor(30, createRandom(1))).toEqual(colorsFor(30, createRandom(1)));
    expect(colorsFor(30, createRandom(1))).not.toEqual(colorsFor(30, createRandom(2)));
  });

  it('работает с пустым списком и с одним цветом на плашку', () => {
    expect(colorsFor(0, createRandom(1))).toEqual([]);
    expect(colorsFor(1, createRandom(1))).toHaveLength(1);
  });
});

describe('layoutPile', () => {
  it('пустой список даёт пустую раскладку', () => {
    expect(layoutPile({ ...build(0, zones[0], 1), widths: [] })).toEqual([]);
  });

  it('одинаковый сид даёт одинаковую раскладку, разные сиды дают разный порядок падения', () => {
    const first = layoutPile(build(9, zones[0], 1));
    expect(layoutPile(build(9, zones[0], 1))).toEqual(first);
    const orders = new Set(
      [1, 2, 3, 4, 5, 6].map((seed) =>
        layoutPile(build(9, zones[0], seed))
          .map((placement) => placement.order)
          .join(','),
      ),
    );
    expect(orders.size).toBeGreaterThan(1);
    const rotations = new Set(
      [1, 2, 3].map((seed) =>
        layoutPile(build(9, zones[0], seed))
          .map((placement) => placement.rotation.toFixed(3))
          .join(','),
      ),
    );
    expect(rotations.size).toBeGreaterThan(1);
  });

  for (const zone of zones) {
    for (const count of [1, 9, 30]) {
      describe(`${String(count)} плашек, ${zone.name} зона`, () => {
        for (const seed of [1, 2, 3, 4, 5]) {
          it(`сид ${String(seed)}: индексы очереди уникальны, границы соблюдены, задержки в пределах`, () => {
            const input = build(count, zone, seed);
            const result = layoutPile(input);

            expect(result).toHaveLength(count);
            expect(result.map((placement) => placement.order).sort((a, b) => a - b)).toEqual(
              Array.from({ length: count }, (_, i) => i),
            );

            result.forEach((placement, index) => {
              const box = bounds(input, index, placement);
              expect(box.left).toBeGreaterThanOrEqual(-eps);
              expect(box.top).toBeGreaterThanOrEqual(-eps);
              expect(box.right).toBeLessThanOrEqual(input.zoneWidth + eps);
              expect(box.bottom).toBeLessThanOrEqual(input.zoneHeight + eps);
              expect(placement.delay).toBeGreaterThanOrEqual(0);
              expect(placement.delay + 900).toBeLessThanOrEqual(pileDurationMs);
            });
          });
        }
      });
    }
  }

  it('нижний ряд ровный и стоит на дне зоны, наклоны остальных ограничены', () => {
    const input = build(30, zones[0], 3);
    const result = layoutPile(input);
    const bottom = result.filter((placement) => Math.abs(placement.y - (input.zoneHeight - tagHeight)) < eps);
    expect(bottom.length).toBeGreaterThan(0);
    bottom.forEach((placement) => {
      expect(placement.rotation).toBe(0);
    });
    result.forEach((placement) => {
      expect(Math.abs(placement.rotation)).toBeLessThanOrEqual(68);
    });
    expect(result.some((placement) => placement.rotation !== 0)).toBe(true);
  });

  it('одна плашка лежит ровно по центру на дне', () => {
    const input = build(1, zones[1], 1);
    const [placement] = layoutPile(input);
    expect(placement?.rotation).toBe(0);
    expect(placement?.y).toBeCloseTo(input.zoneHeight - tagHeight);
    expect((placement?.x ?? 0) + (input.widths[0] ?? 0) / 2).toBeCloseTo(input.zoneWidth / 2);
  });

  it('плашка шире зоны ложится от левого края и не выходит за него', () => {
    const [placement] = layoutPile({
      widths: [900],
      tagHeight,
      zoneWidth: 343,
      zoneHeight: 200,
      random: createRandom(1),
    });
    expect(placement?.x).toBeCloseTo(0);
  });

  it('при нехватке высоты ряды ложатся внахлёст, но остаются в зоне', () => {
    const input: PileInput = {
      widths: Array.from({ length: 40 }, () => 120),
      tagHeight,
      zoneWidth: 343,
      zoneHeight: 100,
      random: createRandom(5),
    };
    const result = layoutPile(input);
    result.forEach((placement, index) => {
      const box = bounds(input, index, placement);
      expect(box.top).toBeGreaterThanOrEqual(-eps);
      expect(box.bottom).toBeLessThanOrEqual(input.zoneHeight + eps);
    });
  });

  it('складывает плашки в кучу, а не вытягивает в один ряд', () => {
    const widths = [124, 113, 145, 166, 231, 177, 242, 210, 80];
    const placements = layoutPile({ widths, tagHeight: 52, zoneWidth: 1328, zoneHeight: 264, gap: 8, random: createRandom(7) });
    const rows = new Set(placements.map((placement) => Math.round(placement.y / 60)));
    expect(rows.size).toBeGreaterThan(2);
    const bottom = placements.filter((placement) => placement.rotation === 0);
    const left = Math.min(...bottom.map((placement) => placement.x));
    expect(left).toBeGreaterThan(200);
  });
});
