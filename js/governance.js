/**
 * KROPBOOK — GOVERNANCE PAGE JS
 * Page-specific interactions and enhanced animations
 */

/* ── Governance Principle Cards — stagger on scroll ─────────── */
function initPrincipleCards() {
  const cards = document.querySelectorAll('.gov-principle-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const delay = parseFloat(card.dataset.delay || 0) * 1000;
        setTimeout(() => {
          card.classList.add('anim-visible');
        }, delay);
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => observer.observe(card));
}

/* ── Team Cards — stagger entrance ──────────────────────────── */
function initTeamCards() {
  const cards = document.querySelectorAll('.gov-team-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const delay = parseFloat(card.dataset.delay || 0) * 1000;
        setTimeout(() => {
          card.classList.add('anim-visible');
        }, delay);
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => observer.observe(card));
}

/* ── Patent Callout — dramatic entrance with gold pulse ─────── */
function initPatentCallout() {
  const callout = document.querySelector('.gov-patent-callout');
  if (!callout) return;

  const wonEl = callout.querySelector('.gov-patent-won');
  if (!wonEl) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // The callout itself animates via anim-hidden class
        // Add a subtle pulse to the "won" text after entrance
        setTimeout(() => {
          wonEl.style.transition = 'filter 0.6s ease';
          wonEl.style.filter = 'drop-shadow(0 0 24px rgba(201,162,39,0.5))';
          setTimeout(() => {
            wonEl.style.filter = 'drop-shadow(0 0 8px rgba(201,162,39,0.2))';
          }, 800);
        }, 700);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(callout);
}

/* ── Info Grid — subtle row reveal ──────────────────────────── */
function initInfoGrid() {
  const items = document.querySelectorAll('.gov-info-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Items stagger in sequentially
        items.forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px)';
          item.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
          // Force repaint
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          });
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const grid = document.querySelector('.gov-info-grid');
  if (grid) observer.observe(grid);
}

/* ── Doc Cards — ensure click works anywhere on card ─────────── */
function initDocCards() {
  document.querySelectorAll('.doc-card[onclick]').forEach(card => {
    // Already has onclick — enhance keyboard accessibility
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

/* ── CTA button hover enhancement ──────────────────────────── */
function initCtaButton() {
  const btn = document.querySelector('.gov-cta-btn');
  if (!btn) return;

  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.03)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
}

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPrincipleCards();
  initTeamCards();
  initPatentCallout();
  initInfoGrid();
  initDocCards();
  initCtaButton();
});
