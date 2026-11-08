import { shuffled } from '../Card/sliderOrder';

const READY = 'data-shuffled-ready';

export function setupShuffledList(list: HTMLElement): void {
  if (list.hasAttribute(READY)) return;
  list.setAttribute(READY, '');
  list.append(...shuffled(Array.from(list.children), Math.random));
}
