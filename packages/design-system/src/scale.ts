import { breakpoints, media } from './breakpoints';

// Единственный источник значений шкалы (ADR-002). Модуль без побочных эффектов:
// его читают и темы (.css.ts), и тесты. CSS собирается из этих таблиц через
// baseValues + mediaOverrides; тест сверяет каскад этих медиазапросов с resolveAt.

// Ступени ширины в порядке роста порога. В этом же порядке их перебирает резолвер
// и в этом же порядке они попадают в CSS: поздний медиазапрос перебивает ранний.
// `mobile` и `tablet` делят порог 48rem, поэтому ступенью служит только `tablet`.
export const widthSteps = ['tablet', 'laptop', 'desktop', 'wide', 'desktopLarge'] as const;
export type WidthStep = (typeof widthSteps)[number];

// Значение ниже tablet (`base`) и только на тех ступенях, где оно меняется.
export type Steps = Readonly<{ base: string } & Partial<Record<WidthStep, string>>>;

// rem в медиазапросах считается от исходного кегля браузера, а не от кегля :root.
// Корневой кегль браузерный до 1920px; шире он растёт как max(100%, 100vw / 120)
// (ADR-002), а таблицы описывают ширины до 1920, где 1rem = 16px.
const rootFontPx = 16;

// Значения макета записаны в px при кегле 16: таблицы читаются так же, как макет.
const px = (value: number): string => `${value / rootFontPx}rem`;

const remPattern = /^(\d+(?:\.\d+)?)rem$/;

export function remToPx(value: string): number {
  const match = remPattern.exec(value);
  if (match === null) {
    throw new TypeError(`Expected a rem length like "1.5rem", got "${value}"`);
  }
  return Number(match[1]) * rootFontPx;
}

export function thresholdPx(step: WidthStep): number {
  return remToPx(breakpoints[step]);
}

// Значение на ширине окна: последняя ступень, чей порог ≤ ширины. Строка —
// постоянное значение без измерения ширины (ступени `space`).
export function resolveAt(steps: Steps | string, widthPx: number): string {
  if (!Number.isFinite(widthPx) || widthPx <= 0) {
    throw new RangeError(`Expected a positive viewport width in px, got ${widthPx}`);
  }
  if (typeof steps === 'string') return steps;
  let value = steps.base;
  for (const step of widthSteps) {
    const override = steps[step];
    if (override !== undefined && widthPx >= thresholdPx(step)) value = override;
  }
  return value;
}

export function baseValues<K extends string>(table: Readonly<Record<K, Steps>>): Record<K, string> {
  const entries = (Object.keys(table) as K[]).map((key) => [key, table[key].base] as const);
  return Object.fromEntries(entries) as Record<K, string>;
}

// Переопределения по ступеням для globalStyle(':root', { '@media': … }). `names` —
// имена custom properties из контракта (vars.*). Ступени без переопределений не
// выводятся; порядок ключей — widthSteps.
export function mediaOverrides<K extends string>(
  names: Readonly<Record<K, string>>,
  table: Readonly<Record<K, Steps>>,
): Record<string, { vars: Record<string, string> }> {
  const keys = Object.keys(table) as K[];
  const result: Record<string, { vars: Record<string, string> }> = {};
  for (const step of widthSteps) {
    const vars: Record<string, string> = {};
    for (const key of keys) {
      const override = table[key][step];
      if (override !== undefined) vars[names[key]] = override;
    }
    if (Object.keys(vars).length > 0) result[media[step]] = { vars };
  }
  return result;
}

