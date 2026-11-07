import { stepIndex } from './step';

const READY = 'data-lightbox-ready';

export function setupLightbox(root: HTMLElement): void {
  if (root.hasAttribute(READY)) return;
  root.setAttribute(READY, '');

  const dialog = root.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
  const image = root.querySelector<HTMLImageElement>('[data-lightbox-image]');
  const caption = root.querySelector<HTMLElement>('[data-lightbox-caption]');
  const items = Array.from(root.querySelectorAll<HTMLAnchorElement>('a[data-lightbox-item]'));
  if (!dialog || !image || !caption || items.length === 0) return;

  const nav = root.querySelector<HTMLElement>('[data-lightbox-nav]');
  if (nav) nav.hidden = items.length < 2;
  let current = 0;

  const show = (index: number) => {
    const item = items[index];
    if (!item) return;
    current = index;
    const text = item.dataset['caption'] ?? item.querySelector('img')?.alt ?? '';
    image.src = item.href;
    image.alt = text;
    caption.textContent = text;
    caption.hidden = text === '';
  };

  items.forEach((item, index) => {
    item.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      show(index);
      dialog.showModal();
    });
  });

  const step = (delta: number) => {
    show(stepIndex(current, delta, items.length));
  };

  root.querySelector('[data-lightbox-close]')?.addEventListener('click', () => {
    dialog.close();
  });
  root.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => {
    step(-1);
  });
  root.querySelector('[data-lightbox-next]')?.addEventListener('click', () => {
    step(1);
  });
  dialog.addEventListener('keydown', (event) => {
    if (items.length < 2) return;
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight') step(1);
  });

  // Клик мимо фото приходит на сам dialog. Нажатие должно начаться там же, иначе закроет и выделение.
  let pressedOnBackdrop = false;
  dialog.addEventListener('mousedown', (event) => {
    pressedOnBackdrop = event.target === dialog;
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && pressedOnBackdrop) dialog.close();
  });

  // Фокус возвращается на превью, с которого открыли: при листании браузер его не помнит.
  dialog.addEventListener('close', () => {
    items[current]?.focus();
  });
}
