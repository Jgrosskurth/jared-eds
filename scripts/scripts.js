/*
 * Jared EDS — Main Scripts Entry Point
 */

import {
  loadCSS,
  decorateBlocks,
  decorateSections,
  loadBlocks,
  loadBlock,
  getMetadata,
} from './aem.js';

const LCP_BLOCKS = ['hero', 'announcement-bar'];

/**
 * Decorates pictures with a wrapper and lazy-loading.
 * @param {HTMLElement} main
 */
function decoratePictures(main) {
  main.querySelectorAll('img').forEach((img) => {
    if (!img.closest('.hero')) {
      img.setAttribute('loading', 'lazy');
    }
  });
}

/**
 * Decorates links — adds external target for offsite links.
 * @param {HTMLElement} main
 */
function decorateLinks(main) {
  main.querySelectorAll('a[href]').forEach((a) => {
    try {
      const url = new URL(a.href);
      if (url.hostname && url.hostname !== window.location.hostname) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
    } catch {
      // relative URL, skip
    }
  });
}

/**
 * Wraps buttons and links that are standalone in p tags with button classes.
 * @param {HTMLElement} main
 */
function decorateButtons(main) {
  main.querySelectorAll('p > a, p > strong > a, p > em > a').forEach((a) => {
    const parent = a.parentElement;
    const isAlone = parent.textContent.trim() === a.textContent.trim();
    if (!isAlone) return;

    a.classList.add('btn');
    const grandparent = parent.parentElement;

    if (parent.tagName === 'EM') {
      a.classList.add('btn-outline');
      parent.replaceWith(a);
    } else if (parent.tagName === 'STRONG') {
      a.classList.add('btn-primary');
      parent.replaceWith(a);
    } else {
      a.classList.add('btn-outline');
    }

    // Wrap in button-container div
    const wrapper = document.createElement('p');
    wrapper.className = 'button-container';
    a.replaceWith(wrapper);
    wrapper.append(a);
  });
}

/**
 * Loads the announcement bar and header before anything else.
 * @param {HTMLElement} main
 */
async function loadEager(main) {
  // Load fonts early
  loadCSS('/styles/fonts.css');

  decorateSections(main);
  decorateBlocks(main);
  decoratePictures(main);
  decorateLinks(main);
  decorateButtons(main);

  // Load LCP blocks immediately
  const lcpCandidates = main.querySelectorAll(
    LCP_BLOCKS.map((b) => `div.${b}`).join(', ')
  );

  await Promise.all([...lcpCandidates].map(loadBlock));
}

/**
 * Loads remaining blocks after LCP.
 * @param {HTMLElement} main
 */
async function loadLazy(main) {
  loadCSS('/styles/lazy-styles.css');
  await loadBlocks(main);
}

/**
 * Loads after all blocks are loaded — analytics, 3rd party.
 */
function loadDelayed() {
  // Delayed script loading — analytics, chat, etc.
  import('./delayed.js').catch(() => {});
}

/**
 * Initialises the page.
 */
async function loadPage() {
  const main = document.querySelector('main');
  if (!main) return;

  await loadEager(main);

  // Yield to allow LCP paint
  await new Promise((r) => { window.requestAnimationFrame(r); });

  await loadLazy(main);

  window.addEventListener('load', loadDelayed);
}

loadPage();
