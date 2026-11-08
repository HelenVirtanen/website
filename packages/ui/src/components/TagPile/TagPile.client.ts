import { motion } from '@moscowcss/design-system';
import { readDecorOff } from '../FallingDecor/falling';
import { colorsFor, createRandom, cycleTiming, layoutPile, paceOf, pileDurationMs, restMsOf, shuffled, type Random } from './pile';

const INITIALIZED = 'data-tag-pile-initialized';
const ENHANCED = 'data-pile';

const durationMs = (value: string): number => {
  const match = /^(\d+(?:\.\d+)?)ms$/.exec(value);
  if (match === null) throw new TypeError(`TagPile: ожидалась длительность в мс, получено «${value}»`);
  return Number(match[1]);
};

const baseFallMs = durationMs(motion.values.motion.duration.fall);
const fallEasing = motion.values.motion.easing.fall;
const dropEasing = motion.values.motion.easing.drop;

// Плашка появляется за первую долю падения, чтобы не торчать над зоной до старта.
const fadeInShare = 0.12;
// На экране должна быть заметная часть кучи, иначе падение пройдёт за краем окна.
const visibleShare = 0.35;

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Хранилище может быть недоступно (приватный режим): тогда считаем, что фигуры включены.
const storageOf = (): Storage | undefined => {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

export function setupTagPile(root: HTMLElement) {
  if (root.hasAttribute(INITIALIZED)) return;
  root.setAttribute(INITIALIZED, '');

  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-tag-pile-item]'));
  if (items.length === 0) return;

  const toneClasses = JSON.parse(root.dataset['tones'] ?? '[]') as string[];
  const onVisible = root.dataset['trigger'] === 'visible';
  const pace = paceOf(root.dataset['pace']);
  const restMs = restMsOf(root.dataset['restMs']);
  const fallMs = baseFallMs * pace;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Сид один на жизнь страницы: при смене ступени куча раскладывается так же, а не перетасовывается.
  const seed = Math.floor(Math.random() * 2 ** 32);
  let size = '';
  let started = false;
  // Номер раскладки: петля плашки работает, пока раскладка, в которой она запущена, ещё актуальна.
  let generation = 0;

  const cancelAll = () => {
    generation += 1;
    for (const item of items) {
      item.getAnimations().forEach((animation) => {
        animation.cancel();
      });
    }
  };

  const restore = () => {
    cancelAll();
    root.removeAttribute(ENHANCED);
    for (const item of items) {
      item.style.removeProperty('transform');
      item.style.removeProperty('opacity');
    }
    size = '';
  };

  // Падение сверху на место; промис завершается, когда плашка легла, или отменой.
  const fallIn = (item: HTMLElement, pose: (lift: number) => string, lift: number, duration: number, delay: number) =>
    item.animate(
      [
        { transform: pose(lift), opacity: 0 },
        { opacity: 1, offset: fadeInShare },
        { transform: pose(0), opacity: 1 },
      ],
      { duration, delay, easing: fallEasing, fill: 'backwards' },
    );

  // Бесконечное движение дольше 5 секунд должно останавливаться (WCAG 2.2.2): круг слушается того же
  // переключателя, что и падающие фигуры. Пока они выключены, плашки лежат.
  const loopPaused = () => readDecorOff(storageOf()) || document.hidden;

  // Круг плашки: полежать, провалиться вниз с исчезновением, выждать и упасть на место заново.
  const loop = async (
    item: HTMLElement,
    pose: (lift: number) => string,
    zoneHeight: number,
    firstFall: Animation | undefined,
    random: Random,
    own: number,
  ) => {
    if (restMs === undefined) return;
    try {
      if (firstFall) await firstFall.finished;
      while (own === generation) {
        await wait(restMs);
        if (own !== generation) return;
        if (loopPaused()) continue;
        const timing = cycleTiming(baseFallMs, pace, random);
        const drop = item.animate(
          [
            { transform: pose(0), opacity: 1 },
            { transform: pose(-item.offsetHeight * 2), opacity: 0 },
          ],
          { duration: timing.dropMs, easing: dropEasing, fill: 'forwards' },
        );
        await drop.finished;
        await wait(timing.gapMs);
        if (own !== generation) return;
        const again = fallIn(item, pose, zoneHeight, timing.fallMs, 0);
        drop.cancel();
        await again.finished;
      }
    } catch {
      // Отменённая анимация отклоняет `finished`: раскладка сменилась, круг этой плашки окончен.
    }
  };

  const place = (animate: boolean) => {
    root.setAttribute(ENHANCED, '');
    // Идущее падение и петли ведут к старой раскладке: на смене размера их не должно остаться.
    cancelAll();
    const own = generation;
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
      totalMs: pileDurationMs * pace,
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
      const first = animate ? fallIn(item, pose, zoneHeight, fallMs, placement.delay) : undefined;
      void loop(item, pose, zoneHeight, first, createRandom(seed + index), own);
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
      // С выключенными фигурами зацикленная куча не падает вовсе: просто лежит.
      place(!(restMs !== undefined && readDecorOff(storageOf())));
    });
  };

  // Ширина зоны меняется на смене ступени и при ресайзе; сравнение размера не даёт заводить петлю.
  new ResizeObserver(() => {
    if (!started || size === '') return;
    if (size === `${String(root.clientWidth)}x${String(root.clientHeight)}`) return;
    place(false);
  }).observe(root);

  reducedMotion.addEventListener('change', start);

  // Выключили фигуры посреди падения — куча сразу ложится на место и дальше не двигается.
  if (restMs !== undefined) {
    for (const toggle of document.querySelectorAll<HTMLElement>('[data-decor-toggle]')) {
      toggle.addEventListener('click', () => {
        // Состояние пишет обработчик FallingDecor; читаем его после всех обработчиков клика.
        setTimeout(() => {
          if (started && size !== '' && readDecorOff(storageOf())) place(false);
        });
      });
    }
  }

  if (!onVisible || reducedMotion.matches || !('IntersectionObserver' in window)) {
    start();
    return;
  }
  // До появления на экране зона уже нужной высоты, а плашки скрыты: падение начнётся у читателя на глазах.
  root.setAttribute(ENHANCED, '');
  for (const item of items) item.style.opacity = '0';
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      start();
    },
    { threshold: visibleShare },
  );
  observer.observe(root);
}
