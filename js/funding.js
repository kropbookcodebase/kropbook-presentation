/**
 * KROPBOOK — FUNDING PAGE JS (Page 08)
 * Revenue projection bar chart, progress bars, counters
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Bar Chart — Revenue / Gross Profit / Net Profit (Post-Funding) ── */
  drawBarChart('funding-chart', {
    groups: ['FY 25-26*', 'FY 26-27 (Post-Fund)', 'FY 27-28'],
    series: [
      { color: '#1B4D3E', values: [75.49, 170.00, 300.00], label: 'Revenue' },
      { color: '#2d6b55', values: [9.95,  70.00,  130.00], label: 'Gross Profit' },
      { color: '#C9A227', values: [0,     25.00,  52.50],  label: 'Net Profit (projected)' }
    ]
  }, {
    legend: [
      { color: '#1B4D3E', label: 'Revenue' },
      { color: '#2d6b55', label: 'Gross Profit' },
      { color: '#C9A227', label: 'Net Profit (projected)' }
    ],
    maxVal: 360
  });

  /* ── Redraw on resize (debounced) ────────────────────────── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      drawBarChart('funding-chart', {
        groups: ['FY 25-26*', 'FY 26-27 (Post-Fund)', 'FY 27-28'],
        series: [
          { color: '#1B4D3E', values: [75.49, 170.00, 300.00], label: 'Revenue' },
          { color: '#2d6b55', values: [9.95,  70.00,  130.00], label: 'Gross Profit' },
          { color: '#C9A227', values: [0,     25.00,  52.50],  label: 'Net Profit (projected)' }
        ]
      }, {
        legend: [
          { color: '#1B4D3E', label: 'Revenue' },
          { color: '#2d6b55', label: 'Gross Profit' },
          { color: '#C9A227', label: 'Net Profit (projected)' }
        ],
        maxVal: 360
      });
    }, 250);
  });

  /* ── Progress bars — option cards ───────────────────────── */
  // Trigger progress bars inside option cards and util rows on scroll
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.progress-fill').forEach((bar, i) => {
          const targetWidth = bar.dataset.width || '0%';
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, i * 120 + 200);
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  // Observe option cards
  document.querySelectorAll('.option-card').forEach(card => {
    barObserver.observe(card);
  });

  // Observe utilization rows individually for staggered animation
  document.querySelectorAll('.util-row').forEach((row, i) => {
    const rowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.querySelectorAll('.progress-fill').forEach(bar => {
              bar.style.width = bar.dataset.width || '0%';
            });
          }, i * 100);
          rowObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    rowObserver.observe(row);
  });

  /* ── Counter animation for key stats ────────────────────── */
  // initCounters() from animations.js handles [data-counter] attributes
  // No duplication needed.

  /* ── Subtle hover highlight for govt comparison cards ────── */
  document.querySelectorAll('.govt-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Why card entrance with individual stagger ──────────── */
  const whyCards = document.querySelectorAll('.why-card');
  const whyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('anim-visible');
        }, delay * 1000);
        whyObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  whyCards.forEach(card => whyObserver.observe(card));

});
