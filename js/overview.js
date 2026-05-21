/**
 * OVERVIEW PAGE — Page-specific JS
 * Morphing text cycle, any page-specific initialisation
 */

/* ── Morphing intelligence text cycle ─────────────────────── */
(function initMorphingText() {
  const phrases = [
    'Intelligence Layer',
    'Financial Rail',
    'Supply Chain OS',
    'Soil Data Engine',
    'AgriOS Platform',
    'Trust Infrastructure',
  ];

  const el = document.getElementById('morphing-text');
  if (!el) return;

  let currentIndex = 0;
  const HOLD_MS   = 2600;
  const FADE_MS   = 400;

  function cyclePhrase() {
    // Step 1: fade out
    el.classList.add('fading');

    setTimeout(() => {
      // Step 2: swap text while invisible
      currentIndex = (currentIndex + 1) % phrases.length;
      el.textContent = phrases[currentIndex];

      // Step 3: fade back in
      el.classList.remove('fading');
    }, FADE_MS);
  }

  // Start cycling after hero animations settle
  setTimeout(() => {
    setInterval(cyclePhrase, HOLD_MS + FADE_MS);
  }, 1800);
})();


/* ── Revenue bar chart in metrics section (optional sparkline) ─ */
// The main charts live on the Finance page; overview uses counters only.
// If a canvas#revenue-spark element is present, draw a micro area chart.
document.addEventListener('DOMContentLoaded', () => {
  if (typeof initWaveSphere === 'function') {
    initWaveSphere('wave-sphere');
  }

  if (typeof drawAreaChart === 'function') {
    const sparkCanvas = document.getElementById('revenue-spark');
    if (sparkCanvas) {
      drawAreaChart('revenue-spark', {
        labels: ['FY22-23', 'FY23-24', 'FY24-25'],
        series: [{
          values: [16.72, 27.95, 59.18],
          color: '#1B4D3E',
        }],
      }, {
        padLeft: 50,
        padRight: 10,
        padTop: 12,
        padBottom: 32,
        maxVal: 70,
      });
    }
  }
});


/* ── Hero entrance: animate shapes on load ─────────────────── */
// shapes are handled by animations.js initFloatingShapes()
// Hero content items use inline CSS animation — no extra JS needed.


/* ── Nav card active state polish ─────────────────────────── */
(function initNavCards() {
  document.querySelectorAll('.nav-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'rgba(201,162,39,0.35)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '';
    });
  });
})();


/* ── Moat layer hover: lift card and brighten icon area ───── */
(function initMoatHover() {
  document.querySelectorAll('.moat-layer-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(201,162,39,0.18)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });
})();


/* ── Achievement cards: stagger entrance when scrolled into view ─ */
// Handled entirely by global initScrollAnimations() via .anim-hidden + data-delay.
// No additional JS required.


/* ── Smooth-scroll the scroll indicator arrow ─────────────── */
(function initScrollIndicator() {
  const indicator = document.querySelector('.hero-scroll-indicator');
  if (!indicator) return;

  indicator.style.cursor = 'pointer';
  indicator.addEventListener('click', () => {
    const metricsSection = document.getElementById('metrics');
    if (metricsSection) {
      metricsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();
