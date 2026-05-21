/**
 * KROPBOOK — ANIMATIONS JS
 * IntersectionObserver-based scroll animations, animated counters, chart animations
 */

/* ── IntersectionObserver for entrance animations ──────────── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Apply stagger delay from data attribute
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
          el.classList.add('anim-visible');
        }, delay * 1000);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.anim-hidden, .anim-left, .anim-right').forEach(el => {
    observer.observe(el);
  });
}

/* ── Animated Counter ───────────────────────────────────────── */
function animateCounter(el, target, decimals = 0, prefix = '', suffix = '', duration = 1500) {
  const start = performance.now();
  const startVal = 0;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const val = startVal + (target - startVal) * easeOut(progress);
    el.textContent = prefix + val.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = prefix + target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.counted) return;
        el.dataset.counted = 'true';
        const target = parseFloat(el.dataset.target || '0');
        const decimals = parseInt(el.dataset.decimals || '0');
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, decimals, prefix, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
}

/* ── Bar chart animation (CSS-based) ───────────────────────── */
function initBarAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach((bar, i) => {
          setTimeout(() => {
            bar.style.width = bar.dataset.width || bar.style.getPropertyValue('--bar-w') || '100%';
            bar.style.height = bar.dataset.height || bar.style.getPropertyValue('--bar-h') || '100%';
            bar.style.opacity = '1';
          }, i * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.chart-bars, .bar-chart').forEach(el => observer.observe(el));
}

/* ── Vertical bar chart (canvas-based) ─────────────────────── */
function drawBarChart(canvasId, data, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;
  const padLeft = options.padLeft || 60;
  const padRight = options.padRight || 20;
  const padTop = options.padTop || 30;
  const padBottom = options.padBottom || 50;
  const chartW = W - padLeft - padRight;
  const chartH = H - padTop - padBottom;

  const groups = data.groups;
  const series = data.series;
  const n = groups.length;
  const nSeries = series.length;
  const groupW = chartW / n;
  const barW = Math.min((groupW / (nSeries + 1)) * 0.9, 52);
  const totalBarW = barW * nSeries + (nSeries - 1) * 4;
  const maxVal = options.maxVal || Math.max(...series.flatMap(s => s.values)) * 1.15;

  function getY(val) {
    return padTop + chartH - (val / maxVal) * chartH;
  }

  // Grid lines
  ctx.strokeStyle = 'rgba(27,77,62,0.07)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padTop + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(padLeft + chartW, y);
    ctx.stroke();
    const val = (maxVal * (4 - i) / 4).toFixed(1);
    ctx.fillStyle = '#7A9690';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('₹' + val + 'Cr', padLeft - 6, y + 4);
  }

  // Draw bars with animation
  let progress = 0;
  const duration = 800;
  const start = performance.now();

  function draw(now) {
    progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    ctx.clearRect(0, 0, W, H);

    // Grid (re-draw)
    ctx.strokeStyle = 'rgba(27,77,62,0.07)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + chartW, y);
      ctx.stroke();
      const val = (maxVal * (4 - i) / 4).toFixed(1);
      ctx.fillStyle = '#7A9690';
      ctx.font = '11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('₹' + val + 'Cr', padLeft - 6, y + 4);
    }

    // X axis labels
    groups.forEach((group, gi) => {
      const cx = padLeft + groupW * gi + groupW / 2;
      ctx.fillStyle = '#7A9690';
      ctx.font = '11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(group, cx, H - padBottom + 20);
    });

    // Bars
    series.forEach((s, si) => {
      s.values.forEach((val, gi) => {
        const cx = padLeft + groupW * gi + groupW / 2;
        const x = cx - totalBarW / 2 + si * (barW + 4);
        const barH = ((val / maxVal) * chartH) * ease;
        const y = padTop + chartH - barH;

        // Gradient
        const grad = ctx.createLinearGradient(0, y, 0, padTop + chartH);
        grad.addColorStop(0, s.color);
        grad.addColorStop(1, s.color + 'CC');
        ctx.fillStyle = grad;

        // Rounded top
        const r = 6;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barW - r, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
        ctx.lineTo(x + barW, padTop + chartH);
        ctx.lineTo(x, padTop + chartH);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.fill();

        // Value label on top
        if (progress > 0.85) {
          ctx.fillStyle = s.color;
          ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('₹' + val + 'Cr', x + barW / 2, y - 5);
        }
      });
    });

    // Legend
    if (options.legend) {
      options.legend.forEach((item, i) => {
        const lx = padLeft + i * 120;
        const ly = 12;
        ctx.fillStyle = item.color;
        ctx.fillRect(lx, ly, 12, 10);
        ctx.fillStyle = '#7A9690';
        ctx.font = '11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(item.label, lx + 16, ly + 9);
      });
    }

    if (progress < 1) requestAnimationFrame(draw);
  }

  // Only animate when in view
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      requestAnimationFrame(draw);
      observer.disconnect();
    }
  }, { threshold: 0.2 });
  observer.observe(canvas);
}

