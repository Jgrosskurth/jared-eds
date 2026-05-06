/*
 * Hero Block — Jared EDS
 * Full-bleed editorial hero with lower-left overlay text.
 */

/**
 * Extracts text from a cell, preserving inner HTML for rich content.
 * @param {HTMLElement} cell
 * @returns {string}
 */
function cellHTML(cell) {
  return cell?.innerHTML?.trim() || '';
}

/**
 * Extracts text content from a cell.
 * @param {HTMLElement} cell
 * @returns {string}
 */
function cellText(cell) {
  return cell?.textContent?.trim() || '';
}

/**
 * Builds the hero gradient overlay element.
 * @returns {HTMLElement}
 */
function buildGradient() {
  const div = document.createElement('div');
  div.className = 'hero__gradient';
  div.setAttribute('aria-hidden', 'true');
  return div;
}

/**
 * Parses the block's table structure into hero content.
 * Expected rows:
 *   Row 0: [image]
 *   Row 1: [eyebrow]
 *   Row 2: [headline]
 *   Row 3: [subtitle]
 *   Row 4: [cta1 | cta2]
 *
 * @param {HTMLElement} block
 * @returns {Object}
 */
function parseBlock(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const data = {
    image: null,
    eyebrow: '',
    headline: '',
    subtitle: '',
    cta1: null,
    cta2: null,
  };

  rows.forEach((row, i) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const first = cells[0];
    const second = cells[1];

    // Detect image row
    if (first?.querySelector('img, picture')) {
      data.image = first.querySelector('picture') || first.querySelector('img');
      return;
    }

    switch (i) {
      case 0:
      case 1: {
        const text = cellText(first);
        if (!data.eyebrow && text && text.length < 80) {
          data.eyebrow = text;
        }
        break;
      }
      case 2: {
        data.headline = cellHTML(first) || data.headline;
        break;
      }
      case 3: {
        data.subtitle = cellHTML(first) || data.subtitle;
        break;
      }
      default: {
        // Look for CTA links
        const links = row.querySelectorAll('a');
        if (links.length >= 1 && !data.cta1) {
          data.cta1 = { text: links[0].textContent.trim(), href: links[0].href };
        }
        if (links.length >= 2 && !data.cta2) {
          data.cta2 = { text: links[1].textContent.trim(), href: links[1].href };
        }
      }
    }
  });

  // Fallback content
  if (!data.headline) {
    data.eyebrow = 'Bridal + Engagement';
    data.headline = 'Modern Rings<br>For Every Yes';
    data.subtitle = 'Discover our curated collection of engagement and wedding rings, designed for the love that's uniquely yours.';
    data.cta1 = { text: 'Shop Engagement Rings', href: '/engagement-rings' };
    data.cta2 = { text: 'Explore Collections', href: '/collections' };
  }

  return data;
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const data = parseBlock(block);
  block.innerHTML = '';

  // Media layer
  if (data.image) {
    const mediaDiv = document.createElement('div');
    mediaDiv.className = 'hero__media';
    const img = data.image.tagName === 'IMG' ? data.image : data.image.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'eager'); // LCP image — load immediately
      img.setAttribute('fetchpriority', 'high');
      img.alt = img.alt || 'Jared engagement jewelry editorial';
    }
    mediaDiv.appendChild(data.image);
    block.appendChild(mediaDiv);
  } else {
    block.classList.add('no-image');
  }

  // Gradient
  block.appendChild(buildGradient());

  // Content overlay
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

  // Scroll indicator
  const scroll = document.createElement('div');
  scroll.className = 'hero__scroll';
  scroll.setAttribute('aria-hidden', 'true');
  scroll.textContent = 'Scroll';
  block.appendChild(scroll);
}
