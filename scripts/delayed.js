/*
 * Jared EDS — Delayed Scripts
 * Runs after page load — analytics, performance monitoring, chat widgets.
 */

/**
 * Initialises analytics / tagging layer.
 * Replace with real analytics snippet in production.
 */
function initAnalytics() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    page_type: document.body.dataset.pageType || 'homepage',
    brand: 'jared',
  });
}

/**
 * Tracks product impressions in the carousels.
 */
function trackCarouselImpressions() {
  const carousels = document.querySelectorAll('.product-carousel');
  if (!carousels.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const products = [...entry.target.querySelectorAll('.product-card')].map((card) => ({
            name: card.querySelector('.product-name')?.textContent,
            price: card.querySelector('.product-price')?.textContent,
          }));
          window.dataLayer?.push({ event: 'view_item_list', items: products });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  carousels.forEach((carousel) => observer.observe(carousel));
}

/**
 * Lazy loads the "Book an Appointment" widget scripts.
 */
function initBookingWidget() {
  // Placeholder — replace with Jared's actual booking widget SDK
  // e.g. Salesforce Scheduler, Locally, or custom solution
}

/**
 * Performance mark — signals delayed load completion to RUM.
 */
function markDelayedLoaded() {
  if (window.performance?.mark) {
    window.performance.mark('jared:delayed-loaded');
  }
}

// Run all delayed initializations
initAnalytics();
trackCarouselImpressions();
initBookingWidget();
markDelayedLoaded();
