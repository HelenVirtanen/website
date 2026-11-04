import { createRandom } from '../TagPile/pile';
import {
  fallingCount,
  fallingItems,
  readDecor,
  writeDecor,
  type DecorKind,
  type DecorState,
} from './falling';

const INITIALIZED = 'data-falling-decor-initialized';

interface DecorClasses {
  fall: string;
  spring: string;
  snow: string;
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

const shapesOf = (root: HTMLElement, kind: DecorKind): Element[] =>
  Array.from(root.querySelector<HTMLTemplateElement>(`template[data-shape="${kind}"]`)?.content.children ?? []);

export function setupFallingDecor(root: HTMLElement) {
  if (root.hasAttribute(INITIALIZED)) return;
  root.setAttribute(INITIALIZED, '');

  const classes = JSON.parse(root.dataset['classes'] ?? '{}') as DecorClasses;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const offInputs = Array.from(document.querySelectorAll<HTMLInputElement>('[data-decor-off]'));
  const snowInputs = Array.from(document.querySelectorAll<HTMLInputElement>('[data-decor-snow]'));
  const toggles = Array.from(document.querySelectorAll<HTMLElement>('[data-decor-toggle]'));
  let state: DecorState = readDecor(storageOf());

  const clear = () => {
    root.querySelectorAll('[data-falling-item]').forEach((item) => {
      item.remove();
    });
  };

  const draw = () => {
    clear();
    if (!state.enabled || reducedMotion.matches) return;

    const shapes = shapesOf(root, state.kind);
    if (shapes.length === 0) return;
    const random = createRandom(Math.floor(Math.random() * 2 ** 32));

    for (const item of fallingItems(fallingCount(window.innerWidth), random)) {
      const fall = document.createElement('div');
      fall.setAttribute('data-falling-item', '');
      fall.className = classes.fall;
      fall.style.left = `${String(item.leftPercent)}%`;
      fall.style.animationDuration = `${String(item.fallMs)}ms`;
      fall.style.animationDelay = `${String(item.delayMs)}ms`;

      const spin = document.createElement('div');
      const isSnow = state.kind === 'snow';
      const tones = isSnow ? classes.snowTones : classes.springTones;
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
  };

  const syncInputs = () => {
    for (const input of offInputs) input.checked = !state.enabled;
    for (const input of snowInputs) {
      input.checked = state.kind === 'snow';
      input.disabled = !state.enabled;
    }
    // Без скрипта и при сниженной анимации падать нечему, и переключатели не нужны.
    for (const toggle of toggles) toggle.hidden = reducedMotion.matches;
  };

  const apply = (next: DecorState) => {
    state = next;
    writeDecor(storageOf(), state);
    syncInputs();
    draw();
  };

  for (const input of offInputs) {
    input.addEventListener('change', () => {
      apply({ ...state, enabled: !input.checked });
    });
  }
  for (const input of snowInputs) {
    input.addEventListener('change', () => {
      apply({ ...state, kind: input.checked ? 'snow' : 'springs' });
    });
  }

  reducedMotion.addEventListener('change', () => {
    syncInputs();
    draw();
  });

  syncInputs();
  draw();
}
