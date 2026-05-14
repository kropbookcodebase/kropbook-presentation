/**
 * KROPBOOK — STRATEGIC Q&A JS (Page 10)
 * Category filtering, default open, keyboard navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initCategoryFilter();
  openFirstAccordion();
  initKeyboardNavigation();
});

/* ── Category Filter ─────────────────────────────────────────── */
function initCategoryFilter() {
  const filterBar = document.getElementById('sqa-filter-bar');
  if (!filterBar) return;

  const btns = filterBar.querySelectorAll('.sqa-filter-btn');
  const items = document.querySelectorAll('.sqa-accordion-item');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      // Update active button
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter accordion items
      items.forEach(item => {
        if (category === 'all') {
          item.classList.remove('sqa-hidden');
        } else {
          const itemCategory = item.dataset.category;
          if (itemCategory === category) {
            item.classList.remove('sqa-hidden');
          } else {
            // Close if open before hiding
            item.classList.remove('open');
            item.classList.add('sqa-hidden');
          }
        }
      });

      // Re-open first visible item after filtering
      const firstVisible = document.querySelector('.sqa-accordion-item:not(.sqa-hidden)');
      if (firstVisible && !firstVisible.classList.contains('open')) {
        firstVisible.classList.add('open');
      }
    });
  });
}

/* ── Open First Accordion by Default ────────────────────────── */
function openFirstAccordion() {
  const firstItem = document.querySelector('.sqa-accordion-item');
  if (firstItem) {
    firstItem.classList.add('open');
  }
}

/* ── Keyboard Navigation (Arrow Keys) ───────────────────────── */
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Only handle arrow keys when focus is within the accordion list
    const activeEl = document.activeElement;
    if (!activeEl || !activeEl.classList.contains('accordion-trigger')) return;

    const currentItem = activeEl.closest('.sqa-accordion-item');
    if (!currentItem) return;

    // Get all visible (non-hidden) items
    const visibleItems = Array.from(
      document.querySelectorAll('.sqa-accordion-item:not(.sqa-hidden)')
    );

    const currentIndex = visibleItems.indexOf(currentItem);

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % visibleItems.length;
      const nextTrigger = visibleItems[nextIndex].querySelector('.accordion-trigger');
      if (nextTrigger) nextTrigger.focus();
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      const prevTrigger = visibleItems[prevIndex].querySelector('.accordion-trigger');
      if (prevTrigger) prevTrigger.focus();
    }

    if (e.key === 'Home') {
      e.preventDefault();
      const firstTrigger = visibleItems[0]?.querySelector('.accordion-trigger');
      if (firstTrigger) firstTrigger.focus();
    }

    if (e.key === 'End') {
      e.preventDefault();
      const lastTrigger = visibleItems[visibleItems.length - 1]?.querySelector('.accordion-trigger');
      if (lastTrigger) lastTrigger.focus();
    }
  });
}
