/*
 * Header Block — Jared EDS
 * White header with JARED stacked wordmark, Figma-accurate nav,
 * icon buttons, search overlay, and mobile drawer.
 */

const NAV_ITEMS = [
  {
    label: 'Engagement',
    href: '/engagement-rings',
    dropdown: [
      { label: 'Engagement Rings', href: '/engagement-rings' },
      { label: 'Wedding Bands', href: '/wedding-bands' },
      { label: 'Bridal Sets', href: '/bridal-sets' },
      { label: 'Anniversary Gifts', href: '/anniversary' },
    ],
  },
  {
    label: 'Wedding & Anniversary',
    href: '/wedding-anniversary',
    dropdown: [
      { label: 'Wedding Bands', href: '/wedding-bands' },
      { label: 'Anniversary Rings', href: '/anniversary-rings' },
      { label: 'Couples Jewelry', href: '/couples-jewelry' },
    ],
  },
  {
    label: 'Jewelry',
    href: '/jewelry',
    dropdown: [
      { label: 'Necklaces', href: '/necklaces' },
      { label: 'Earrings', href: '/earrings' },
      { label: 'Bracelets', href: '/bracelets' },
      { label: 'Rings', href: '/rings' },
    ],
  },
  {
    label: 'Diamonds',
    href: '/diamonds',
    dropdown: [
      { label: 'Loose Diamonds', href: '/loose-diamonds' },
      { label: 'Lab-Created Diamonds', href: '/lab-created' },
      { label: 'Diamond Education', href: '/diamond-education' },
    ],
  },
  { label: 'Watches', href: '/watches' },
  { label: 'Gifts', href: '/gifts' },
  { label: 'Sale', href: '/sale', className: 'sale' },
];

/** SVG icon set — all stroked, no fill, stroke-width 1.5 */
const ICONS = {
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  account: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
};

/**
 * Builds the stacked JARED / JEWELERS wordmark.
 * @returns {HTMLElement}
 */
function buildLogo() {
  const wrapper = document.createElement('div');
  wrapper.className = 'header__logo';

  const link = document.createElement('a');
  link.href = '/';
  link.setAttribute('aria-label', 'Jared — Go to homepage');

  const name = document.createElement('span');
  name.className = 'header__logo-text';
  name.textContent = 'JARED';

  const sub = document.createElement('span');
  sub.className = 'header__logo-sub';
  sub.textContent = 'JEWELERS';

  link.append(name, sub);
  wrapper.appendChild(link);
  return wrapper;
}

/**
 * Builds the desktop navigation.
 * @returns {HTMLElement}
 */
function buildNav() {
  const nav = document.createElement('nav');
  nav.className = 'header__nav';
  nav.setAttribute('aria-label', 'Main navigation');

  const ul = document.createElement('ul');
  ul.className = 'header__nav-list';

  NAV_ITEMS.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'header__nav-item';

    const a = document.createElement('a');
    a.href = item.href;
    a.className = `header__nav-link${item.className ? ` ${item.className}` : ''}`;
    a.textContent = item.label;

    li.appendChild(a);

    if (item.dropdown?.length) {
      const dd = document.createElement('div');
      dd.className = 'header__dropdown';
      dd.setAttribute('role', 'menu');

      item.dropdown.forEach((sub) => {
        const subA = document.createElement('a');
        subA.href = sub.href;
        subA.textContent = sub.label;
        subA.setAttribute('role', 'menuitem');
        dd.appendChild(subA);
      });

      li.appendChild(dd);
    }

    ul.appendChild(li);
  });

  nav.appendChild(ul);
  return nav;
}

/**
 * Builds the icon button row (search, account, wishlist, bag).
 * @returns {{ container: HTMLElement, searchBtn: HTMLElement }}
 */
