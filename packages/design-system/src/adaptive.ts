import { adaptiveScale, baseValues, type AdaptiveToken } from './scale';

// Адаптивные размеры компонентов макета; значения и ступени — adaptiveScale в scale.ts.
const contract = {
  adaptive: Object.fromEntries(Object.keys(adaptiveScale).map((k) => [k, null])) as Record<
    AdaptiveToken,
    null
  >,
} as const;

const values = {
  adaptive: baseValues(adaptiveScale),
};

export const adaptive = { contract, values };
