/*
 * Product Carousel Block — Jared EDS
 * Horizontal scroll-snap product carousel with arrow navigation.
 * Teal NEW badges, red SALE badges, wishlist heart, smooth scroll.
 *
 * Block table structure:
 *   Row 0: [section title | view-all link]
 *   Row N: [image | product name | price | (original price) | (badge)]
 */

const HEART_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const ARROW_LEFT  = `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>`;
const ARROW_RIGHT = `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;

const DEFAULT_PRODUCTS = [
  {
    name: 'Round Brilliant Solitaire Ring',
    price: '$2,499',
    badge: 'new',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Cushion Halo Diamond Ring',
    price: '$3,299',
    originalPrice: '$3,999',
    badge: 'sale',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Oval Cut Three-Stone Ring',
    price: '$4,199',
    badge: null,
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94815ae?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Princess Cut Solitaire',
    price: '$1,899',
    badge: 'new',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Emerald Cut Halo Ring',
    price: '$5,499',
    badge: null,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Pear Shape Diamond Ring',
    price: '$3,799',
    originalPrice: '$4,500',
    badge: 'sale',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80&auto=format&fit=crop',
  },
];

/**
 * Creates a product card.
 * @param {Object} product
 * @returns {HTMLElement}
 */
function createCard(product) {
  const card = document.createElement('a');
  card.className = 'product-card';
  card.href = product.href || '#';
  card.setAttribute('aria-label', product.name);

  /* ─ Image ─ */
  const imageWrap = document.createElement('div');
  imageWrap.className = 'product-card__image-wrap';

  if (product.imagePicture) {
    const img = product.imagePicture.querySelector('img');
    if (img) {
      if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
      if (!img.alt) img.alt = product.name;
    }
    imageWrap.appendChild(product.imagePicture);
  } else if (product.image) {
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.loading = 'lazy';
    imageWrap.appendChild(img);
  }

  /* ─ Badge ─ */
  if (product.badge) {
    const badge = document.createElement('span');
    badge.className = `product-card__badge product-card__badge--${product.badge}`;
    badge.textContent = product.badge === 'new'       ? 'New'
                      : product.badge === 'sale'      ? 'Sale'
                      : product.badge === 'exclusive' ? 'Exclusive'
                      : product.badge;
    imageWrap.appendChild(badge);
  }

  /* ─ Wishlist ─ */
  const wishlistBtn = document.createElement('button');
  wishlistBtn.className = 'product-card__wishlist';
  wishlistBtn.setAttribute('aria-label', `Add ${product.name} to wishlist`);
  wishlistBtn.innerHTML = HEART_SVG;
  wishlistBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isActive = wishlistBtn.classList.toggle('active');
    wishlistBtn.setAttribute(
      'aria-label',
      isActive ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
    );
  });
  imageWrap.appendChild(wishlistBtn);

  card.appendChild(imageWrap);

  /* ─ Info ─ */
  const info = document.createElement('div');
  info.className = 'product-card__info';

  const name = document.createElement('p');
  name.className = 'product-card__name';
  name.textContent = product.name;

  const priceRow = document.createElement('div');
  priceRow.className = 'product-card__price-row';

  const price = document.createElement('span');
  price.className = `product-card__price${product.originalPrice ? ' product-card__price-sale' : ''}`;
  price.textContent = product.price;
  priceRow.appendChild(price);

  if (product.originalPrice) {
    const orig = document.createElement('span');
    orig.className = 'product-card__price-original';
    orig.textContent = product.originalPrice;
    priceRow.appendChild(orig);
  }

  info.append(name, priceRow);
  card.appendChild(info);

  return card;
}

/**
 * Parses block table rows into header + products.
 * @param {HTMLElement} block
 * @returns {{ title: string, viewAllHref: string, products: Object[] }}
 */
function parseBlock(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  let title = 'New Arrivals';
  let viewAllHref = '/new-arrivals';
  const products = [];

  rows.forEach((row, idx) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    // Header row — no image
    if (idx === 0 && !row.querySelector('img, picture')) {
      title = cells[0]?.textContent.trim() || title;
      const link = cells[1]?.querySelector('a') || cells[0]?.querySelector('a');
      if (link) {
        if (cells.length > 1) {
          viewAllHref = link.href;
        } else {
          title = link.textContent.trim() || title;
          viewAllHref = link.href;
        }
      }
      return;
    }

    const imagePicture = row.querySelector('picture') || null;
    const textCells = cells.filter((c) => !c.querySelector('img, picture'));

    // Extract prices
    const allText = textCells.map((c) => c.textContent.trim()).join(' ');
    const priceMatches = allText.match(/\$[\d,]+/g);

    // Badge detection
    const badgeText = textCells.find((c) =>
      /\b(new|sale|exclusive)\b/i.test(c.textContent)
    )?.textContent.trim().toLowerCase();
    const badge = badgeText?.match(/\b(new|sale|exclusive)\b/i)?.[1]?.toLowerCase() || null;

    products.push({
      imagePicture: imagePicture || null,
      name:          textCells[0]?.textContent.trim() || `Product ${idx}`,
      price:         priceMatches?.[0] || '$0',
      originalPrice: priceMatches?.[1] || null,
      badge,
      href:          row.querySelector('a')?.href || '#',
    });
  });

  return {
    title,
    viewAllHref,
    products: products.length ? products : DEFAULT_PRODUCTS,
  };
}

/**
 * Sets up prev/next arrow controls.
 * @param {HTMLElement} track
 * @param {HTMLElement} prevBtn
 * @param {HTMLElement} nextBtn
 */
function setupArrows(track, prevBtn, nextBtn) {
  function cardWidth() {
    const card = track.querySelector('.product-card');
    if (!card) return 280;
    return card.offsetWidth + parseInt(getComputedStyle(track).gap, 10);
  }

  function updateState() {
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  }

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -(cardWidth() * 2), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: cardWidth() * 2, behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateState, { passive: true });
  // Also update after layout settles
  requestAnimationFrame(updateState);
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const { title, viewAllHref, products } = parseBlock(block);
  block.innerHTML = '';

  /* ─ Header ─ */
  const header = document.createElement('div');
  header.className = 'product-carousel__header';

  const h2 = document.createElement('h2');
  h2.className = 'product-carousel__title';
  h2.textContent = title;

  const viewAll = document.createElement('a');
  viewAll.href = viewAllHref;
  viewAll.className = 'product-carousel__view-all';
  viewAll.textContent = 'View All';

  header.append(h2, viewAll);
  block.appendChild(header);

  /* ─ Track ─ */
  const container = document.createElement('div');
  container.className = 'product-carousel__container';

  const track = document.createElement('div');
  track.className = 'product-carousel__track';
  track.setAttribute('role', 'list');
  track.setAttribute('aria-label', `${title} products`);

  products.forEach((product) => {
    const card = createCard(product);
    card.setAttribute('role', 'listitem');
    track.appendChild(card);
  });

  container.appendChild(track);
  block.appendChild(container);

  /* ─ Arrows ─ */
  const arrows = document.createElement('div');
  arrows.className = 'product-carousel__arrows';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'product-carousel__arrow';
  prevBtn.setAttribute('aria-label', 'Previous products');
  prevBtn.innerHTML = ARROW_LEFT;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'product-carousel__arrow';
  nextBtn.setAttribute('aria-label', 'Next products');
  nextBtn.innerHTML = ARROW_RIGHT;

  arrows.append(prevBtn, nextBtn);
  block.appendChild(arrows);

  setupArrows(track, prevBtn, nextBtn);
}
