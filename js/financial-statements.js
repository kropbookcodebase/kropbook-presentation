/**
 * KROPBOOK — FINANCIAL STATEMENTS PAGE JS (Page 11)
 * Section-based data room layout — no tabs.
 * Keyboard navigation for all doc cards.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Keyboard support for all doc cards (role=button, tabindex=0) ── */
  document.querySelectorAll('.doc-card[role="button"]').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

});
