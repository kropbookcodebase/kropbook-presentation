/**
 * KROPBOOK — BUSINESS OPERATIONS PAGE JS
 * Page-specific initialisation: supply chain flow, procure step stagger,
 * network card hover effects, and heading italic tint.
 */

/* ── Supply chain node entrance ──────────────────────────────── */
function initChainVisual() {
  const nodes = document.querySelectorAll('.bops-chain-node');
  const arrows = document.querySelectorAll('.bops-chain-arrow');

  nodes.forEach((node, i) => {
    node.style.opacity = '0';
    node.style.transform = 'translateY(16px)';
    node.style.transition = `opacity 0.5s ease ${i * 0.12 + 0.7}s, transform 0.5s ease ${i * 0.12 + 0.7}s`;
  });

  arrows.forEach((arrow, i) => {
    arrow.style.opacity = '0';
    arrow.style.transition = `opacity 0.4s ease ${i * 0.12 + 0.85}s`;
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      nodes.forEach(node => {
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
      });
      arrows.forEach(arrow => {
        arrow.style.opacity = '1';
      });
    });
  });
}

/* ── Procurement steps sequential stagger on scroll ──────────── */
function initProcureSteps() {
  const stepsWrapper = document.getElementById('procure-steps');
  if (!stepsWrapper) return;

  const steps = stepsWrapper.querySelectorAll('.bops-procure-step');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        steps.forEach((step, i) => {
          setTimeout(() => {
            step.classList.add('anim-visible');
          }, i * 110);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  observer.observe(stepsWrapper);
}

/* ── Distribution channel card hover icon tilt ───────────────── */
function initChannelCards() {
  const cards = document.querySelectorAll('.bops-channel-card');
  cards.forEach(card => {
    const icon = card.querySelector('.bops-channel-icon');
    if (!icon) return;
    card.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.12) rotate(-6deg)';
      icon.style.transition = 'transform 0.25s ease';
      icon.style.background = 'rgba(201,162,39,0.08)';
    });
    card.addEventListener('mouseleave', () => {
      icon.style.transform = '';
      icon.style.background = '';
    });
  });
}

/* ── Soil cards stagger ──────────────────────────────────────── */
function initSoilCards() {
  const cards = document.querySelectorAll('.bops-soil-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 120);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const soilSection = document.getElementById('soil-testing');
  if (soilSection) observer.observe(soilSection);
}

/* ── Network card region rows stagger ───────────────────────── */
function initNetworkCards() {
  const networkCards = document.querySelectorAll('.bops-network-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.bops-net-list li');
        items.forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-8px)';
          item.style.transition = `opacity 0.35s ease ${i * 0.08 + 0.2}s, transform 0.35s ease ${i * 0.08 + 0.2}s`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateX(0)';
            });
          });
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  networkCards.forEach(card => observer.observe(card));
}

/* ── Heading italic gold tint (consistent with systems.js) ───── */
function initHeadingEmphasis() {
  document.querySelectorAll('h2 em').forEach(em => {
    em.style.fontStyle = 'italic';
    em.style.color = 'var(--brand-green)';
    em.style.fontWeight = '300';
  });
}

/* ── Loyalty item hover highlight ────────────────────────────── */
function initLoyaltyItems() {
  const items = document.querySelectorAll('.bops-loyalty-item');
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const num = item.querySelector('.bops-loyalty-num');
      if (num) num.style.opacity = '1';
    });
    item.addEventListener('mouseleave', () => {
      const num = item.querySelector('.bops-loyalty-num');
      if (num) num.style.opacity = '';
    });
  });
}

/* ── Procurement stat counter observer ──────────────────────── */
function initProcureStat() {
  // The shared animations.js handles [data-counter] via initCounters().
  // This function is a hook for future page-specific counter config.
  // No-op unless page-specific overrides are needed.
}

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initChainVisual();
  initProcureSteps();
  initChannelCards();
  initSoilCards();
  initNetworkCards();
  initHeadingEmphasis();
  initLoyaltyItems();
  initProcureStat();
});
