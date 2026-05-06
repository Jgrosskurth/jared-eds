/*
 * Announcement Bar Block — Jared EDS
 * Rotating promo messages with left/right utility nav links.
 */

const INTERVAL_MS = 5000;

const DEFAULT_MESSAGES = [
  'Free Shipping on Orders $50+ | Shop Now',
  'Complimentary Gift Wrapping on All Orders',
  'Up to 40% Off Select Engagement Rings — Shop the Sale',
  'Buy Now, Pay Later with Affirm',
];

const LEFT_LINKS = [
  { label: 'Find a Store', href: '/store-locator' },
  { label: 'Help', href: '/help' },
];

const RIGHT_LINKS = [
  { label: 'Book an Appointment', href: '/book-appointment' },
  { label: 'Vault Rewards', href: '/vault-rewards' },
];

/**
 * Parses messages from the block's table rows.
 * @param {HTMLElement} block
 * @returns {string[]}
 */
function parseMessages(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const messages = rows
    .map((row) => row.querySelector('div')?.innerHTML?.trim())
    .filter(Boolean);
  return messages.length ? messages : DEFAULT_MESSAGES;
}

/**
 * Creates the announcement bar HTML.
 * @param {string[]} messages
 * @returns {HTMLElement}
 */
function buildBar(messages) {
  const bar = document.createElement('div');
  bar.className = 'announcement-bar__inner';
  bar.style.display = 'contents';

  // Left — utility links
  const left = document.createElement('div');
  left.className = 'announcement-bar__left';
  LEFT_LINKS.forEach(({ label, href }) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    left.appendChild(a);
  });

  // Center — carousel
  const center = document.createElement('div');
  center.className = 'announcement-bar__center';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'announcement-bar__prev';
  prevBtn.setAttribute('aria-label', 'Previous announcement');
  prevBtn.innerHTML = '&#8249;';

  const track = document.createElement('div');
  track.className = 'announcement-bar__track';

  messages.forEach((msg, i) => {
    const slide = document.createElement('div');
    slide.className = `announcement-bar__slide${i === 0 ? ' active' : ''}`;
    slide.innerHTML = msg;
    track.appendChild(slide);
  });

  const nextBtn = document.createElement('button');
  nextBtn.className = 'announcement-bar__next';
  nextBtn.setAttribute('aria-label', 'Next announcement');
  nextBtn.innerHTML = '&#8250;';

  center.append(prevBtn, track, nextBtn);

  // Right — utility links
  const right = document.createElement('div');
  right.className = 'announcement-bar__right';
  RIGHT_LINKS.forEach(({ label, href }) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    right.appendChild(a);
  });

  return { left, center, right, track };
}

/**
 * Controls the carousel rotation.
 * @param {HTMLElement} track
 * @returns {{ prev: Function, next: Function, pause: Function, resume: Function }}
 */
function createCarousel(track) {
  const slides = [...track.querySelectorAll('.announcement-bar__slide')];
  let current = 0;
  let timer = null;

  function goTo(idx) {
    slides[current].classList.remove('active');
    slides[current].classList.add('exiting');
    const prev = current;
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    setTimeout(() => slides[prev].classList.remove('exiting'), 400);
  }

  function start() {
    timer = setInterval(() => goTo(current + 1), INTERVAL_MS);
  }

  function stop() {
    clearInterval(timer);
  }

  return {
    prev: () => { stop(); goTo(current - 1); start(); },
    next: () => { stop(); goTo(current + 1); start(); },
    pause: stop,
    resume: start,
    start,
  };
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const messages = parseMessages(block);
  block.innerHTML = '';

  const { left, center, right, track } = buildBar(messages);
  block.append(left, center, right);

  const carousel = createCarousel(track);
  carousel.start();

  // Arrow controls
  block.querySelector('.announcement-bar__prev').addEventListener('click', carousel.prev);
  block.querySelector('.announcement-bar__next').addEventListener('click', carousel.next);

  // Pause on hover
  block.addEventListener('mouseenter', carousel.pause);
  block.addEventListener('mouseleave', carousel.resume);

  // Keyboard navigation
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') carousel.prev();
    if (e.key === 'ArrowRight') carousel.next();
  });
}
