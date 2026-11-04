export type Random = () => number;

/** Число цветовых пар `tag*`/`onTag*` в палитре. */
export const toneCount = 5;

/** За сколько миллисекунд падает и ложится вся куча. */
export const pileDurationMs = 3500;

const minTiltDeg = 5;
const midTiltDeg = 24;
const topTiltDeg = 68;
// Отношение длины плашки к высоте: короче shortRatio наклон до topTiltDeg, длиннее longRatio — до midTiltDeg.
const shortRatio = 2.5;
const longRatio = 6;
// Нижний ряд шире средней доли ширины на ряд, каждый следующий уже предыдущего.
const baseRowShare = 1.5;
const upperRowShare = 0.85;
// Выше куча превращается в башню из плашек по одной.
const maxLevels = 4;
const fallShuffleRows = 1.5;
const maxRiseInTags = 1.6;

/** Детерминированный генератор (mulberry32): одинаковый сид даёт одинаковую кучу. */
export function createRandom(seed: number): Random {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Перемешивает копию списка (Фишер — Йетс). */
export function shuffled<T>(list: readonly T[], random: Random): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const a = result[i] as T;
    result[i] = result[j] as T;
    result[j] = a;
  }
  return result;
}

/** Номер цветовой пары для каждой плашки; соседние плашки не одного цвета. */
export function colorsFor(count: number, random: Random, tones: number = toneCount): number[] {
  const result: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const previous = result[i - 1];
    if (previous === undefined) {
      result.push(Math.floor(random() * tones));
      continue;
    }
    // Выбираем среди остальных цветов, поэтому повтор соседнего невозможен.
    const pick = Math.floor(random() * (tones - 1));
    result.push(pick >= previous ? pick + 1 : pick);
  }
  return result;
}

export interface PileInput {
  /** Ширины плашек в px без поворота, в порядке списка. */
  widths: readonly number[];
  /** Высота плашки в px. */
  tagHeight: number;
  zoneWidth: number;
  zoneHeight: number;
  /** Промежуток между плашками ряда в px. */
  gap?: number;
  /** Сколько длится падение одной плашки в мс. */
  fallMs?: number;
  /** Сколько в мс до конца падения последней плашки. */
  totalMs?: number;
  random: Random;
}

export interface PilePlacement {
  /** Левый верхний угол плашки до поворота, px от левого края зоны. */
  x: number;
  /** Левый верхний угол плашки до поворота, px от верха зоны. */
  y: number;
  /** Поворот вокруг центра, градусы. */
  rotation: number;
  /** Очередь падения: 0 падает первой. */
  order: number;
  /** Задержка старта падения в мс. */
  delay: number;
}

const clamp = (value: number, low: number, high: number): number =>
  low > high ? (low + high) / 2 : Math.min(high, Math.max(low, value));

function rotatedBox(width: number, height: number, deg: number): { width: number; height: number } {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  return { width: width * cos + height * sin, height: width * sin + height * cos };
}

function tiltLimit(row: number, rowCount: number, width: number, height: number): number {
  if (row === 0) return 0;
  return Math.max(minTiltDeg, Math.min(rowTiltLimit(row, rowCount, width, height), overlapTiltLimit(width, height)));
}

// Длинная плашка с большим наклоном закрывает текст на соседних рядах.
function overlapTiltLimit(width: number, height: number): number {
  return (Math.asin(Math.min(1, (height * maxRiseInTags) / width)) * 180) / Math.PI;
}

function rowTiltLimit(row: number, rowCount: number, width: number, height: number): number {
  // Второй ряд лежит почти ровно на нижнем, как в макете: большой наклон закрывал бы соседей.
  if (row === 1 && rowCount > 2) return minTiltDeg;
  if (row < rowCount - 1) return midTiltDeg;
  const share = clamp((width / height - shortRatio) / (longRatio - shortRatio), 0, 1);
  return topTiltDeg - share * (topTiltDeg - midTiltDeg);
}

