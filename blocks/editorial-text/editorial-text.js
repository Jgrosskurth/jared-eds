/*
 * Editorial Text Block — Jared EDS
 * Centered editorial copy section on lavender background.
 *
 * Block table structure:
 *   Row 0: [eyebrow label]
 *   Row 1: [headline]
 *   Row 2: [body text]
 *   Row 3: [CTA link]
 */

const DEFAULTS = {
  eyebrow: 'The Jared Promise',
  title: 'Crafted for Your Most Precious Moments',
  body: 'At Jared, every piece tells a story. From the first diamond to the last detail, we create jewelry that honors life\'s most meaningful milestones.',
  cta: { text: 'Learn About Jared', href: '/about' },
};

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const data = {
    eyebrow: '',
    title: '',
    body: '',
    cta: null,
  };

  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
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

  // Apply fallbacks
  if (!data.eyebrow) data.eyebrow = DEFAULTS.eyebrow;
  if (!data.title) data.title = DEFAULTS.title;
  if (!data.body) data.body = DEFAULTS.body;
  if (!data.cta) data.cta = DEFAULTS.cta;

  block.innerHTML = '';

  if (data.eyebrow) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'editorial-text__eyebrow';
    eyebrow.textContent = data.eyebrow;
    block.appendChild(eyebrow);
  }

  if (data.title) {
    const title = document.createElement('h2');
    title.className = 'editorial-text__title';
    title.innerHTML = data.title;
    block.appendChild(title);
  }

  if (data.body) {
    const body = document.createElement('div');
    body.className = 'editorial-text__body';
    if (!data.body.includes('<')) {
      const p = document.createElement('p');
      p.textContent = data.body;
      body.appendChild(p);
    } else {
      body.innerHTML = data.body;
    }
    block.appendChild(body);
  }

  if (data.cta) {
    const cta = document.createElement('a');
    cta.href = data.cta.href;
    cta.className = 'editorial-text__cta';
    cta.textContent = data.cta.text;
    block.appendChild(cta);
  }

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
    { threshold: 0.2 }
  );
  observer.observe(block);
}