// Кегли текстовых ролей: база (mobile-first) и ступени, где кегль меняется.
export const typeScale = {
  blockTitle: { base: px(36), tablet: px(40) },
  subtitle: { base: '1.75rem' }, // 28px
  websiteTitle: {
    base: '2.5rem', // 40px
    tablet: '3rem',
    laptop: '3.75rem', // 60px
    desktop: '4.5rem',
  },
  h1: {
    base: '2rem', // 32px
    tablet: '2.25rem',
    laptop: '2.75rem', // 44px
    desktop: '3.25rem',
  },
  h2: {
    base: '1.5rem', // 24px
    tablet: '1.75rem',
    laptop: '2rem', // 32px
    desktop: '2.25rem',
  },
  h3: {
    base: '1.25rem', // 20px
    laptop: '1.5rem', // 24px
    desktop: '1.625rem',
  },
  h4: {
    base: '1.125rem', // 18px
    laptop: '1.25rem', // 20px
    desktop: '1.375rem',
  },
  body: { base: '1rem', desktop: '1.125rem' }, // 16px → 18px
  caption: { base: '0.875rem' }, // 14px
  ui: { base: '0.875rem' }, // 14px
  programTalkTitle: { base: '1.75rem' }, // 28px
  programSpeakerName: { base: '1.375rem' }, // 22px
  programSpeakerRole: { base: '1.125rem' }, // 18px
  programTime: { base: '1.75rem' }, // 28px
  programDescription: { base: '1.375rem' }, // 22px
  featureCardTitle: { base: '1.5rem' }, // 24px
  featureCardBody: { base: '1.375rem' }, // 22px
  featureCardFootnote: { base: '1.125rem' }, // 18px
  partnerAddress: { base: '2.5rem' }, // 40px
  partnerDirectionsHint: { base: '1.375rem' }, // 22px
  buttonLabel: { base: px(12), wide: px(14), desktopLarge: px(18) },
  navLogo: { base: px(20), wide: px(24), desktopLarge: px(28) },
  navMono: { base: px(13), wide: px(16), desktopLarge: px(20) },
  navMeta: { base: px(12), wide: px(14), desktopLarge: px(18) },
  menuLink: { base: px(22) },
  heroTag: { base: px(13), tablet: px(15), wide: px(18), desktopLarge: px(24) },
  heroChip: { base: px(12), wide: px(14), desktopLarge: px(16) },
  heroDate: { base: px(20), wide: px(26), desktopLarge: px(29) },
  heroMeta: { base: px(13), wide: px(16), desktopLarge: px(22) },
  heroDisplay: { base: px(75), tablet: px(106), wide: px(201), desktopLarge: px(266) },
  heroLead: { base: px(16), wide: px(18), desktopLarge: px(24) },
  heroBody: { base: px(14), wide: px(16), desktopLarge: px(20) },
  ctaFloating: { base: px(12), wide: px(14), desktopLarge: px(24) },
  cardTitle: { base: px(24), wide: px(32) },
  cardBody: { base: px(18), tablet: px(22) },
} as const satisfies Record<string, Steps>;

export type FontRole = keyof typeof typeScale;

// Ступени отступов компонентов: постоянны на всех ширинах (ADR-002). Растущие
// величины живут в layoutSpace.
export const space = {
  xs: '0.25rem', // 4px
  s: '0.5rem', // 8px
  m: '0.75rem', // 12px
  l: '1rem', // 16px
  xl: '1.25rem', // 20px
  xxl: '1.5rem', // 24px
  xxxl: '2rem', // 32px
  '4xl': '5rem', // 80px
} as const satisfies Record<string, string>;

export type SpaceStep = keyof typeof space;

// Раскладочные токены: бывшие растущие ступени m/l/xxl шкалы отступов. `inset` —
// внутренние поля, `gap` — промежутки между элементами; значения у групп общие.
const inset = {
  m: { base: '0.75rem', desktop: '1rem' }, // 12px → 16px
  l: { base: '1rem', desktop: '1.5rem' }, // 16px → 24px
  xxl: { base: '1.5rem', desktop: '2rem', desktopLarge: '2.5rem' }, // 24px → 32px → 40px
} as const satisfies Record<string, Steps>;

export const layoutSpace = {
  inset,
  gap: { ...inset },
} as const satisfies Record<string, Record<string, Steps>>;

export type LayoutStep = keyof typeof layoutSpace.inset;

