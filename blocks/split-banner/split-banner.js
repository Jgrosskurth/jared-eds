/*
 * Split Banner Block — Jared EDS
 * 50/50 editorial layout. Variants: image-left (default), image-right.
 *
 * Block table structure:
 *   Row 0: [image]
 *   Row 1: [eyebrow]
 *   Row 2: [headline]
 *   Row 3: [body text]
 *   Row 4: [CTA link]
 *
 * Add "image-right" class to the block in the doc to flip layout.
 */

const DEFAULTS = {
  eyebrow: 'Create with Jared',
  title: 'Design the Ring You\'ve Always Imagined',
  body: 'Work one-on-one with our expert jewelers to bring your vision to life. From custom settings to perfectly matched diamond pairings, your dream ring starts here.',
  cta: { text: 'Start Designing', href: '/create-with-jared' },
};

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const data = {
    image: null,
    eyebrow: '',
    title: '',
    body: '',
    cta: null,
  };

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const cell = cells[0] || row;

    // Image detection
    const pic = row.querySelector('picture');
    const img = !pic && row.querySelector('img');
    if (pic || img) {
      data.image = pic || img;
      const imgEl = pic ? pic.querySelector('img') : img;
      if (imgEl) {
        imgEl.setAttribute('loading', 'lazy');
        imgEl.alt = imgEl.alt || 'Jared jewelry editorial';
      }
      return;
    }

    const link = cell.querySelector('a');
    const text = cell.textContent.trim();

    if (link && !data.cta) {
      data.cta = { text: link.textContent.trim(), href: link.href };
      return;
    }

    if (!text) return;

    if (!data.eyebrow && text.length < 60) {
      data.eyebrow = text;
    } else if (!data.title) {
      data.title = cell.innerHTML.trim();
    } else if (!data.body) {
      data.body = cell.innerHTML.trim();
    }
  });

  // Apply defaults
  if (!data.eyebrow) data.eyebrow = DEFAULTS.eyebrow;
  if (!data.title) data.title = DEFAULTS.title;
  if (!data.body) data.body = DEFAULTS.body;
  if (!data.cta) data.cta = DEFAULTS.cta;

  // Preserve variant class (image-right)
  const variant = block.classList.contains('image-right') ? 'image-right' : '';
  block.innerHTML = '';
  if (variant) block.classList.add(variant);

  // Image column
  const imageCol = document.createElement('div');
  imageCol.className = 'split-banner__image';
  if (data.image) {
    imageCol.appendChild(data.image);
  } else {
    imageCol.style.background = 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-border) 100%)';
  }

  // Content column
  const contentCol = document.createElement('div');
  contentCol.className = 'split-banner__content';

  if (data.eyebrow) {
    const eyebrow = document.createElement('span');
    eyebrow.className = 'split-banner__eyebrow';
    eyebrow.textContent = data.eyebrow;
    contentCol.appendChild(eyebrow);
  }

  const accent = document.createElement('div');
  accent.className = 'split-banner__accent';
  accent.setAttribute('aria-hidden', 'true');
  contentCol.appendChild(accent);

  const title = document.createElement('h2');
  title.className = 'split-banner__title';
  title.innerHTML = data.title;
  contentCol.appendChild(title);

  if (data.body) {
    const body = document.createElement('div');
    body.className = 'split-banner__body';
    if (!data.body.includes('<')) {
      const p = document.createElement('p');
      p.textContent = data.body;
      body.appendChild(p);
    } else {
      body.innerHTML = data.body;
    }
    contentCol.appendChild(body);
  }

  if (data.cta) {
    const cta = document.createElement('a');
    cta.href = data.cta.href;
    cta.className = 'split-banner__cta';
    cta.textContent = data.cta.text;
    contentCol.appendChild(cta);
  }

  block.append(imageCol, contentCol);

  // Scroll reveal
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
  observer.observe(block);
}
