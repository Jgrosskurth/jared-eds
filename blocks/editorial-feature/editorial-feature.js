/*
 * Editorial Feature Block — Jared EDS
 * Jared's signature aspirational section.
 * Large centered editorial copy on lavender background.
 *
 * Block table structure:
 *   Row 0: [image(s)]  — one or two images
 *   Row 1: [category label]
 *   Row 2: [large editorial body paragraph]
 *   Row 3: [CTA link]
 */

const DEFAULTS = {
  label: 'Bridal + Engagement',
  headline: '',
  body: 'Every love story deserves a ring that feels personal. Our modern engagement styles balance intentional design with effortless individuality.',
  cta: { text: 'Shop Engagement Rings', href: '/engagement-rings' },
};

/**
 * Observes an element and adds .visible when it enters the viewport.
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
    { threshold: 0.15 }
  );
  observer.observe(el);
}

/**
 * Parses block rows into structured content.
 * @param {HTMLElement} block
 * @returns {Object}
 */
function parseBlock(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const data = {
    images: [],
    label: '',
    headline: '',
    body: '',
    cta: null,
  };

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    // Check for images
    const imgs = row.querySelectorAll('img, picture');
    if (imgs.length) {
      imgs.forEach((img) => data.images.push(img));
      return;
    }

    // Text cells
    cells.forEach((cell) => {
      const links = cell.querySelectorAll('a');
      const text = cell.textContent.trim();

      if (links.length && !data.cta) {
        // This row is a CTA
        data.cta = {
          text: links[0].textContent.trim(),
          href: links[0].href,
        };
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

  // Apply defaults for any missing fields
  if (!data.label) data.label = DEFAULTS.label;
  if (!data.body) data.body = DEFAULTS.body;
  if (!data.cta) data.cta = DEFAULTS.cta;

  return data;
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const data = parseBlock(block);
  block.innerHTML = '';

  // Image zone
  if (data.images.length) {
    if (data.images.length >= 2) {
      const grid = document.createElement('div');
      grid.className = 'editorial-feature__image-grid';
      // Ensure images are in picture elements
      data.images.slice(0, 2).forEach((img) => {
        const el = img.tagName === 'PICTURE' ? img : img.closest('picture') || img;
        const imgEl = el.tagName === 'PICTURE' ? el.querySelector('img') : el;
        if (imgEl) {
          imgEl.setAttribute('loading', 'lazy');
          imgEl.alt = imgEl.alt || 'Jared engagement jewelry';
        }
        grid.appendChild(el);
      });
      block.appendChild(grid);
    } else {
      const imageZone = document.createElement('div');
      imageZone.className = 'editorial-feature__image-zone';
      const img = data.images[0];
      const el = img.tagName === 'PICTURE' ? img : img.closest('picture') || img;
      const imgEl = el.tagName === 'PICTURE' ? el.querySelector('img') : el;
      if (imgEl) {
        imgEl.setAttribute('loading', 'lazy');
        imgEl.alt = imgEl.alt || 'Jared engagement jewelry editorial';
      }
      imageZone.appendChild(el);
      block.appendChild(imageZone);
    }
  }

  // Content zone
  const contentZone = document.createElement('div');
  contentZone.className = 'editorial-feature__content';

  const inner = document.createElement('div');
  inner.className = 'editorial-feature__content-inner';

  // Category label
  const label = document.createElement('p');
  label.className = 'editorial-feature__label';
  label.textContent = data.label;
  inner.appendChild(label);

  // Divider
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
  // If body is plain text (no HTML tags), wrap in p
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

  // Animate on scroll
  observeReveal(inner);
}