// Адаптивные размеры компонентов макета: отступы, габариты, радиусы, высоты строк.
// Каждая запись — «база и ступени, где значение меняется»; пустая ячейка макета —
// значение предыдущей ступени. Выводятся в vars.adaptive.*.
export const adaptiveScale = {
  buttonPaddingBlock: { base: px(12), wide: px(20) },
  buttonPaddingInline: { base: px(15), wide: px(30) },
  navButtonPaddingBlock: { base: px(13), wide: px(17), desktopLarge: px(20) },
  navButtonPaddingInline: { base: px(20), wide: px(28), desktopLarge: px(36) },
  navButtonRadius: { base: px(8), wide: px(10) },
  navPaddingTop: { base: px(14), wide: px(28), desktopLarge: px(36) },
  navPaddingInline: { base: px(16), wide: px(56), desktopLarge: px(80) },
  navGap: { base: px(14), wide: px(16) },
  navActionsGap: { base: px(20), wide: px(32), desktopLarge: px(40) },
  navLinksGap: { base: px(32), desktopLarge: px(40) },
  navLangGap: { base: px(6), wide: px(8), desktopLarge: px(10) },
  heroPaddingTop: { base: px(24), wide: px(40), desktopLarge: px(52) },
  heroPaddingBottom: { base: px(40), wide: px(72), desktopLarge: px(96) },
  heroPaddingInline: { base: px(16), tablet: px(24), wide: px(56), desktopLarge: px(80) },
  heroGap: { base: px(28), wide: px(56), desktopLarge: px(76) },
  heroGroupGap: { base: px(12), wide: px(16), desktopLarge: px(20) },
  heroTagsHeight: { base: px(200), tablet: px(240), wide: px(264), desktopLarge: px(352) },
  heroTagPaddingBlock: { base: px(11), tablet: px(14), wide: px(17), desktopLarge: px(29) },
  heroTagPaddingInline: { base: px(14), tablet: px(18), wide: px(24), desktopLarge: px(48) },
  heroTagRadius: { base: px(17), tablet: px(21), wide: px(26), desktopLarge: px(41) },
  heroChipPaddingBlock: { base: px(11), wide: px(18) },
  heroChipPaddingInline: { base: px(14), wide: px(24), desktopLarge: px(28) },
  heroChipRadius: { base: px(8), wide: px(10) },
  heroDateGap: { base: px(2), wide: px(4) },
  heroMetaGap: { base: px(16), wide: px(64), desktopLarge: px(69) },
  heroAboutGap: { base: px(8), wide: px(12), desktopLarge: px(16) },
  heroAboutWidth: { base: px(620), desktopLarge: px(709) },
  ctaSize: { base: px(112), wide: px(132), desktopLarge: px(231) },
  ctaOffsetInline: { base: px(16), tablet: px(24), wide: px(56), desktopLarge: px(80) },
  ctaOffsetBlock: { base: px(16), wide: px(40), desktopLarge: px(48) },
  arrowWidth: { base: px(32), wide: px(43.5), desktopLarge: px(60) },
  arrowHeight: { base: px(14), desktopLarge: px(22) },
  arrowStroke: { base: px(2), desktopLarge: px(3) },
  arrowPairGap: { base: px(4), wide: px(14), desktopLarge: px(39) },
  cardWidth: { base: px(305), wide: px(425) },
  cardPaddingBlock: { base: px(20), tablet: px(40) },
  cardPaddingInline: { base: px(16), tablet: px(24) },
  cardGap: { base: px(20), tablet: px(40) },
  cardTitleLine: { base: px(40), wide: px(48) },
  cardBodyLine: { base: px(28), tablet: px(32) },
  sliderGap: { base: px(10), tablet: px(20) },
  sliderHeaderGap: { base: px(16), tablet: px(40), wide: px(20) },
  sliderHeadGap: { base: px(32), wide: px(40) },
  blockTitlePaddingInline: { base: px(20), tablet: px(32) },
  organizerGap: { base: px(24), tablet: px(19), wide: px(24) },
  organizerWidth: { base: px(413), wide: px(573) },
} as const satisfies Record<string, Steps>;

export type AdaptiveToken = keyof typeof adaptiveScale;
