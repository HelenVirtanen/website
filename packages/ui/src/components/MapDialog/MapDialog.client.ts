const INITIALIZED = 'data-map-dialog-initialized';

export function setupMapDialog(root: HTMLElement) {
  if (root.hasAttribute(INITIALIZED)) return;
  root.setAttribute(INITIALIZED, '');

  const trigger = root.querySelector<HTMLButtonElement>('[data-map-open]');
  const fallback = root.querySelector<HTMLElement>('[data-map-fallback]');
  const dialog = root.querySelector('dialog');
  const close = root.querySelector<HTMLButtonElement>('[data-map-close]');
  const frame = root.querySelector<HTMLElement>('[data-map-frame]');
  if (!trigger || !dialog || !frame) return;

  trigger.hidden = false;
  if (fallback) fallback.hidden = true;

  trigger.addEventListener('click', () => {
    dialog.showModal();
    // Чужой фрейм только по просьбе: до этого страница не обращается к сервису, а Tab не заходит в карту.
    if (!frame.querySelector('iframe')) {
      const map = document.createElement('iframe');
      map.src = frame.dataset['src'] ?? '';
      map.title = frame.dataset['title'] ?? '';
      map.referrerPolicy = 'no-referrer-when-downgrade';
      frame.append(map);
    }
  });

  close?.addEventListener('click', () => {
    dialog.close();
  });

  // Нажатие по затемнению приходит на сам dialog: всё содержимое лежит во внутренней обёртке.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}
