/*
 * Category Nav Block — Jared EDS
 * Shop by category — circular image tiles, label below.
 * 6-up desktop. Stagger reveal via IntersectionObserver.
 *
 * Block table structure:
 *   Row 0: [section title]
 *   Row N: [image | label | (link href)]
 */

const DEFAULT_CATEGORIES = [
  { label: 'Engagement Rings',  href: '/engagement-rings' },
  { label: 'Wedding Bands',     href: '/wedding-bands' },
  { label: 'Necklaces',         href: '/necklaces' },
  { label: 'Earrings',          href: '/earrings' },
  { label: 'Bracelets',         href: '/bracelets' },
  { label: 'Diamonds',          href: '/diamonds' },
];

/**
 * Creates a single category tile.
 * @param {Object} cat
 * @returns {HTMLElement}
 */
function createTile(cat) {
  const tile = document.createElement('a');
  tile.href = cat.href;
  tile.className = 'category-tile';
  tile.setAttribute('aria-label', `Shop ${cat.label}`);

  const imageWrap = document.createElement('div');
  imageWrap.className = 'category-tile__image-wrap';

  if (cat.imagePicture) {
    const img = cat.imagePicture.querySelector('img');
    if (img) {
      if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
      if (!img.alt) img.alt = cat.label;
    }
    imageWrap.appendChild(cat.imagePicture);
  } else if (cat.image) {
    const img = document.createElement('img');
    img.src = cat.image;
    img.alt = cat.label;
    img.loading = 'lazy';
    img.width = 300;
    img.height = 300;
    imageWrap.appendChild(img);
  }

  const label = document.createElement('span');
  label.className = 'category-tile__label';
  label.textContent = cat.label;

  tile.append(imageWrap, label);
  return tile;
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  let title = 'Shop by Category';
  const categories = [];

  rows.forEach((row, idx) => {
    // Header row — no image
    if (idx === 0 && !row.querySelector('img, picture')) {
      title = row.textContent.trim() || title;
      return;
    }

    const imagePicture = row.querySelector('picture') || null;
    const cells = [...row.querySelectorAll(':scope > div')];
    const textCells = cells.filter((c) => !c.querySelector('img, picture'));
    const link = row.querySelector('a');

    categories.push({
      imagePicture: imagePicture || null,
      image:        null,
      label:        textCells[0]?.textContent.trim() || link?.textContent.trim() || `Category ${idx}`,
      href:         link?.href || '#',
    });
  });

  const finalCategories = categories.length ? categories : DEFAULT_CATEGORIES;

  block.innerHTML = '';

  /* ─ Header ─ */
  const header = document.createElement('div');
  header.className = 'category-nav__header';

  const h2 = document.createElement('h2');
  h2.className = 'category-nav__title';
  h2.textContent = title;

  header.appendChild(h2);
  block.appendChild(header);

  /* ─ Grid ─ */
  const grid = document.createElement('div');
  grid.className = 'category-nav__grid';
  grid.setAttribute('role', 'list');

  const tiles = finalCategories.map(createTile);
  tiles.forEach((tile) => {
    tile.setAttribute('role', 'listitem');
    grid.appendChild(tile);
  });

  block.appendChild(grid);

  /* ─ Stagger reveal ─ */
  // Observe each tile individually so CSS nth-child delay works correctly
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  tiles.forEach((tile) => observer.observe(tile));
}
