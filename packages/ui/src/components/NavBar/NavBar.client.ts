const INITIALIZED = 'data-nav-initialized';

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
    toggle.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    menu.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    if (menu.hasAttribute('hidden')) open();
    else close();
  });

  closeButton?.addEventListener('click', close);

  menu.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node) || menuLinks.contains(target)) return;
    close();
  });

  menu.querySelectorAll('a').forEach((anchor) => {
    anchor.addEventListener('click', close);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hasAttribute('hidden')) close();
  });
}
