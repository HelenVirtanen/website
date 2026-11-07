import { shuffled } from '../Card/sliderOrder';
import { targetOf, withReview } from './reviewUrl';

const READY = 'data-review-ready';
// Запись истории создана кликом по стикеру: закрытие возвращается с неё назад, а не копит записи.
const OPENED_HERE = 'moscowcssReviewOpenedHere';

const isOpenedHere = (): boolean => (history.state as Record<string, unknown> | null)?.[OPENED_HERE] === true;

async function copyLink(link: HTMLAnchorElement, status: HTMLElement | null): Promise<void> {
  try {
    await navigator.clipboard.writeText(link.href);
    if (status) status.textContent = status.dataset['copied'] ?? '';
  } catch {
    if (status) status.textContent = status.dataset['failed'] ?? '';
  }
}

export function setupReviewWall(root: HTMLElement): void {
  if (root.hasAttribute(READY)) return;
  root.setAttribute(READY, '');

  const list = root.querySelector('[data-review-list]');
  list?.append(...shuffled(Array.from(list.children), Math.random));

  const dialogs = new Map(
    Array.from(root.querySelectorAll<HTMLDialogElement>('dialog[data-review-dialog]'), (dialog) => [
      dialog.dataset['reviewDialog'] ?? '',
      dialog,
    ]),
  );
  const known = new Set(dialogs.keys());
  const stickerOf = (slug: string) =>
    Array.from(root.querySelectorAll<HTMLAnchorElement>('a[data-review-sticker]')).find(
      (sticker) => sticker.dataset['reviewSticker'] === slug,
    );

  const sync = () => {
    const { open, cleanUrl } = targetOf(new URL(location.href), known);
    if (cleanUrl) history.replaceState(history.state, '', cleanUrl);
    for (const [slug, dialog] of dialogs) {
      if (slug !== open && dialog.open) dialog.close();
    }
    const target = open === undefined ? undefined : dialogs.get(open);
    if (target && !target.open) target.showModal();
  };

  root.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const sticker = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-review-sticker]') : null;
    const slug = sticker?.dataset['reviewSticker'];
    if (slug === undefined) return;
    event.preventDefault();
    history.pushState({ [OPENED_HERE]: true }, '', withReview(new URL(location.href), slug));
    sync();
  });

  for (const [slug, dialog] of dialogs) {
    const status = dialog.querySelector<HTMLElement>('[data-review-status]');

    dialog.addEventListener('close', () => {
      if (status) status.textContent = '';
      const url = new URL(location.href);
      // Окно закрыл сам адрес (кнопка «Назад») — тогда менять в истории нечего.
      if (targetOf(url, known).open === slug) {
        if (isOpenedHere()) history.back();
        else history.replaceState(null, '', withReview(url, undefined));
      }
      // Окно могло открыться прямо из адреса: тогда браузеру некуда вернуть фокус самому.
      stickerOf(slug)?.focus();
    });

    // Клик мимо содержимого приходит на сам dialog: это подложка. Нажатие должно начаться там же,
    // иначе выделение текста, отпущенное за краем окна, закрыло бы его.
    let pressedOnBackdrop = false;
    dialog.addEventListener('mousedown', (event) => {
      pressedOnBackdrop = event.target === dialog;
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog && pressedOnBackdrop) dialog.close();
    });

    dialog.querySelector('[data-review-close]')?.addEventListener('click', (event) => {
      event.preventDefault();
      dialog.close();
    });

    const copy = dialog.querySelector<HTMLAnchorElement>('[data-review-copy]');
    copy?.addEventListener('click', (event) => {
      event.preventDefault();
      void copyLink(copy, status);
    });
  }

  window.addEventListener('popstate', sync);
  sync();
}
