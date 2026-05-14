/**
 * KROPBOOK — FINANCE PAGE JS (Page 07)
 * Revenue & asset charts, progress bars, counters
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Bar Chart — Revenue / Gross Profit / Net Profit ─────── */
  drawBarChart('revenue-chart', {
    groups: ['FY 22-23', 'FY 23-24', 'FY 24-25', 'FY 25-26*'],
    series: [
      { color: '#1B4D3E', values: [24.47, 27.90, 59.18, 92.50], label: 'Revenue' },
      { color: '#2d6b55', values: [1.47, 6.43, 21.70, 37.00],   label: 'Gross Profit' },
      { color: '#C9A227', values: [0.61, 4.72, 7.80, 13.20],    label: 'Net Profit' }
    ]
  }, {
    legend: [
      { color: '#1B4D3E', label: 'Revenue' },
      { color: '#2d6b55', label: 'Gross Profit' },
      { color: '#C9A227', label: 'Net Profit' }
    ],
    maxVal: 110
  });

  /* ── Area Chart — Revenue & Net Profit trajectory ──────────── */
  drawAreaChart('asset-chart', {
    labels: ['FY 22-23', 'FY 23-24', 'FY 24-25', 'FY 25-26*'],
    series: [
      { color: '#1B4D3E', values: [24.47, 27.90, 59.18, 92.50], label: 'Revenue' },
      { color: '#C9A227', values: [0.61, 4.72, 7.80, 13.20],    label: 'Net Profit' }
    ]
  });

  /* ── Redraw charts on resize (debounced) ────────────────────── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      drawBarChart('revenue-chart', {
        groups: ['FY 22-23', 'FY 23-24', 'FY 24-25', 'FY 25-26*'],
        series: [
          { color: '#1B4D3E', values: [24.47, 27.90, 59.18, 92.50], label: 'Revenue' },
          { color: '#2d6b55', values: [1.47, 6.43, 21.70, 37.00],   label: 'Gross Profit' },
          { color: '#C9A227', values: [0.61, 4.72, 7.80, 13.20],    label: 'Net Profit' }
        ]
      }, {
        legend: [
          { color: '#1B4D3E', label: 'Revenue' },
          { color: '#2d6b55', label: 'Gross Profit' },
          { color: '#C9A227', label: 'Net Profit' }
        ],
        maxVal: 110
      });

      drawAreaChart('asset-chart', {
        labels: ['FY 22-23', 'FY 23-24', 'FY 24-25', 'FY 25-26*'],
        series: [
          { color: '#1B4D3E', values: [24.47, 27.90, 59.18, 92.50], label: 'Revenue' },
          { color: '#C9A227', values: [0.61, 4.72, 7.80, 13.20],    label: 'Net Profit' }
        ]
      });
    }, 250);
  });

  /* ── Progress bar animation on scroll ───────────────────────── */
  // initProgressBars() from animations.js handles .progress-container
  // Additional manual trigger for the year-comparison table rows
  const comparisonObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.progress-fill').forEach((bar, i) => {
          const targetWidth = bar.dataset.width || '0%';
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, i * 120 + 150);
        });
        comparisonObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.year-comparison-table tbody tr').forEach(row => {
    comparisonObserver.observe(row);
  });

  /* ── Counter animation for headline metrics ─────────────────── */
  // initCounters() from animations.js picks up [data-counter] attributes
  // Already called in animations.js DOMContentLoaded — no duplication needed.

});
