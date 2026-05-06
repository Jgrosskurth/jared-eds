/*
 * Category Nav Block — Jared EDS
 * Shop by category — circular image tiles, 6-up on desktop.
 *
 * Block table structure:
 *   Row 0: [section title]
 *   Row N: [image | label | link href]
 */

const DEFAULT_CATEGORIES = [
  { label: 'Engagement Rings', href: '/engagement-rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=80' },
  { label: 'Wedding Bands', href: '/wedding-bands', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&q=80' },
  { label: 'Necklaces', href: '/necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80' },
  { label: 'Earrings', href: '/earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&q=80' },
  { label: 'Bracelets', href: '/bracelets', image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=300&q=80' },
  { label: 'Diamonds', href: '/diamonds', image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=300&q=80' },
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
      img.loading = 'lazy';
      img.alt = cat.label;
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
  let title = 'Shop by Style';
  const categories = [];

  rows.forEach((row, idx) => {
    if (idx === 0 && !row.querySelector('img') && !row.querySelector('picture')) {
      title = row.textContent.trim() || title;
      return;
    }

    const imagePicture = row.querySelector('picture');
    const cells = [...row.querySelectorAll(':scope > div')];
    const textCells = cells.filter((c) => !c.querySelector('img') && !c.querySelector('picture'));
    const link = row.querySelector('a');

    categories.push({
      imagePicture: imagePicture || null,
      label: textCells[0]?.textContent.trim() || link?.textContent.trim() || `Category ${idx}`,
      href: link?.href || '#',
    });
  });

  const finalCategories = categories.length ? categories : DEFAULT_CATEGORIES;

  block.innerHTML = '';

  // Header
  const header = document.createElement('div');
  header.className = 'category-nav__header';

  const h2 = document.createElement('h2');
  h2.className = 'category-nav__title';
  h2.textContent = title;

  header.appendChild(h2);
  block.appendChild(header);

  // Grid
  const grid = document.createElement('div');
  grid.className = 'category-nav__grid';
  grid.setAttribute('role', 'list');

  const tiles = finalCategories.map(createTile);
  tiles.forEach((tile) => {
    tile.setAttribute('role', 'listitem');
    grid.appendChild(tile);
  });

  block.appendChild(grid);

  // Stagger reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tiles.forEach((tile) => tile.classList.add('visible'));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(grid);
}
