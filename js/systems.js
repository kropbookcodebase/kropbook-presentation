/**
 * KROPBOOK — SYSTEMS PAGE JS
 * Architecture diagram animations, flow chart sequences, pulsing connectors
 */

/* ── Architecture diagram layer stagger ──────────────────────── */
function initArchDiagram() {
  const diagram = document.getElementById('arch-diagram');
  if (!diagram) return;

  const layers = diagram.querySelectorAll('[data-layer]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        layers.forEach((layer, i) => {
          setTimeout(() => {
            layer.classList.add('arch-layer-revealed');
          }, i * 150);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.15 });

  if (diagram) observer.observe(diagram);
}

/* ── Animate flow dots in architecture diagram ───────────────── */
function initArchFlowDots() {
  // Stagger the animation delay on each flow dot so they feel sequential
  const dots = document.querySelectorAll('.arch-flow-dot');
  dots.forEach((dot, i) => {
    dot.style.animationDelay = `${i * 0.4}s`;
  });

  // Also stagger preview dots
  const previewDots = document.querySelectorAll('.ap-pulse-dot');
  previewDots.forEach((dot, i) => {
    dot.style.animationDelay = `${i * 0.6}s`;
  });
}

/* ── Financial rail step sequential reveal ───────────────────── */
function initRailFlow() {
  const railFlow = document.getElementById('rail-flow');
  if (!railFlow) return;

  const steps = railFlow.querySelectorAll('.rail-step');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        steps.forEach((step, i) => {
          setTimeout(() => {
            step.classList.add('anim-visible');
          }, i * 120);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  observer.observe(railFlow);
}

/* ── Moat bar animation on scroll ────────────────────────────── */
function initMoatBars() {
  const cards = document.querySelectorAll('.license-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.moat-bar');
        if (bar) {
          const targetWidth = bar.style.width;
          // Reset width first for transition effect
          bar.style.width = '0%';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              bar.style.width = targetWidth;
            });
          });
        }
      }
    });
  }, { threshold: 0.3 });

  cards.forEach(card => observer.observe(card));
}

/* ── Pulsing dots in arch preview ────────────────────────────── */
function initPulsingDots() {
  const pulseDots = document.querySelectorAll('.ap-pulse-dot');
  pulseDots.forEach((dot, i) => {
    dot.style.animationDelay = `${(i * 0.7) % 2}s`;
  });
}

/* ── Hero architecture preview entrance ──────────────────────── */
function initHeroPreview() {
  const preview = document.querySelector('.arch-preview-inner');
  if (!preview) return;

  const boxes = preview.querySelectorAll('.ap-box');
  boxes.forEach((box, i) => {
    box.style.opacity = '0';
    box.style.transform = 'translateY(12px)';
    box.style.transition = `opacity 0.5s ease ${i * 0.1 + 0.6}s, transform 0.5s ease ${i * 0.1 + 0.6}s`;
  });

  // Trigger after DOM paints
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      boxes.forEach(box => {
        box.style.opacity = '1';
        box.style.transform = 'translateY(0)';
      });
    });
  });
}

/* ── Section heading italic fade ────────────────────────────── */
function initHeadingEmphasis() {
  // Slight gold tint for italic em inside headings
  document.querySelectorAll('h2 em').forEach(em => {
    em.style.fontStyle = 'italic';
    em.style.color = 'var(--brand-green)';
    em.style.fontWeight = '300';
  });
}

/* ── Capability card hover icon swap ────────────────────────── */
function initCapCards() {
  const cards = document.querySelectorAll('.cap-card');
  cards.forEach(card => {
    const icon = card.querySelector('.cap-icon');
    if (!icon) return;
    card.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.1) rotate(-5deg)';
      icon.style.transition = 'transform 0.25s ease';
    });
    card.addEventListener('mouseleave', () => {
      icon.style.transform = '';
    });
  });
}

/* ── Phone credit bar animation ─────────────────────────────── */
function initPhoneCredit() {
  const fill = document.querySelector('.phone-credit-fill');
  if (!fill) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // CSS animation handles this, but we restart it
      fill.style.animation = 'none';
      void fill.offsetWidth; // reflow
      fill.style.animation = 'creditGrow 2.5s ease-out 0.3s both';
      observer.disconnect();
    }
  }, { threshold: 0.4 });

  const phoneWrap = document.querySelector('.phone-wrap');
  if (phoneWrap) observer.observe(phoneWrap);
}

/* ── Scroll-driven active step highlight ────────────────────── */
function initRailStepHighlight() {
  const steps = document.querySelectorAll('.rail-step');
  if (!steps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const icon = entry.target.querySelector('.rail-step-icon');
        if (icon) {
          icon.style.background = 'rgba(27,77,62,0.08)';
        }
      }
    });
  }, { threshold: 0.7 });

  steps.forEach(step => observer.observe(step));
}

/* ── Architecture layer CSS class toggle (for advanced effects) */
function initLayerHover() {
  const layers = document.querySelectorAll('.arch-layer');
  layers.forEach(layer => {
    layer.addEventListener('mouseenter', () => {
      // Highlight connected flow dots
      const sibling = layer.nextElementSibling;
      if (sibling && sibling.classList.contains('arch-connector')) {
        const dot = sibling.querySelector('.arch-flow-dot');
        if (dot) dot.style.animationPlayState = 'running';
      }
    });
  });
}

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initArchDiagram();
  initArchFlowDots();
  initRailFlow();
  initMoatBars();
  initPulsingDots();
  initHeroPreview();
  initHeadingEmphasis();
  initCapCards();
  initPhoneCredit();
  initRailStepHighlight();
  initLayerHover();
});
