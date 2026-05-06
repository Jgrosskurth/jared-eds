/*
 * Product Carousel Block — Jared EDS
 * Horizontal scroll-snap product carousel with arrow navigation.
 *
 * Block table structure:
 *   Row 0: [section title | view-all link]
 *   Row N: [image | product name | price | (original price) | (badge)]
 */

const HEART_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

const ARROW_LEFT = `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>`;
const ARROW_RIGHT = `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;

const DEFAULT_PRODUCTS = [
  { name: 'Round Brilliant Solitaire Ring', price: '$2,499', badge: 'new', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80' },
  { name: 'Cushion Halo Diamond Ring', price: '$3,299', originalPrice: '$3,999', badge: 'sale', image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80' },
  { name: 'Oval Cut Three-Stone Ring', price: '$4,199', image: 'https://images.unsplash.com/photo-1608050072142-61d97c8da16b?w=400&q=80' },
  { name: 'Princess Cut Solitaire', price: '$1,899', badge: 'new', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80' },
  { name: 'Emerald Cut Halo Ring', price: '$5,499', image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=400&q=80' },
  { name: 'Pear Shape Diamond Ring', price: '$3,799', originalPrice: '$4,500', badge: 'sale', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80' },
];

/**
 * Creates a single product card element.
 * @param {Object} product
 * @returns {HTMLElement}
 */
function createCard(product) {
  const card = document.createElement('a');
  card.className = 'product-card';
  card.href = product.href || '#';
  card.setAttribute('aria-label', product.name);

  // Image wrap
  const imageWrap = document.createElement('div');
  imageWrap.className = 'product-card__image-wrap';

  if (product.imagePicture) {
    const img = product.imagePicture.querySelector('img');
    if (img) {
      img.loading = 'lazy';
      img.alt = img.alt || product.name;
    }
    imageWrap.appendChild(product.imagePicture);
  } else if (product.image) {
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.loading = 'lazy';
    img.width = 400;
    img.height = 400;
    imageWrap.appendChild(img);
  }

  // Badge
  if (product.badge) {
    const badge = document.createElement('span');
    badge.className = `product-card__badge product-card__badge--${product.badge}`;
    badge.textContent = product.badge === 'new' ? 'New' : 'Sale';
    imageWrap.appendChild(badge);
  }

  // Wishlist button
  const wishlistBtn = document.createElement('button');
  wishlistBtn.className = 'product-card__wishlist';
  wishlistBtn.setAttribute('aria-label', `Add ${product.name} to wishlist`);
  wishlistBtn.innerHTML = HEART_SVG;
  wishlistBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    wishlistBtn.classList.toggle('active');
    wishlistBtn.setAttribute(
      'aria-label',
      wishlistBtn.classList.contains('active')
        ? `Remove ${product.name} from wishlist`
        : `Add ${product.name} to wishlist`
    );
  });
  imageWrap.appendChild(wishlistBtn);

  card.appendChild(imageWrap);

  // Info
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
    const original = document.createElement('span');
    original.className = 'product-card__price-original';
    original.textContent = product.originalPrice;
    priceRow.appendChild(original);
  }

  info.append(name, priceRow);
  card.appendChild(info);

  return card;
}

/**
 * Parses block table rows into header + product data.
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

    if (idx === 0 && !row.querySelector('img')) {
      title = cells[0]?.textContent.trim() || title;
      const link = cells[1]?.querySelector('a') || cells[0]?.querySelector('a');
      if (link) {
        if (cells[1]) {
          viewAllHref = link.href;
        } else {
          title = link.textContent.trim() || title;
          viewAllHref = link.href;
        }
      }
      return;
    }

    const imagePicture = row.querySelector('picture');
    const textCells = cells.filter((c) => !c.querySelector('img') && !c.querySelector('picture'));

    const priceText = textCells.find((c) => /\$[\d,]+/.test(c.textContent))?.textContent.trim();
    const priceMatches = priceText?.match(/\$([\d,]+)/g);

    products.push({
      imagePicture: imagePicture || null,
      name: textCells[0]?.textContent.trim() || `Product ${idx}`,
      price: priceMatches?.[0] || '$0',
      originalPrice: priceMatches?.[1] || null,
      badge: null,
      href: row.querySelector('a')?.href || '#',
    });
  });

  return {
    title,
    viewAllHref,
    products: products.length ? products : DEFAULT_PRODUCTS,
  };
}

/**
 * Sets up arrow navigation for the track.
 * @param {HTMLElement} track
 * @param {HTMLElement} prevBtn
 * @param {HTMLElement} nextBtn
 */
function setupArrows(track, prevBtn, nextBtn) {
  const cardWidth = () => track.querySelector('.product-card')?.offsetWidth + 16 || 300;

  function updateArrows() {
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  }

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -cardWidth() * 2, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: cardWidth() * 2, behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateArrows, { passive: true });
  updateArrows();
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const { title, viewAllHref, products } = parseBlock(block);
  block.innerHTML = '';

  // Section header
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

  // Container
  const container = document.createElement('div');
  container.className = 'product-carousel__container';

  // Track
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

  // Arrow controls
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
