const INITIALIZED = 'data-nav-initialized';
const OPEN = 'data-nav-open';

export function setupNavBar(nav: HTMLElement) {
  if (nav.hasAttribute(INITIALIZED)) return;
  nav.setAttribute(INITIALIZED, '');

  const toggle = nav.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const closeButton = nav.querySelector<HTMLButtonElement>('[data-nav-close]');
  const menu = nav.querySelector<HTMLElement>('[data-nav-menu]');
  const menuLinks = menu?.querySelector('[data-nav-links]');
  if (!toggle || !menu || !menuLinks) return;

  const open = () => {
    menu.removeAttribute('hidden');
    nav.setAttribute(OPEN, '');
    toggle.setAttribute('aria-expanded', 'true');
    // Бургер при открытом меню скрыт, фокус переходит на крестик на его месте.
    closeButton?.focus();
  };

  const close = () => {
    const hadFocus = nav.contains(document.activeElement);
    menu.setAttribute('hidden', '');
    nav.removeAttribute(OPEN);
    toggle.setAttribute('aria-expanded', 'false');
    if (hadFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    if (menu.hasAttribute('hidden')) open();
    else close();
  });

  closeButton?.addEventListener('click', close);

  // Нажатие мимо пунктов и кнопок (на саму панель) закрывает меню.
  menu.addEventListener('click', (event) => {
    if (event.target === menu) close();
  });

  menu.querySelectorAll('a').forEach((anchor) => {
    anchor.addEventListener('click', close);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hasAttribute('hidden')) close();
  });
}
