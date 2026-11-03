import { baseValues, layoutSpace, type LayoutStep } from './scale';

// Базовые layout-значения — от темы не зависят.
const layoutKeys = () =>
  Object.fromEntries(Object.keys(layoutSpace.inset).map((k) => [k, null])) as Record<LayoutStep, null>;

const contract = {
  display: {
    inlineFlex: null,
    flex: null,
    grid: null,
    none: null,
    block: null,
  },
  position: {
    relative: null,
    absolute: null,
    fixed: null,
    sticky: null,
  },
  alignItems: {
    center: null,
    stretch: null,
  },
  justifyContent: {
    center: null,
    spaceBetween: null,
    flexStart: null,
  },
  flexDirection: {
    column: null,
    row: null,
  },
  inset: {
    zero: null,
  },
  // Растущие по брейкпоинтам поля и промежутки; значения — layoutSpace в scale.ts
  layout: {
    inset: layoutKeys(),
    gap: layoutKeys(),
  },
} as const;

const values = {
  display: {
    inlineFlex: 'inline-flex',
    flex: 'flex',
    grid: 'grid',
    none: 'none',
    block: 'block',
  },
  position: {
    relative: 'relative',
    absolute: 'absolute',
    fixed: 'fixed',
    sticky: 'sticky',
  },
  alignItems: {
    center: 'center',
    stretch: 'stretch',
  },
  justifyContent: {
    center: 'center',
    spaceBetween: 'space-between',
    flexStart: 'flex-start'	,

  },
  flexDirection: {
    column: 'column',
    row: 'row',
  },
  inset: {
    zero: '0',
  },
  layout: {
    inset: baseValues(layoutSpace.inset),
    gap: baseValues(layoutSpace.gap),
  },
};

export const layout = { contract, values };