/**
 * Раскладка кучи: ряды растут снизу вверх и сужаются, нижний ряд ровный, верхние наклонены. Каждый
 * ряд центрируется; когда зона мала, ряды ложатся внахлёст. Ни одна плашка с поворотом не выходит
 * за зону. Плашки ложатся в порядке списка (перемешивает вызывающий), результат выровнен по нему.
 */
export function layoutPile(input: PileInput): PilePlacement[] {
  const { widths, tagHeight, zoneWidth, zoneHeight, random } = input;
  const gap = input.gap ?? 0;
  const fallMs = input.fallMs ?? 0;
  const totalMs = input.totalMs ?? pileDurationMs;
  const count = widths.length;
  if (count === 0) return [];

  const fitted = widths.map((width) => Math.min(width, zoneWidth));
  const widthOf = (index: number): number => fitted[index] ?? 0;

  // Куча сужается кверху: нижний ряд шире средней доли, каждый следующий уже предыдущего.
  const levels = Math.min(maxLevels, Math.max(1, Math.floor(zoneHeight / (tagHeight + gap))));
  const total = fitted.reduce((sum, width) => sum + width, 0) + gap * (count - 1);
  const widest = Math.max(...fitted);
  const capacityOf = (rowIndex: number): number =>
    Math.min(zoneWidth, Math.max(widest, (total / levels) * baseRowShare * upperRowShare ** rowIndex));

  // В ряд идёт первая подходящая плашка, а не только следующая: так меньше рядов и наложений.
  const rows: number[][] = [];
  let waiting = fitted.map((_, index) => index);
  while (waiting.length > 0) {
    const capacity = capacityOf(rows.length);
    const members: number[] = [];
    let used = 0;
    for (const index of waiting) {
      const next = members.length === 0 ? widthOf(index) : used + gap + widthOf(index);
      if (members.length === 0 || next <= capacity) {
        members.push(index);
        used = next;
      }
    }
    rows.push(members);
    waiting = waiting.filter((index) => !members.includes(index));
  }

  const travel = Math.max(0, zoneHeight - tagHeight);
  const step = rows.length > 1 ? Math.min(tagHeight + gap, travel / (rows.length - 1)) : 0;

  // В основном снизу вверх, но соседние ряды перемешаны: иначе ряды по одной плашке падают всегда одинаково.
  const fallOrder = rows
    .flatMap((members, rowIndex) => members.map((index) => ({ index, rank: rowIndex + random() * fallShuffleRows })))
    .sort((a, b) => a.rank - b.rank)
    .map(({ index }) => index);
  const span = Math.max(0, totalMs - fallMs);
  const placements: PilePlacement[] = [];

  rows.forEach((members, rowIndex) => {
    const rowWidth = members.reduce((sum, index) => sum + widthOf(index), 0) + gap * (members.length - 1);
    let cursor = (zoneWidth - rowWidth) / 2;
    const baseY = zoneHeight - tagHeight - rowIndex * step;

    for (const index of members) {
      const width = widthOf(index);
      const limit = tiltLimit(rowIndex, rows.length, width, tagHeight);
      const sign = random() < 0.5 ? -1 : 1;
      let rotation = limit === 0 ? 0 : sign * (minTiltDeg + random() * (limit - minTiltDeg));
      const jitter = rowIndex === 0 ? 0 : (random() - 0.5) * tagHeight * 0.3;

      let box = rotatedBox(width, tagHeight, rotation);
      while (rotation !== 0 && (box.width > zoneWidth || box.height > zoneHeight)) {
        rotation = Math.abs(rotation) < 1 ? 0 : rotation * 0.9;
        box = rotatedBox(width, tagHeight, rotation);
      }

      const centerX = clamp(cursor + width / 2, box.width / 2, zoneWidth - box.width / 2);
      const centerY = clamp(baseY + tagHeight / 2 + jitter, box.height / 2, zoneHeight - box.height / 2);
      cursor += width + gap;

      const order = fallOrder.indexOf(index);
      placements[index] = {
        x: centerX - width / 2,
        y: centerY - tagHeight / 2,
        rotation,
        order,
        delay: ((order + random()) / count) * span,
      };
    }
  });

  return placements;
}
