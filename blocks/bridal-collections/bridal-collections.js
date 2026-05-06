/*
 * Bridal Collections Block — Jared EDS
 * 4-up curated collection grid with hover overlays and stagger reveal.
 *
 * Block table structure (each row = one collection card):
 *   Row 0: [heading | view-all link]
 *   Row 1: [image | collection name | description | link]
 *   Row 2: [image | collection name | description | link]
 *   ...
 */

const DEFAULT_COLLECTIONS = [
  {
    name: 'Solitaire Rings',
    desc: 'Classic brilliance. A single diamond, perfectly set.',
    href: '/collections/solitaire',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
  },
  {
    name: 'Halo Collection',
    desc: 'Brilliant center stones encircled by a luminous halo.',
    href: '/collections/halo',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
  },
  {
    name: 'Three-Stone Rings',
    desc: 'Past, present, and future — told in three stones.',
    href: '/collections/three-stone',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80',
  },
  {
    name: 'Vintage Inspired',
    desc: 'Intricate milgrain details and antique-inspired settings.',
    href: '/collections/vintage',
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80',
  },
];

/**
 * Creates a collection card element.
 * @param {Object} collection
 * @returns {HTMLElement}
 */
function createCard(collection) {
  const card = document.createElement('a');
  card.href = collection.href;
  card.className = 'collection-card';
  card.setAttribute('aria-label', `Shop ${collection.name}`);

  // Image wrap
  const imageWrap = document.createElement('div');
  imageWrap.className = 'collection-card__image-wrap';

  if (collection.imagePicture) {
    imageWrap.appendChild(collection.imagePicture);
  } else if (collection.image) {
    const img = document.createElement('img');
    img.src = collection.image;
    img.alt = collection.name;
    img.loading = 'lazy';
    img.width = 600;
    img.height = 800;
    imageWrap.appendChild(img);
  } else {
    // Lavender placeholder
    imageWrap.style.background = 'var(--color-bg)';
  }

  // Hover overlay
  const overlay = document.createElement('div');
  overlay.className = 'collection-card__overlay';
  overlay.setAttribute('aria-hidden', 'true');
  const overlayCta = document.createElement('span');
  overlayCta.className = 'collection-card__overlay-cta';
  overlayCta.textContent = 'Shop Now';
  overlay.appendChild(overlayCta);
  imageWrap.appendChild(overlay);

  card.appendChild(imageWrap);

  // Body
  const body = document.createElement('div');
  body.className = 'collection-card__body';

  const name = document.createElement('p');
  name.className = 'collection-card__name';
  name.textContent = collection.name;

  const desc = document.createElement('p');
  desc.className = 'collection-card__desc';
  desc.textContent = collection.desc;

  body.append(name, desc);
  card.appendChild(body);

  return card;
}

/**
 * Parses the block table into section title and collection data.
 * @param {HTMLElement} block
 * @returns {{ title: string, viewAllHref: string, collections: Object[] }}
 */
function parseBlock(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  let title = 'Bridal Collections';
  let viewAllHref = '/collections';
  const collections = [];

  rows.forEach((row, idx) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    if (idx === 0 && !row.querySelector('img')) {
      // Header row
      title = cells[0]?.textContent.trim() || title;
      const link = cells[1]?.querySelector('a');
      if (link) viewAllHref = link.href;
      return;
    }

    // Card row
    const imagePicture = row.querySelector('picture') || null;
    const imageImg = !imagePicture ? row.querySelector('img') : null;
    const textCells = cells.filter((c) => !c.querySelector('img') && !c.querySelector('picture'));
    const link = row.querySelector('a');

    const collection = {
      imagePicture,
      image: imageImg?.src || null,
      name: textCells[0]?.textContent.trim() || `Collection ${idx}`,
      desc: textCells[1]?.textContent.trim() || '',
      href: link?.href || '#',
    };

    if (imagePicture) {
      const img = imagePicture.querySelector('img');
      if (img) {
        img.loading = 'lazy';
        img.alt = img.alt || collection.name;
      }
    }

    collections.push(collection);
  });

  return { title, viewAllHref, collections: collections.length ? collections : DEFAULT_COLLECTIONS };
}

/**
 * Observe cards and stagger their reveal.
 * @param {HTMLElement[]} cards
 */
function observeCards(cards) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  cards.forEach((card) => observer.observe(card));
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const { title, viewAllHref, collections } = parseBlock(block);
  block.innerHTML = '';

  // Section header
  const header = document.createElement('div');
  header.className = 'bridal-collections__header';

  const h2 = document.createElement('h2');
  h2.className = 'bridal-collections__title';
  h2.textContent = title;

  const viewAll = document.createElement('a');
  viewAll.href = viewAllHref;
  viewAll.className = 'bridal-collections__view-all';
  viewAll.textContent = 'View All';

  header.append(h2, viewAll);
  block.appendChild(header);

  // Grid
  const grid = document.createElement('div');
  grid.className = 'bridal-collections__grid';

  const cards = collections.map(createCard);
  cards.forEach((card) => grid.appendChild(card));
  block.appendChild(grid);

  // Stagger reveal on scroll
  observeCards(cards);
}
