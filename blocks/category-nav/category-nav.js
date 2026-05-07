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
  {
    label: 'Engagement Rings',
    href: '/engagement-rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80&auto=format&fit=crop',
  },
  {
    label: 'Wedding Bands',
    href: '/wedding-bands',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80&auto=format&fit=crop',
  },
  {
    label: 'Necklaces',
    href: '/necklaces',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80&auto=format&fit=crop',
  },
  {
    label: 'Earrings',
    href: '/earrings',
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&q=80&auto=format&fit=crop',
  },
  {
    label: 'Bracelets',
    href: '/bracelets',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80&auto=format&fit=crop',
  },
  {
    label: 'Diamonds',
    href: '/diamonds',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80&auto=format&fit=crop',
  },
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

  tiles.forEach((tile) => observer.observe(tile));
}
