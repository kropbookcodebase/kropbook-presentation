/**
 * KROPBOOK — CLIENTS PAGE JS
 * Page 09 · client card stagger reveal + counter animations
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Staggered client card reveal ──────────────────────────── */
  initClientCardReveal();

  /* ── Counter animations (supplementary — animations.js also
     runs initCounters(), but this re-scopes to metric section) */
  // animations.js already handles data-counter; nothing extra needed.

});

/* ────────────────────────────────────────────────────────────── */
/*  Client card stagger reveal                                     */
/* ────────────────────────────────────────────────────────────── */
function initClientCardReveal() {
  const cards = document.querySelectorAll('.client-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const idx = parseInt(card.dataset.cardIndex || '0');

        // Stagger by card index — 120ms between each
        setTimeout(() => {
          card.classList.add('anim-visible');
          card.classList.remove('anim-hidden');
        }, idx * 120);

        observer.unobserve(card);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  cards.forEach((card, i) => {
    card.dataset.cardIndex = i;
    observer.observe(card);
  });
}

/* ────────────────────────────────────────────────────────────── */
/*  Logo hover shimmer (micro-interaction)                         */
/* ────────────────────────────────────────────────────────────── */
document.querySelectorAll('.client-card-logo').forEach(logo => {
  logo.addEventListener('mouseenter', () => {
    logo.style.transition = 'transform 0.35s cubic-bezier(0.23,0.86,0.39,0.96), box-shadow 0.35s ease';
  });
});

/* ────────────────────────────────────────────────────────────── */
/*  Featured card (Zomato) — subtle gold pulse on load            */
/* ────────────────────────────────────────────────────────────── */
function initFeaturedCardPulse() {
  const featured = document.querySelector('.client-card-featured');
  if (!featured) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Brief gold-border pulse after card appears
      setTimeout(() => {
        featured.style.transition = 'border-color 0.4s ease, box-shadow 0.4s ease';
        featured.style.borderColor = 'rgba(201,162,39,0.6)';
        featured.style.boxShadow = '0 8px 40px rgba(201,162,39,0.18)';

        setTimeout(() => {
          featured.style.borderColor = 'rgba(201,162,39,0.25)';
          featured.style.boxShadow = '0 4px 24px rgba(201,162,39,0.08)';
        }, 700);
      }, 600);

      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(featured);
}

document.addEventListener('DOMContentLoaded', initFeaturedCardPulse);

/* ────────────────────────────────────────────────────────────── */
/*  Metrics section: animate metric-value numbers on scroll        */
/* ────────────────────────────────────────────────────────────── */
function initMetricReveal() {
  const metricCards = document.querySelectorAll('.clients-metrics-section .metric-card');
  if (!metricCards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  metricCards.forEach(card => {
    // Ensure hidden class is applied for the observer-based reveal
    if (!card.classList.contains('anim-visible')) {
      observer.observe(card);
    }
  });
}

document.addEventListener('DOMContentLoaded', initMetricReveal);
