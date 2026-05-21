/**
 * KROPBOOK — CORPORATE PROFILE JS
 * Tab scroll nav, status badges, readiness meter, counter animation, sticky tabs
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. Tab scroll navigation ───────────────────────────────── */
  const tabButtons = document.querySelectorAll('.profile-tabs [data-scroll-target]');

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.getAttribute('data-scroll-target');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      const offset = 72;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── 2. Active tab highlight via IntersectionObserver ──────── */
  const sections = document.querySelectorAll('.profile-section[id]');
  if (sections.length && tabButtons.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tabButtons.forEach(function (btn) {
            const match = btn.getAttribute('data-scroll-target') === id;
            btn.classList.toggle('active', match);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ── 3. Sticky tabs shadow on scroll ────────────────────────── */
  const tabsNav = document.querySelector('.profile-tabs');
  if (tabsNav) {
    window.addEventListener('scroll', function () {
      tabsNav.classList.toggle('is-sticky-shadow', window.scrollY > 200);
    }, { passive: true });
  }

  /* ── 4. Status badge class injection ────────────────────────── */
  document.querySelectorAll('[data-status]').forEach(function (el) {
    const val = el.getAttribute('data-status');
    if (val === 'complete') el.classList.add('status-complete');
    else if (val === 'partial') el.classList.add('status-partial');
    else if (val === 'missing') el.classList.add('status-missing');
  });

  /* ── 5. Readiness meter animation ───────────────────────────── */
  const fill = document.querySelector('.readiness-fill');
  if (fill) {
    setTimeout(function () { fill.classList.add('is-animated'); }, 300);
  }

  /* ── 6. Scroll-triggered counter animation ───────────────────── */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = (target * eased).toFixed(decimals);
          el.textContent = prefix + value + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.3 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ── 7. Ageing bar width injection ──────────────────────────── */
  document.querySelectorAll('.ageing-fill[data-pct]').forEach(function (bar) {
    const pct = parseFloat(bar.getAttribute('data-pct'));
    if (!isNaN(pct)) {
      setTimeout(function () {
        bar.style.setProperty('--bar-w', pct + '%');
        bar.classList.add('is-animated');
      }, 400);
    }
  });

});
