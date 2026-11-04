import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { vars } from '@moscowcss/design-system';

// Слой над контентом, но без событий мыши: кнопки и ссылки под фигурами работают как обычно.
export const root = style({
  position: vars.position.fixed,
  inset: vars.inset.zero,
  zIndex: vars.zIndex.decor,
  overflow: 'hidden',
  pointerEvents: 'none',
  contain: 'strict',
});

const fallDown = keyframes({
  from: { transform: 'translateY(-25vh)' },
  to: { transform: 'translateY(115vh)' },
});

const spinFlat = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

// Длительность и задержку у каждой фигуры задаёт скрипт: они случайные.
export const fall = style({
  position: vars.position.absolute,
  top: 0,
  animationName: fallDown,
  animationTimingFunction: vars.motion.easing.linear,
  animationIterationCount: 'infinite',
  willChange: 'transform',
});

const shapeBase = {
  display: vars.display.block,
  transitionProperty: 'color, opacity',
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.standard,
} as const;

const svgMotion = {
  display: vars.display.block,
  animationTimingFunction: vars.motion.easing.linear,
  animationIterationCount: 'infinite',
  willChange: 'transform',
} as const;

// Края окна просмотра растворяются, чтобы витки не обрывались резко.
export const spring = style({
  ...shapeBase,
  height: vars.adaptive.decorSpringHeight,
  overflow: 'hidden',
  maskImage: `linear-gradient(to bottom, transparent, ${vars.color.text} 12%, ${vars.color.text} 88%, transparent)`,
});

globalStyle(`${spring} svg`, {
  ...svgMotion,
  width: '100%',
  overflow: 'visible',
});

// Формы в макете разного размера, а линия у всех одной толщины.
globalStyle(`${spring} path`, {
  strokeWidth: vars.border.width.medium,
  vectorEffect: 'non-scaling-stroke',
});

// Плоскую спираль нельзя повернуть в 3D: на ребре она схлопывается в полоску. У настоящего винта при
// вращении витки бегут вдоль оси, поэтому длинная спираль едет за окном ровно на один виток и начинает
// заново: шов не виден, все витки одинаковые. Числа — размеры файла: width — ширина, visible — высота окна из макета,
// pitch — шаг витка, total — вся высота SVG; первые два витка неполные, окно начинается после них.
const screwShape = ({ width, visible, pitch, total }: { width: number; visible: number; pitch: number; total: number }) => {
  const start = 2 * pitch;
  const screw = keyframes({
    from: { transform: `translateY(${String((-start / total) * 100)}%)` },
    to: { transform: `translateY(${String((-(start + pitch) / total) * 100)}%)` },
  });
  const shape = style({ aspectRatio: `${String(width)} / ${String(visible)}` });
  globalStyle(`${shape} svg`, {
    height: `${String((total / visible) * 100)}%`,
    animationName: screw,
  });
  return shape;
};

// Порядок совпадает с формами в FallingDecor.astro.
export const springShapes = [
  screwShape({ width: 102, visible: 197, pitch: 25.144, total: 329 }),
  screwShape({ width: 54, visible: 143, pitch: 18.181, total: 239 }),
  screwShape({ width: 181, visible: 493, pitch: 63.311, total: 826 }),
];

export const snow = style({
  ...shapeBase,
  width: vars.adaptive.decorSnowSize,
  height: vars.adaptive.decorSnowSize,
});

globalStyle(`${snow} svg`, {
  ...svgMotion,
  animationName: spinFlat,
  width: '100%',
  height: '100%',
});

const tone = (color: string) => style({ color });

// Порядок совпадает с формами в FallingDecor.astro.
export const springTones = [tone(vars.color.tagSky), tone(vars.color.tagOrange), tone(vars.color.tagBlue)];

export const snowTones = [
  tone(vars.color.tagSky),
  tone(vars.color.tagBlue),
  tone(vars.color.tagYellow),
  tone(vars.color.tagRed),
  tone(vars.color.tagOrange),
];

// Над текстом фигура почти исчезает, чтобы не мешать читать. Правило идёт после цветов и перебивает их.
export const muted = style({
  color: vars.color.decorMuted,
  opacity: 0.2,
});