function buildIcons() {
  const container = document.createElement('div');
  container.className = 'header__icons';

  const defs = [
    { key: 'search',  label: 'Search',   href: null,       badge: null },
    { key: 'account', label: 'Account',  href: '/account', badge: null },
    { key: 'heart',   label: 'Wishlist', href: '/wishlist', badge: null },
    { key: 'cart',    label: 'Bag',      href: '/cart',     badge: '0' },
  ];

  let searchBtn = null;

  defs.forEach(({ key, label, href, badge }) => {
    const el = href ? document.createElement('a') : document.createElement('button');
    el.className = 'header__icon-btn';
    el.setAttribute('aria-label', label);
    if (href) el.href = href;

    el.innerHTML = `
      ${ICONS[key]}
      <span class="icon-label">${label}</span>
      ${badge !== null ? `<span class="header__cart-count" aria-label="${badge} items in bag">${badge}</span>` : ''}
    `;

    if (key === 'search') searchBtn = el;
    container.appendChild(el);
  });

  return { container, searchBtn };
}

/**
 * Builds the search overlay dialog.
 * @returns {{ overlay: HTMLElement, input: HTMLInputElement }}
 */
function buildSearchOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'header__search-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Search Jared');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-hidden', 'true');

  const box = document.createElement('div');
  box.className = 'header__search-box';

  const label = document.createElement('label');
  label.setAttribute('for', 'header-search-input');
  label.className = 'sr-only';
  label.textContent = 'Search rings, necklaces, diamonds…';

  const input = document.createElement('input');
  input.type = 'search';
  input.id = 'header-search-input';
  input.className = 'header__search-input';
  input.placeholder = 'Search rings, necklaces, diamonds…';
  input.autocomplete = 'off';

  box.append(label, input);
  overlay.appendChild(box);

  return { overlay, input };
}

/**
 * Builds the mobile slide-in drawer.
 * @returns {{ drawer: HTMLElement, mobileOverlay: HTMLElement }}
 */
function buildMobileNav() {
  const mobileOverlay = document.createElement('div');
  mobileOverlay.className = 'header__mobile-overlay';

  const drawer = document.createElement('div');
  drawer.className = 'header__mobile-nav';
  drawer.setAttribute('aria-label', 'Mobile navigation');
  drawer.setAttribute('role', 'navigation');

  // Stacked logo inside drawer
  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.setAttribute('aria-label', 'Jared home');
  Object.assign(logoLink.style, {
    display: 'block',
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '0.28em',
    color: 'var(--color-primary)',
    textTransform: 'uppercase',
    marginBottom: 'var(--spacing-lg)',
    borderBottom: 'none',
  });
  logoLink.textContent = 'JARED';
  drawer.appendChild(logoLink);

  NAV_ITEMS.forEach((item) => {
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.label;
    if (item.className) a.classList.add(item.className);
    drawer.appendChild(a);
  });

  return { drawer, mobileOverlay };
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  block.innerHTML = '';

  const logoEl = buildLogo();
  const navEl = buildNav();
  const { container: iconsEl, searchBtn } = buildIcons();

  const hamburger = document.createElement('button');
  hamburger.className = 'header__hamburger';
  hamburger.setAttribute('aria-label', 'Open menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  block.append(logoEl, navEl, iconsEl, hamburger);

  // Search overlay — append to body so it escapes stacking context
  const { overlay: searchOverlay, input: searchInput } = buildSearchOverlay();
  document.body.appendChild(searchOverlay);

  // Mobile nav — append to body
  const { drawer, mobileOverlay } = buildMobileNav();
  document.body.appendChild(mobileOverlay);
  document.body.appendChild(drawer);

  /* ─ Search ─ */
  function openSearch() {
    searchOverlay.classList.add('open');
    searchOverlay.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => searchInput.focus());
  }

  function closeSearch() {
    searchOverlay.classList.remove('open');
    searchOverlay.setAttribute('aria-hidden', 'true');
  }

  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openSearch();
  });

  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  /* ─ Mobile drawer ─ */
  function openMobile() {
    drawer.classList.add('open');
    mobileOverlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    drawer.classList.remove('open');
    mobileOverlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (drawer.classList.contains('open')) closeMobile();
    else openMobile();
  });

  mobileOverlay.addEventListener('click', closeMobile);

  /* ─ Global keyboard ─ */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeMobile();
    }
  });
}
