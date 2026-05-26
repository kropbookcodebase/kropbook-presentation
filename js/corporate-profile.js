/**
 * KROPBOOK — CORPORATE PROFILE JS
 * Tab nav · sticky shadow · status badges · counter animation · ageing bars
 * Globe scroll-path · flip/reveal observers · rbc/cat/donut chart animations · heat tiles
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
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tabButtons.forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-scroll-target') === id);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function (s) { sectionObserver.observe(s); });
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
    else if (val === 'partial')  el.classList.add('status-partial');
    else if (val === 'missing')  el.classList.add('status-missing');
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
        const target   = parseFloat(el.getAttribute('data-target'))   || 0;
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const prefix   = el.getAttribute('data-prefix') || '';
        const suffix   = el.getAttribute('data-suffix') || '';
        const duration = 1400;
        const start    = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
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

  /* ── 8. Globe scroll-path follower (bezier: top-left → mid-right → bottom-left) */
  const globeEl = document.getElementById('globe-follower');
  if (globeEl) {
    /* Bezier control points as fractions of viewport dimensions.
       P0 = start (near top-left), P1 = pull point (right-centre), P2 = end (bottom-left) */
    var gP = { x: [0.04, 0.74, 0.02], y: [0.08, 0.44, 0.76] };

    function updateGlobe() {
      var scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      var t = scrollMax > 0 ? Math.min(1, window.scrollY / scrollMax) : 0;

      var bx = (1-t)*(1-t)*gP.x[0] + 2*(1-t)*t*gP.x[1] + t*t*gP.x[2];
      var by = (1-t)*(1-t)*gP.y[0] + 2*(1-t)*t*gP.y[1] + t*t*gP.y[2];

      var vw = window.innerWidth;
      var vh = window.innerHeight;

      globeEl.style.transform = 'translate(' + (bx * vw).toFixed(1) + 'px, ' + (by * vh).toFixed(1) + 'px)';
      /* Fade in on first movement; fade out near page bottom */
      var opacity = t < 0.03 ? 0 : (t > 0.90 ? Math.max(0, (1 - t) / 0.10) : 1);
      globeEl.style.opacity = opacity.toFixed(3);
    }

    window.addEventListener('scroll', updateGlobe, { passive: true });
    updateGlobe();
  }

  /* ── 9. Flip entrance observer ───────────────────────────────── */
  var flipEls = document.querySelectorAll('.flip-enter');
  if (flipEls.length) {
    var flipObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          flipObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    flipEls.forEach(function (el) { flipObserver.observe(el); });
  }

  /* ── 10. Scroll-reveal observer ─────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── 11. Revenue bar chart (data-rbc-chart) ─────────────────── */
  var rbcCharts = document.querySelectorAll('[data-rbc-chart]');
  if (rbcCharts.length) {
    var rbcObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.rbc-bar-fill[data-pct]').forEach(function (bar, i) {
          var pct = parseFloat(bar.getAttribute('data-pct')) || 0;
          setTimeout(function () {
            bar.style.setProperty('--bar-pct', pct + '%');
            bar.classList.add('is-animated');
          }, i * 110);
        });
        rbcObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    rbcCharts.forEach(function (el) { rbcObserver.observe(el); });
  }

  /* ── 12. Category bar chart (data-cat-chart) ────────────────── */
  var catCharts = document.querySelectorAll('[data-cat-chart]');
  if (catCharts.length) {
    var catObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.cat-bar-fg[data-w]').forEach(function (bar, i) {
          var w = parseFloat(bar.getAttribute('data-w')) || 0;
          setTimeout(function () {
            bar.style.setProperty('--w', w + '%');
            bar.classList.add('is-animated');
          }, i * 100);
        });
        catObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    catCharts.forEach(function (el) { catObserver.observe(el); });
  }

  /* ── 13. SVG donut chart (data-donut-group) ─────────────────── */
  var donutGroups = document.querySelectorAll('[data-donut-group]');
  if (donutGroups.length) {
    var donutObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var green = entry.target.querySelector('.donut-seg-green');
        var gold  = entry.target.querySelector('.donut-seg-gold');

        if (green) {
          var r    = parseFloat(green.getAttribute('r')) || 40;
          var circ = 2 * Math.PI * r;
          var pct  = parseFloat(green.getAttribute('data-pct')) || 0;
          var len  = (pct / 100) * circ;
          /* Small delay so the CSS transition plays visibly */
          setTimeout(function () {
            green.style.strokeDasharray = len.toFixed(2) + ' ' + circ.toFixed(2);
          }, 200);
        }

        if (gold) {
          var rG       = parseFloat(gold.getAttribute('r')) || 40;
          var circG    = 2 * Math.PI * rG;
          var pctG     = parseFloat(gold.getAttribute('data-pct')) || 0;
          var offsetP  = parseFloat(gold.getAttribute('data-offset-pct')) || 0;
          var lenG     = (pctG / 100) * circG;
          var offsetPx = -((offsetP / 100) * circG);
          setTimeout(function () {
            gold.style.strokeDasharray  = lenG.toFixed(2) + ' ' + circG.toFixed(2);
            gold.style.strokeDashoffset = offsetPx.toFixed(2);
          }, 340);
        }

        donutObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    donutGroups.forEach(function (el) { donutObserver.observe(el); });
  }

  /* ── 14. Monthly heat tiles — temperature-mapped background ── */
  document.querySelectorAll('.month-tile').forEach(function (tile) {
    /* Read --heat value set inline; getPropertyValue returns a string */
    var raw  = getComputedStyle(tile).getPropertyValue('--heat').trim();
    var heat = parseFloat(raw) || 0.5;
    /* Normalise to 0..1 against a max of ~1.3 (highest observed value) */
    var t = Math.min(1, heat / 1.3);

    var r, g, b, a;
    if (t <= 0.5) {
      /* Pale sage → medium green */
      var t2 = t * 2;
      r = Math.round(224 - (224 - 27)  * t2);
      g = Math.round(240 - (240 - 120) * t2);
      b = Math.round(232 - (232 - 62)  * t2);
      a = 0.18 + t2 * 0.22;
    } else {
      /* Medium green → warm gold */
      var t3 = (t - 0.5) * 2;
      r = Math.round(27  + (201 - 27)  * t3);
      g = Math.round(120 + (162 - 120) * t3);
      b = Math.round(62  + (39  - 62)  * t3);
      a = 0.40 + t3 * 0.30;
    }
    tile.style.background = 'rgba(' + r + ',' + g + ',' + b + ',' + a.toFixed(2) + ')';

    /* High-value tiles get a subtle gold text colour */
    if (heat > 1.1) {
      tile.querySelector('.month-tile-val').style.color = 'var(--accent-gold)';
    }
  });

  /* ── 15. Download All Documents ─────────────────────────── */
  var dlBtn = document.getElementById('btn-download-all');
  if (dlBtn) {
    dlBtn.addEventListener('click', function () {
      var links = document.querySelectorAll('.docs-list a[href]');
      links.forEach(function (link, i) {
        setTimeout(function () {
          var a = document.createElement('a');
          a.href = link.href;
          a.download = '';
          a.target = '_blank';
          a.rel = 'noopener';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, i * 350);
      });
    });
  }

});
