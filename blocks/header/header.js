/*
 * Header Block — Jared EDS
 * Sticky header with logo, nav, icons, mobile drawer, and search overlay.
 */

const NAV_ITEMS = [
  {
    label: 'Engagement + Wedding',
    href: '/engagement-wedding',
    dropdown: [
      { label: 'Engagement Rings', href: '/engagement-rings' },
      { label: 'Wedding Bands', href: '/wedding-bands' },
      { label: 'Sets & Bridal Jewelry', href: '/bridal-sets' },
      { label: 'Anniversary Gifts', href: '/anniversary' },
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
  { label: 'Gifts', href: '/gifts' },
  {
    label: 'Create with Jared',
    href: '/create-with-jared',
    dropdown: [
      { label: 'Design Your Ring', href: '/design-your-ring' },
      { label: 'Custom Jewelry', href: '/custom' },
      { label: 'Engravings', href: '/engravings' },
    ],
  },
  {
    label: 'Collections',
    href: '/collections',
    dropdown: [
      { label: 'New Arrivals', href: '/new-arrivals' },
      { label: 'Best Sellers', href: '/best-sellers' },
      { label: 'Vault Collection', href: '/vault' },
    ],
  },
  { label: 'Sale', href: '/sale', className: 'sale' },
];

/** SVG icon helpers */
const icons = {
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  account: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
};

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
      const dropdown = document.createElement('div');
      dropdown.className = 'header__dropdown';
      dropdown.setAttribute('role', 'menu');

      item.dropdown.forEach((sub) => {
        const subA = document.createElement('a');
        subA.href = sub.href;
        subA.textContent = sub.label;
        subA.setAttribute('role', 'menuitem');
        dropdown.appendChild(subA);
      });

      li.appendChild(dropdown);
    }

    ul.appendChild(li);
  });

  nav.appendChild(ul);
  return nav;
}

/**
 * Builds the header icon buttons.
 * @returns {{ container: HTMLElement, searchBtn: HTMLElement }}
 */
function buildIcons() {
  const container = document.createElement('div');
  container.className = 'header__icons';

  const iconDefs = [
    { key: 'search', label: 'Search', href: null },
    { key: 'account', label: 'Account', href: '/account' },
    { key: 'heart', label: 'Wishlist', href: '/wishlist' },
    { key: 'cart', label: 'Bag', href: '/cart', badge: '0' },
  ];

  let searchBtn = null;

  iconDefs.forEach(({ key, label, href, badge }) => {
    const el = href ? document.createElement('a') : document.createElement('button');
    el.className = 'header__icon-btn';
    el.setAttribute('aria-label', label);
    if (href) el.href = href;

    el.innerHTML = `
      ${icons[key]}
      <span class="icon-label">${label}</span>
      ${badge !== undefined ? `<span class="header__cart-count" aria-label="${badge} items in cart">${badge}</span>` : ''}
    `;

    if (key === 'search') searchBtn = el;
    container.appendChild(el);
  });

  return { container, searchBtn };
}

/**
 * Builds the search overlay.
 * @returns {{ overlay: HTMLElement, input: HTMLInputElement }}
 */
function buildSearchOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'header__search-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Search');
  overlay.setAttribute('aria-modal', 'true');

  const box = document.createElement('div');
  box.className = 'header__search-box';

  const label = document.createElement('label');
  label.setAttribute('for', 'header-search');
  label.className = 'sr-only';
  label.textContent = 'Search Jared';

  const input = document.createElement('input');
  input.type = 'search';
  input.id = 'header-search';
  input.className = 'header__search-input';
  input.placeholder = 'Search rings, necklaces, diamonds…';
  input.autocomplete = 'off';

  box.append(label, input);
  overlay.appendChild(box);

  return { overlay, input };
}

/**
 * Builds mobile drawer navigation.
 * @returns {{ drawer: HTMLElement, overlay: HTMLElement }}
 */
function buildMobileNav() {
  const mobileOverlay = document.createElement('div');
  mobileOverlay.className = 'header__mobile-overlay';

  const drawer = document.createElement('div');
  drawer.className = 'header__mobile-nav';
  drawer.setAttribute('aria-label', 'Mobile navigation');

  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.className = 'header__logo-text';
  logoLink.style.cssText = 'display:block;margin-bottom:var(--spacing-lg);font-family:var(--font-display);font-size:22px;font-weight:700;letter-spacing:0.25em;color:var(--color-primary)';
  logoLink.textContent = 'JARED';
  drawer.appendChild(logoLink);

  NAV_ITEMS.forEach((item) => {
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.label;
    if (item.className) a.className = item.className;
    drawer.appendChild(a);
  });

  return { drawer, mobileOverlay };
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  block.innerHTML = '';

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.className = 'header__logo';
  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.setAttribute('aria-label', 'Jared – Go to homepage');
  const logoText = document.createElement('span');
  logoText.className = 'header__logo-text';
  logoText.textContent = 'JARED';
  logoLink.appendChild(logoText);
  logoDiv.appendChild(logoLink);

  // Nav
  const nav = buildNav();

  // Icons
  const { container: iconsDiv, searchBtn } = buildIcons();

  // Hamburger
  const hamburger = document.createElement('button');
  hamburger.className = 'header__hamburger';
  hamburger.setAttribute('aria-label', 'Open menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  block.append(logoDiv, nav, iconsDiv, hamburger);

  // Search overlay
  const { overlay: searchOverlay, input: searchInput } = buildSearchOverlay();
  document.body.appendChild(searchOverlay);

  // Mobile nav
  const { drawer, mobileOverlay } = buildMobileNav();
  document.body.appendChild(mobileOverlay);
  document.body.appendChild(drawer);

  // Search toggle
  function openSearch() {
    searchOverlay.classList.add('open');
    requestAnimationFrame(() => searchInput.focus());
  }
  function closeSearch() {
    searchOverlay.classList.remove('open');
  }

  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openSearch();
  });
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeMobile();
    }
  });

  // Mobile toggle
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
}
