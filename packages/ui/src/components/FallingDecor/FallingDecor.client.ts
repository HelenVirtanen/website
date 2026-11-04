import { createRandom } from '../TagPile/pile';
import { fallingCount, fallingItems, overlapsAny, readDecorOff, writeDecorOff, type DecorKind } from './falling';

const INITIALIZED = 'data-falling-decor-initialized';
// Шапка и открытое меню лежат выше слоя и закрывают фигуры сами, поэтому их тексты не считаем.
const TEXT_BLOCKS =
  ':is(h1, h2, h3, h4, h5, h6, p, li, dt, dd, blockquote, figcaption, td, th, label, a, button, input):not([data-navbar] *)';
// Фигуры движутся медленно: чаще проверять незачем, а реже будет заметно, что цвет запаздывает.
const CHECK_INTERVAL_MS = 150;

interface DecorClasses {
  fall: string;
  spring: string;
  snow: string;
  muted: string;
  springTones: string[];
  snowTones: string[];
}

// Хранилище может быть запрещено настройками браузера уже на чтении свойства.
function storageOf(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function setupFallingDecor(root: HTMLElement) {
  if (root.hasAttribute(INITIALIZED)) return;
  root.setAttribute(INITIALIZED, '');

  const classes = JSON.parse(root.dataset['classes'] ?? '{}') as DecorClasses;
  const kind: DecorKind = root.dataset['kind'] === 'snow' ? 'snow' : 'springs';
  const shapes = Array.from(root.querySelector('template')?.content.children ?? []);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const offInputs = Array.from(document.querySelectorAll<HTMLInputElement>('[data-decor-off]'));
  const toggles = Array.from(document.querySelectorAll<HTMLElement>('[data-decor-toggle]'));
  let off = readDecorOff(storageOf());

  // Список собираем заново при каждой проверке: лента ЧАВО листается, а результаты поиска появляются позже.
  const muteOverText = () => {
    const blocks = Array.from(document.querySelectorAll(TEXT_BLOCKS), (element) => element.getBoundingClientRect());
    root.querySelectorAll<HTMLElement>('[data-falling-item]').forEach((item) => {
      item.firstElementChild?.classList.toggle(classes.muted, overlapsAny(item.getBoundingClientRect(), blocks));
    });
  };

  let checkTimer: number | undefined;
  const stopChecks = () => {
    window.clearInterval(checkTimer);
    checkTimer = undefined;
  };
  const startChecks = () => {
    stopChecks();
    muteOverText();
    checkTimer = window.setInterval(muteOverText, CHECK_INTERVAL_MS);
  };

  const clear = () => {
    stopChecks();
    root.querySelectorAll('[data-falling-item]').forEach((item) => {
      item.remove();
    });
  };

  const isDrawn = () => root.querySelector('[data-falling-item]') !== null;

  const draw = () => {
    clear();
    if (off || reducedMotion.matches || shapes.length === 0) return;

    const random = createRandom(Math.floor(Math.random() * 2 ** 32));
    const isSnow = kind === 'snow';
    const tones = isSnow ? classes.snowTones : classes.springTones;

    for (const item of fallingItems(fallingCount(window.innerWidth), random)) {
      const fall = document.createElement('div');
      fall.setAttribute('data-falling-item', '');
      fall.className = classes.fall;
      fall.style.left = `${String(item.leftPercent)}%`;
      fall.style.animationDuration = `${String(item.fallMs)}ms`;
      fall.style.animationDelay = `${String(item.delayMs)}ms`;

      const spin = document.createElement('div');
      // У пружинки цвет закреплён за формой, как в макете; снежинка красится в любой цвет палитры.
      const shapeIndex = Math.floor(item.pick * shapes.length);
      const toneIndex = isSnow ? Math.floor(item.pick * tones.length) : shapeIndex;
      spin.className = [isSnow ? classes.snow : classes.spring, tones[toneIndex] ?? ''].join(' ');
      spin.style.animationDuration = `${String(item.spinMs)}ms`;
      spin.style.scale = String(item.scale);

      const shape = shapes[shapeIndex];
      if (shape) spin.append(shape.cloneNode(true));
      fall.append(spin);
      root.append(fall);
    }
    // Первая проверка до отрисовки кадра: фигура не должна мелькнуть яркой поверх текста.
    if (!document.hidden) startChecks();
  };

  const syncInputs = () => {
    for (const input of offInputs) input.checked = off;
    // Без скрипта и при сниженной анимации падать нечему, и переключатель не нужен.
    for (const toggle of toggles) toggle.hidden = reducedMotion.matches;
  };

  for (const input of offInputs) {
    input.addEventListener('change', () => {
      off = input.checked;
      writeDecorOff(storageOf(), off);
      syncInputs();
      draw();
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopChecks();
    else if (isDrawn()) startChecks();
  });

  reducedMotion.addEventListener('change', () => {
    syncInputs();
    draw();
  });

  syncInputs();
  draw();
}
