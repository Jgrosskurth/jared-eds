/*
 * Footer Block — Jared EDS
 * Multi-column dark teal footer with stacked wordmark, social links,
 * newsletter form, link columns (expandable on mobile), legal bar, payment icons.
 */

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/jared',
    svg: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  },
  {
    label: 'Pinterest',
    href: 'https://pinterest.com/jared',
    svg: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>`,
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/jared',
    svg: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/jared',
    svg: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>`,
  },
];

const FOOTER_COLUMNS = [
  {
    title: 'Engagement',
    links: [
      { label: 'Engagement Rings', href: '/engagement-rings' },
      { label: 'Wedding Bands',    href: '/wedding-bands' },
      { label: 'Bridal Sets',      href: '/bridal-sets' },
      { label: 'Anniversary Gifts', href: '/anniversary' },
      { label: 'Create with Jared', href: '/create-with-jared' },
    ],
  },
  {
    title: 'Wedding & Anniversary',
    links: [
      { label: 'Loose Diamonds',       href: '/loose-diamonds' },
      { label: 'Lab-Created Diamonds', href: '/lab-created' },
      { label: 'Diamond Education',    href: '/diamond-education' },
      { label: '4 Cs Guide',           href: '/4-cs' },
      { label: 'Diamond Shapes',       href: '/diamond-shapes' },
    ],
  },
  {
    title: 'Jewelry',
    links: [
      { label: 'Book an Appointment', href: '/book-appointment' },
      { label: 'Custom Design',       href: '/custom' },
      { label: 'Ring Sizing',         href: '/ring-sizing' },
      { label: 'Jewelry Repair',      href: '/repair' },
      { label: 'Vault Rewards',       href: '/vault-rewards' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { label: 'Help Center',       href: '/help' },
      { label: 'Find a Store',      href: '/store-locator' },
      { label: 'Shipping & Returns', href: '/shipping' },
      { label: 'Order Status',      href: '/order-status' },
      { label: 'Contact Us',        href: '/contact' },
    ],
  },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy',    href: '/privacy' },
  { label: 'Terms of Use',      href: '/terms' },
  { label: 'Accessibility',     href: '/accessibility' },
  { label: 'Cookie Settings',   href: '#cookies' },
  { label: 'CA Privacy Rights', href: '/ca-privacy' },
];

const PAYMENT_ICONS = ['VISA', 'MC', 'AMEX', 'PAYPAL', 'AFFIRM', 'APPLE PAY'];

/**
 * Builds the stacked JARED / JEWELERS wordmark + tagline + social + newsletter.
 * @returns {HTMLElement}
 */
function buildBrandColumn() {
  const brand = document.createElement('div');
  brand.className = 'footer__brand';

  /* Stacked wordmark */
  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.className = 'footer__logo';

  const logoName = document.createElement('span');
  logoName.className = 'footer__logo-name';
  logoName.textContent = 'JARED';

  const logoSub = document.createElement('span');
  logoSub.className = 'footer__logo-sub';
  logoSub.textContent = 'JEWELERS';

  logoLink.append(logoName, logoSub);

  const tagline = document.createElement('p');
  tagline.className = 'footer__tagline';
  tagline.textContent = 'The Galleria of Jewelry — Where love stories begin.';

  /* Social */
  const social = document.createElement('div');
  social.className = 'footer__social';
  SOCIAL_LINKS.forEach(({ label, href, svg }) => {
    const a = document.createElement('a');
    a.href = href;
    a.className = 'footer__social-link';
    a.setAttribute('aria-label', label);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = svg;
    social.appendChild(a);
  });

  /* Newsletter */
  const newsletter = document.createElement('div');
  newsletter.className = 'footer__newsletter';

  const newsletterLabel = document.createElement('p');
  newsletterLabel.textContent = 'Get exclusive offers';

  const form = document.createElement('form');
  form.className = 'footer__newsletter-form';
  form.setAttribute('aria-label', 'Newsletter signup');

  const input = document.createElement('input');
  input.type = 'email';
  input.className = 'footer__newsletter-input';
  input.placeholder = 'Enter your email';
  input.setAttribute('aria-label', 'Email address for newsletter');
  input.autocomplete = 'email';

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'footer__newsletter-btn';
  btn.textContent = 'Join';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      btn.textContent = '✓';
      input.value = '';
      input.placeholder = 'Thank you!';
      input.disabled = true;
      btn.disabled = true;
    }
  });

  form.append(input, btn);
  newsletter.append(newsletterLabel, form);

  brand.append(logoLink, tagline, social, newsletter);
  return brand;
}

/**
 * Builds a footer link column.
 * @param {Object} col
 * @returns {HTMLElement}
 */
function buildColumn(col) {
  const column = document.createElement('div');
  column.className = 'footer__column';

  const titleEl = document.createElement('p');
  titleEl.className = 'footer__column-title';
  titleEl.textContent = col.title;

  const ul = document.createElement('ul');
  ul.className = 'footer__column-links';

  col.links.forEach(({ label, href }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    li.appendChild(a);
    ul.appendChild(li);
  });

  column.append(titleEl, ul);

  /* Mobile expand/collapse */
  titleEl.addEventListener('click', () => {
    column.classList.toggle('open');
  });

  return column;
}

/**
 * Builds the bottom legal bar.
 * @returns {HTMLElement}
 */
function buildBottom() {
  const bottom = document.createElement('div');
  bottom.className = 'footer__bottom';

  const legal = document.createElement('div');
  legal.className = 'footer__legal';

  const copyright = document.createElement('span');
  copyright.className = 'footer__copyright';
  copyright.textContent = `© ${new Date().getFullYear()} Jared the Galleria of Jewelry. All Rights Reserved.`;

  const legalLinks = document.createElement('div');
  legalLinks.className = 'footer__legal-links';

  LEGAL_LINKS.forEach(({ label, href }) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    legalLinks.appendChild(a);
  });

  legal.append(copyright, legalLinks);

  const payment = document.createElement('div');
  payment.className = 'footer__payment';
  PAYMENT_ICONS.forEach((icon) => {
    const span = document.createElement('span');
    span.className = 'footer__payment-icon';
    span.textContent = icon;
    payment.appendChild(span);
  });

  bottom.append(legal, payment);
  return bottom;
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  block.innerHTML = '';

  const top = document.createElement('div');
  top.className = 'footer__top';

  top.appendChild(buildBrandColumn());
  FOOTER_COLUMNS.forEach((col) => top.appendChild(buildColumn(col)));

  block.appendChild(top);
  block.appendChild(buildBottom());
}
