/*
 * Hero Block — Jared EDS
 * Full-bleed editorial hero. Image fills viewport. Text bottom-left overlay.
 * Staggered CSS animations handle entrance — JS only assembles DOM.
 */

/**
 * Returns the innerHTML of a cell, trimmed.
 * @param {Element|null} cell
 * @returns {string}
 */
function cellHTML(cell) {
  return cell?.innerHTML?.trim() || '';
}

/**
 * Returns text content of a cell, trimmed.
 * @param {Element|null} cell
 * @returns {string}
 */
function cellText(cell) {
  return cell?.textContent?.trim() || '';
}

/**
 * Builds the gradient overlay element.
 * @returns {HTMLElement}
 */
function buildGradient() {
  const div = document.createElement('div');
  div.className = 'hero__gradient';
  div.setAttribute('aria-hidden', 'true');
  return div;
}

/**
 * Parses block table rows into hero data object.
 *
 * Expected row order (flexible — detects by content type):
 *   [image row]   — contains <picture> or <img>
 *   [eyebrow]     — short text < 80 chars
 *   [headline]    — longer display text / h1
 *   [subtitle]    — descriptive paragraph
 *   [cta row]     — contains <a> elements
 *
 * @param {HTMLElement} block
 * @returns {{ image: Element|null, eyebrow: string, headline: string, subtitle: string, cta1: Object|null, cta2: Object|null }}
 */
function parseBlock(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const data = {
    image:    null,
    eyebrow:  '',
    headline: '',
    subtitle: '',
    cta1:     null,
    cta2:     null,
  };

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const first = cells[0];

    // Image row
    const pic = row.querySelector('picture');
    const img = !pic && row.querySelector('img');
    if (pic || img) {
      data.image = pic || img;
      const imgEl = pic ? pic.querySelector('img') : img;
      if (imgEl) {
        imgEl.setAttribute('loading', 'eager');
        imgEl.setAttribute('fetchpriority', 'high');
        if (!imgEl.alt) imgEl.alt = 'Jared editorial hero jewelry';
      }
      return;
    }

    // CTA row — contains links
    const links = row.querySelectorAll('a');
    if (links.length) {
      if (!data.cta1) data.cta1 = { text: links[0].textContent.trim(), href: links[0].href };
      if (links.length >= 2 && !data.cta2) data.cta2 = { text: links[1].textContent.trim(), href: links[1].href };
      return;
    }

    // Text rows — assign in order
    const text = cellText(first);
    if (!text) return;

    if (!data.eyebrow && text.length < 80) {
      data.eyebrow = text;
    } else if (!data.headline) {
      data.headline = cellHTML(first);
    } else if (!data.subtitle) {
      data.subtitle = cellHTML(first);
    }
  });

  // Fallback Figma content
  if (!data.headline) {
    data.eyebrow  = 'Holiday Gift Guide';
    data.headline = 'Unwrap Joy<br><em>This Season</em>';
    data.subtitle = 'Discover our curated collection of engagement rings, fine jewelry, and gifts — designed for the love that\'s uniquely yours.';
    data.cta1     = { text: 'Shop the Gift Guide', href: '/gifts' };
    data.cta2     = { text: 'Explore Collections', href: '/collections' };
  }

  return data;
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const data = parseBlock(block);
  block.innerHTML = '';

  /* ─ Media ─ */
  if (data.image) {
    const mediaDiv = document.createElement('div');
    mediaDiv.className = 'hero__media';
    mediaDiv.appendChild(data.image);
    block.appendChild(mediaDiv);
  } else {
    block.classList.add('no-image');
  }

  /* ─ Gradient ─ */
  block.appendChild(buildGradient());

  /* ─ Content overlay ─ */
  const content = document.createElement('div');
  content.className = 'hero__content';

  if (data.eyebrow) {
    const eyebrow = document.createElement('span');
    eyebrow.className = 'hero__eyebrow';
    eyebrow.textContent = data.eyebrow;
    content.appendChild(eyebrow);
  }

  const title = document.createElement('h1');
  title.className = 'hero__title';
  title.innerHTML = data.headline;
  content.appendChild(title);

  if (data.subtitle) {
    const subtitle = document.createElement('p');
    subtitle.className = 'hero__subtitle';
    subtitle.innerHTML = data.subtitle;
    content.appendChild(subtitle);
  }

  if (data.cta1 || data.cta2) {
    const ctas = document.createElement('div');
    ctas.className = 'hero__ctas';

    if (data.cta1) {
      const a1 = document.createElement('a');
      a1.href = data.cta1.href;
      a1.className = 'btn btn-primary';
      a1.textContent = data.cta1.text;
      ctas.appendChild(a1);
    }

    if (data.cta2) {
      const a2 = document.createElement('a');
      a2.href = data.cta2.href;
      a2.className = 'btn btn-outline-light';
      a2.textContent = data.cta2.text;
      ctas.appendChild(a2);
    }

    content.appendChild(ctas);
  }

  block.appendChild(content);

  /* ─ Scroll indicator ─ */
  const scroll = document.createElement('div');
  scroll.className = 'hero__scroll';
  scroll.setAttribute('aria-hidden', 'true');
  scroll.textContent = 'Scroll';
  block.appendChild(scroll);
}