/* ── Area / Line chart (canvas) ─────────────────────────────── */
function drawAreaChart(canvasId, data, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const W = rect.width, H = rect.height;
  const padL = options.padLeft || 60, padR = options.padRight || 20;
  const padT = options.padTop || 20, padB = options.padBottom || 40;
  const chartW = W - padL - padR, chartH = H - padT - padB;

  const labels = data.labels;
  const series = data.series;
  const maxVal = options.maxVal || Math.max(...series.flatMap(s => s.values)) * 1.2;
  const n = labels.length;

  function getX(i) { return padL + (i / (n - 1)) * chartW; }
  function getY(val) { return padT + chartH - (val / maxVal) * chartH; }

  let progress = 0;
  const start = performance.now();

  function draw(now) {
    progress = Math.min((now - start) / 1000, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(27,77,62,0.07)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (chartH / 4) * i;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + chartW, y); ctx.stroke();
      const val = (maxVal * (4 - i) / 4).toFixed(2);
      ctx.fillStyle = '#7A9690'; ctx.font = '11px -apple-system'; ctx.textAlign = 'right';
      ctx.fillText('₹' + val + 'Cr', padL - 6, y + 4);
    }

    // X labels
    labels.forEach((lbl, i) => {
      ctx.fillStyle = '#7A9690'; ctx.font = '11px -apple-system'; ctx.textAlign = 'center';
      ctx.fillText(lbl, getX(i), H - 8);
    });

    // Series
    series.forEach(s => {
      const pts = s.values.map((v, i) => ({ x: getX(i), y: getY(v * ease) }));

      // Area fill
      const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
      grad.addColorStop(0, s.color + '30');
      grad.addColorStop(1, s.color + '00');
      ctx.beginPath();
      ctx.moveTo(pts[0].x, padT + chartH);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[pts.length - 1].x, padT + chartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const cp1x = (pts[i - 1].x + pts[i].x) / 2;
        ctx.bezierCurveTo(cp1x, pts[i - 1].y, cp1x, pts[i].y, pts[i].x, pts[i].y);
      }
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Dots
      if (progress > 0.7) {
        pts.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = s.color; ctx.fill();
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        });
      }
    });

    if (progress < 1) requestAnimationFrame(draw);
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { requestAnimationFrame(draw); observer.disconnect(); }
  }, { threshold: 0.2 });
  observer.observe(canvas);
}

/* ── Progress bar animation ────────────────────────────────── */
function initProgressBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.progress-fill').forEach((bar, i) => {
          const w = bar.dataset.width || '0%';
          setTimeout(() => {
            bar.style.width = w;
          }, i * 100 + 200);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.progress-container').forEach(el => observer.observe(el));
}

/* ── Accordion ──────────────────────────────────────────────── */
function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── Tabs ────────────────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.tab-group').forEach(group => {
    const tabs = group.querySelectorAll('.tab-btn');
    const panels = group.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        group.querySelector(`.tab-panel[data-tab="${target}"]`).classList.add('active');
      });
    });
  });
}

/* ── SVG line draw animation ────────────────────────────────── */
function initSvgLines() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.org-line').forEach((line, i) => {
          setTimeout(() => line.classList.add('drawn'), i * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.org-chart').forEach(el => observer.observe(el));
}

/* ── Floating shapes initial animation ─────────────────────── */
function initFloatingShapes() {
  document.querySelectorAll('.floating-shape').forEach((shape, i) => {
    shape.style.opacity = '0';
    shape.style.transform += ' translateY(-30px)';
    setTimeout(() => {
      shape.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.23,0.86,0.39,0.96)';
      shape.style.opacity = shape.dataset.opacity || '0.06';
      shape.style.transform = shape.style.transform.replace('translateY(-30px)', 'translateY(0)');
    }, i * 200 + 300);
  });
}

/* ── Init all ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCounters();
  initBarAnimations();
  initProgressBars();
  initAccordions();
  initTabs();
  initSvgLines();
  initFloatingShapes();
});
