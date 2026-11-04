import { motion } from '@moscowcss/design-system';
import { colorsFor, createRandom, layoutPile, pileDurationMs, shuffled } from './pile';

const INITIALIZED = 'data-tag-pile-initialized';
const ENHANCED = 'data-pile';

const durationMs = (value: string): number => {
  const match = /^(\d+(?:\.\d+)?)ms$/.exec(value);
  if (match === null) throw new TypeError(`TagPile: ожидалась длительность в мс, получено «${value}»`);
  return Number(match[1]);
};

const fallMs = durationMs(motion.values.motion.duration.fall);
const fallEasing = motion.values.motion.easing.fall;

// Плашка появляется за первую долю падения, чтобы не торчать над зоной до старта.
const fadeInShare = 0.12;

export function setupTagPile(root: HTMLElement) {
  if (root.hasAttribute(INITIALIZED)) return;
  root.setAttribute(INITIALIZED, '');

  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-tag-pile-item]'));
  if (items.length === 0) return;

  const toneClasses = JSON.parse(root.dataset['tones'] ?? '[]') as string[];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Сид один на жизнь страницы: при смене ступени куча раскладывается так же, а не перетасовывается.
  const seed = Math.floor(Math.random() * 2 ** 32);
  let size = '';
  let started = false;

  const restore = () => {
    root.removeAttribute(ENHANCED);
    for (const item of items) {
      item.getAnimations().forEach((animation) => {
        animation.cancel();
      });
      item.style.removeProperty('transform');
      item.style.removeProperty('opacity');
    }
    size = '';
  };

  const place = (animate: boolean) => {
    root.setAttribute(ENHANCED, '');
    const zoneWidth = root.clientWidth;
    const zoneHeight = root.clientHeight;
    size = `${String(zoneWidth)}x${String(zoneHeight)}`;

    const random = createRandom(seed);
    const arranged = shuffled(items, random);
    const colors = colorsFor(arranged.length, random);
    const placements = layoutPile({
      widths: arranged.map((item) => item.offsetWidth),
      tagHeight: Math.max(...arranged.map((item) => item.offsetHeight)),
      zoneWidth,
      zoneHeight,
      gap: parseFloat(getComputedStyle(root).rowGap) || 0,
      fallMs,
      totalMs: pileDurationMs,
      random,
    });

    arranged.forEach((item, index) => {
      const placement = placements[index];
      if (placement === undefined) return;

      item.classList.remove(...toneClasses);
      const tone = toneClasses[colors[index] ?? 0];
      if (tone !== undefined) item.classList.add(tone);

      const pose = (lift: number) =>
        `translate(${String(placement.x)}px, ${String(placement.y - lift)}px) rotate(${String(placement.rotation)}deg)`;
      item.style.transform = pose(0);
      item.style.removeProperty('opacity');
      if (!animate) return;

      item.animate(
        [
          { transform: pose(zoneHeight), opacity: 0 },
          { opacity: 1, offset: fadeInShare },
          { transform: pose(0), opacity: 1 },
        ],
        { duration: fallMs, delay: placement.delay, easing: fallEasing, fill: 'backwards' },
      );
    });
  };

  const start = () => {
    if (reducedMotion.matches) {
      restore();
      started = false;
      return;
    }
    started = true;
    // Пока шрифт не загружен, ширины плашек неверны: прячем кучу до первой раскладки.
    for (const item of items) item.style.opacity = '0';
    void document.fonts.ready.then(() => {
      if (reducedMotion.matches || !started) return;
      place(true);
    });
  };

  // Ширина зоны меняется на смене ступени и при ресайзе; сравнение размера не даёт заводить петлю.
  new ResizeObserver(() => {
    if (!started || size === '') return;
    if (size === `${String(root.clientWidth)}x${String(root.clientHeight)}`) return;
    place(false);
  }).observe(root);

  reducedMotion.addEventListener('change', start);
  start();
}
