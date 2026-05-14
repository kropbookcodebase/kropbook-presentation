/**
 * KROPBOOK — PAGE 04: COMPANY / TECHNOLOGY
 * Flip cards, strikethrough reveal, process step progressive reveal
 */

/* ── Flip Card Touch / Mobile Support ─────────────────────── */
function initFlipCards() {
  document.querySelectorAll('.kb-flip-card').forEach(card => {
    // Toggle flip on touch / click for mobile users
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Click to reveal deeper insight');

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}

/* ── Animated Strikethrough Reveal ─────────────────────────── */
function initStrikethroughReveal() {
  const strikeEl = document.getElementById('strikethrough-text');
  if (!strikeEl) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Small delay so user reads the text first
        setTimeout(() => {
          strikeEl.classList.add('struck');
        }, 600);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(strikeEl);
}

/* ── Process Step Progressive Reveal ───────────────────────── */
function initProcessSteps() {
  const steps = document.querySelectorAll('.kb-process-step');
  if (!steps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate active step node with a pulse
        const activeNode = entry.target.querySelector('.kb-process-step__node--active');
        if (activeNode) {
          setTimeout(() => {
            activeNode.style.animation = 'activeNodePulse 1.2s ease-out forwards';
          }, 300);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  steps.forEach(step => observer.observe(step));
}

/* ── Hero card parameter tag stagger ───────────────────────── */
function initHeroParamTags() {
  const params = document.querySelectorAll('.kb-hero-card__params span');
  params.forEach((param, i) => {
    param.style.opacity = '0';
    param.style.transform = 'translateY(8px)';
    param.style.transition = `opacity 0.4s ease, transform 0.4s ease`;
    setTimeout(() => {
      param.style.opacity = '1';
      param.style.transform = 'translateY(0)';
    }, 800 + i * 80);
  });
}

/* ── Business card number colour on in-view ─────────────────── */
function initBizCardNumbers() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const num = entry.target.querySelector('.kb-biz-card__number');
        if (num) {
          num.style.transition = 'opacity 0.6s ease';
          num.style.opacity = '0.4';
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.kb-biz-card').forEach(card => observer.observe(card));
}

/* ── Inject active node keyframe ────────────────────────────── */
function injectActiveNodeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes activeNodePulse {
      0%   { box-shadow: 0 0 0 0 rgba(201,162,39,0.4); }
      50%  { box-shadow: 0 0 0 14px rgba(201,162,39,0); }
      100% { box-shadow: 0 0 0 6px rgba(201,162,39,0.12); }
    }
  `;
  document.head.appendChild(style);
}

/* ── Patent seal entrance ───────────────────────────────────── */
function initPatentSeal() {
  const seal = document.querySelector('.kb-patent-seal');
  if (!seal) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        seal.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease';
        seal.style.transform = 'scale(1) rotate(0deg)';
        seal.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Initial state
  seal.style.transform = 'scale(0.7) rotate(-15deg)';
  seal.style.opacity = '0';
  observer.observe(seal);
}

/* ── Process connector animation (desktop only) ─────────────── */
function initProcessConnectors() {
  if (window.innerWidth < 768) return;

  const flow = document.getElementById('process-flow');
  if (!flow) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Stagger highlight each step node
      const nodes = flow.querySelectorAll('.kb-process-step__node');
      nodes.forEach((node, i) => {
        setTimeout(() => {
          node.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease';
          node.style.transform = 'scale(1.12)';
          setTimeout(() => {
            node.style.transform = 'scale(1)';
          }, 200);
        }, i * 80);
      });
      observer.unobserve(entries[0].target);
    }
  }, { threshold: 0.25 });

  observer.observe(flow);
}

/* ── Summary values counter-style entrance ──────────────────── */
function initSummaryEntrance() {
  const summary = document.querySelector('.kb-process__summary');
  if (!summary) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      const values = summary.querySelectorAll('.kb-process__summary-value');
      values.forEach((val, i) => {
        val.style.opacity = '0';
        val.style.transform = 'translateY(10px)';
        val.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => {
          val.style.opacity = '1';
          val.style.transform = 'translateY(0)';
        }, i * 120 + 200);
      });
      observer.unobserve(entries[0].target);
    }
  }, { threshold: 0.4 });

  observer.observe(summary);
}

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectActiveNodeKeyframe();
  initFlipCards();
  initStrikethroughReveal();
  initProcessSteps();
  initHeroParamTags();
  initBizCardNumbers();
  initPatentSeal();
  initProcessConnectors();
  initSummaryEntrance();
});
