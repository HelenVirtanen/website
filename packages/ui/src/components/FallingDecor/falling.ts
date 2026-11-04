import type { Random } from '../TagPile/pile';

export type DecorKind = 'springs' | 'snow';

export interface DecorState {
  /** Падает ли что-нибудь */
  enabled: boolean;
  /** Что падает */
  kind: DecorKind;
}

export const defaultDecor: DecorState = { enabled: true, kind: 'springs' };

const STORAGE_KEY = 'moscowcss-decor';

type DecorStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** Выбор человека. Хранилище может быть недоступно или испорчено: тогда значения по умолчанию. */
export function readDecor(storage: DecorStorage | undefined): DecorState {
  try {
    const saved = JSON.parse(storage?.getItem(STORAGE_KEY) ?? 'null') as Partial<DecorState> | null;
    return {
      enabled: saved?.enabled !== false,
      kind: saved?.kind === 'snow' ? 'snow' : 'springs',
    };
  } catch {
    return defaultDecor;
  }
}

export function writeDecor(storage: DecorStorage | undefined, state: DecorState): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // В приватном режиме запись может быть запрещена: выбор просто не переживёт перезагрузку.
  }
}

const minCount = 6;
const maxCount = 24;
const widthPerItemPx = 120;

/** Сколько фигур падает при такой ширине окна. */
export function fallingCount(widthPx: number): number {
  return Math.min(maxCount, Math.max(minCount, Math.round(widthPx / widthPerItemPx)));
}

export interface FallingItem {
  /** Положение по горизонтали, проценты ширины окна */
  leftPercent: number;
  /** Время одного падения сверху вниз, мс */
  fallMs: number;
  /** Отрицательная задержка: фигуры с первой секунды уже разбросаны по высоте */
  delayMs: number;
  /** Время одного оборота вокруг своей оси, мс */
  spinMs: number;
  /** Масштаб фигуры */
  scale: number;
  /** Случайное число для выбора фигуры и цвета */
  pick: number;
}

const between = (low: number, high: number, random: Random): number => low + random() * (high - low);

/** Случайные параметры падения. Столбцы равной ширины, чтобы фигуры не сбивались в кучу. */
export function fallingItems(count: number, random: Random): FallingItem[] {
  return Array.from({ length: count }, (_, index) => {
    const fallMs = between(20000, 40000, random);
    return {
      leftPercent: ((index + random()) / count) * 100,
      fallMs,
      delayMs: -random() * fallMs,
      spinMs: between(8000, 16000, random),
      scale: between(0.7, 1.2, random),
      pick: random(),
    };
  });
}
