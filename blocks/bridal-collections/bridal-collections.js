/*
 * Bridal Collections Block — Jared EDS
 * 4-up collection card grid with staggered IntersectionObserver reveal.
 * Gold border + overlay CTA on hover — Jared design language.
 *
 * Block table structure (each row = one collection card):
 *   Row 0: [heading | view-all link]
 *   Row N: [image | collection name | description | link]
 */

const DEFAULT_COLLECTIONS = [
  {
    name: 'Solitaire Rings',
    desc: 'Classic brilliance. A single diamond, perfectly set.',
    href: '/collections/solitaire',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80&auto=format&fit=crop',
  },
  {
    name: 'Halo Collection',
    desc: 'Brilliant center stones encircled by a luminous halo.',
    href: '/collections/halo',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80&auto=format&fit=crop',
  },
  {
    name: 'Three-Stone Rings',
    desc: 'Past, present, and future — told in three stones.',
    href: '/collections/three-stone',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80&auto=format&fit=crop',
  },
  {
    name: 'Vintage Inspired',
    desc: 'Intricate milgrain details and antique-inspired settings.',
    href: '/collections/vintage',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80&auto=format&fit=crop',
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

  /* ─ Image wrap ─ */
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
  }

  /* ─ Hover overlay ─ */
  const overlay = document.createElement('div');
  overlay.className = 'collection-card__overlay';
  overlay.setAttribute('aria-hidden', 'true');
  const overlayCta = document.createElement('span');
  overlayCta.className = 'collection-card__overlay-cta';
  overlayCta.textContent = 'Shop Now';
  overlay.appendChild(overlayCta);
  imageWrap.appendChild(overlay);

  card.appendChild(imageWrap);

  /* ─ Card body ─ */
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
 * Parses block table rows into section header + collection data.
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

    // Header row — no image
    if (idx === 0 && !row.querySelector('img, picture')) {
      title = cells[0]?.textContent.trim() || title;
      const link = cells[1]?.querySelector('a');
      if (link) viewAllHref = link.href;
      return;
    }

    // Card row
    const imagePicture = row.querySelector('picture') || null;
    const imageImg     = !imagePicture ? row.querySelector('img') : null;
    const textCells    = cells.filter((c) => !c.querySelector('img, picture'));
    const link         = row.querySelector('a');

    if (imagePicture) {
      const img = imagePicture.querySelector('img');
      if (img) {
        if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
        if (!img.alt) img.alt = textCells[0]?.textContent.trim() || 'Jared collection';
      }
    }

    collections.push({
      imagePicture,
      image: imageImg?.src || null,
      name:  textCells[0]?.textContent.trim() || `Collection ${idx}`,
      desc:  textCells[1]?.textContent.trim() || '',
      href:  link?.href || '#',
    });
  });

  const hasImages = collections.some((c) => c.imagePicture || c.image);
  return {
    title,
    viewAllHref,
    collections: (collections.length && hasImages) ? collections : DEFAULT_COLLECTIONS,
  };
}

/**
 * Stagger-reveals cards via IntersectionObserver.
 * Each card gets .visible after the container crosses the threshold.
 * CSS transition-delay handles the 80ms stagger per nth-child.
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
    { threshold: 0.05, rootMargin: '9999px 0px 9999px 0px' }
  );
  cards.forEach((card) => observer.observe(card));
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const { title, viewAllHref, collections } = parseBlock(block);
  block.innerHTML = '';

  /* ─ Section header ─ */
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

  /* ─ Grid ─ */
  const grid = document.createElement('div');
  grid.className = 'bridal-collections__grid';

  const cards = collections.map(createCard);
  cards.forEach((card) => grid.appendChild(card));
  block.appendChild(grid);

  observeCards(cards);
}
