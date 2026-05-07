/*
 * Editorial Feature Block — Jared EDS
 * Large centered serif editorial copy on warm section background.
 * Scroll-triggered scale+fade reveal (0.98 → 1.0).
 *
 * Block table structure:
 *   Row 0: [image(s)]       — one or two images
 *   Row 1: [category label] — short text
 *   Row 2: [editorial body] — large paragraph (required)
 *   Row 3: [CTA link]
 */

const DEFAULTS = {
  label: 'Bridal & Engagement',
  body: 'Every love story deserves a ring that feels personal. Our modern engagement styles balance intentional design with effortless individuality.',
  cta: { text: 'Shop Engagement Rings', href: '/engagement-rings' },
};

/**
 * Attaches an IntersectionObserver that adds .visible once the element
 * enters the viewport. Triggers the CSS scale+fade transition.
 * @param {HTMLElement} el
 */
function observeReveal(el) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '300px 0px 300px 0px' }
  );
  observer.observe(el);
}

/**
 * Parses block rows into structured content.
 * @param {HTMLElement} block
 * @returns {{ images: Element[], label: string, headline: string, body: string, cta: Object|null }}
 */
function parseBlock(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const data = {
    images:   [],
    label:    '',
    headline: '',
    body:     '',
    cta:      null,
  };

  rows.forEach((row) => {
    // Image row
    const imgs = [...row.querySelectorAll('picture, img:not(picture img)')];
    if (imgs.length) {
      imgs.forEach((img) => {
        const el = img.tagName === 'PICTURE' ? img : (img.closest('picture') || img);
        const imgEl = el.tagName === 'PICTURE' ? el.querySelector('img') : el;
        if (imgEl) {
          if (!imgEl.getAttribute('loading')) imgEl.setAttribute('loading', 'lazy');
          if (!imgEl.alt) imgEl.alt = 'Jared engagement jewelry editorial';
        }
        data.images.push(el);
      });
      return;
    }

    // CTA row
    const cells = [...row.querySelectorAll(':scope > div')];
    cells.forEach((cell) => {
      const links = cell.querySelectorAll('a');
      const text  = cell.textContent.trim();

      if (links.length && !data.cta) {
        data.cta = { text: links[0].textContent.trim(), href: links[0].href };
        return;
      }

      if (!text) return;

      if (!data.label && text.length < 60) {
        data.label = text;
      } else if (!data.body) {
        data.body = cell.innerHTML.trim();
      } else if (!data.headline) {
        data.headline = cell.innerHTML.trim();
      }
    });
  });

  // Defaults
  if (!data.label) data.label = DEFAULTS.label;
  if (!data.body)  data.body  = DEFAULTS.body;
  if (!data.cta)   data.cta   = DEFAULTS.cta;

  return data;
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const data = parseBlock(block);
  block.innerHTML = '';

  /* ─ Images ─ */
  if (data.images.length >= 2) {
    const grid = document.createElement('div');
    grid.className = 'editorial-feature__image-grid';
    data.images.slice(0, 2).forEach((el) => grid.appendChild(el));
    block.appendChild(grid);
  } else if (data.images.length === 1) {
    const zone = document.createElement('div');
    zone.className = 'editorial-feature__image-zone';
    zone.appendChild(data.images[0]);
    block.appendChild(zone);
  }

  /* ─ Content ─ */
  const contentZone = document.createElement('div');
  contentZone.className = 'editorial-feature__content';

  const inner = document.createElement('div');
  inner.className = 'editorial-feature__content-inner';

  // Category label
  const label = document.createElement('p');
  label.className = 'editorial-feature__label';
  label.textContent = data.label;
  inner.appendChild(label);

  // Decorative divider
  const divider = document.createElement('div');
  divider.className = 'editorial-feature__divider';
  divider.setAttribute('aria-hidden', 'true');
  inner.appendChild(divider);

  // Optional headline
  if (data.headline) {
    const headline = document.createElement('h2');
    headline.className = 'editorial-feature__headline';
    headline.innerHTML = data.headline;
    inner.appendChild(headline);
  }

  // Body — the key editorial paragraph
  const body = document.createElement('div');
  body.className = 'editorial-feature__body';
  if (!data.body.includes('<')) {
    const p = document.createElement('p');
    p.textContent = data.body;
    body.appendChild(p);
  } else {
    body.innerHTML = data.body;
  }
  inner.appendChild(body);

  // CTA
  if (data.cta) {
    const cta = document.createElement('a');
    cta.href = data.cta.href;
    cta.className = 'editorial-feature__cta';
    cta.textContent = data.cta.text;
    inner.appendChild(cta);
  }

  contentZone.appendChild(inner);
  block.appendChild(contentZone);

  // Trigger scroll reveal
  observeReveal(inner);
}
