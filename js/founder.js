/**
 * FOUNDER PAGE — Page-specific JS
 * Timeline dot animation, progress bar fills, scroll interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initTimelineAnimations();
  initFounderProgressBars();
  initFounderScrollEffects();
});

/* ── Timeline Dot Animations ────────────────────────────────── */
function initTimelineAnimations() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (!timelineItems.length) return;

  const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const dot = item.querySelector('.timeline-dot');
        if (dot && !dot.classList.contains('timeline-dot--gold')) {
          // Pulse the dot on entry
          dot.classList.add('dot-animate');
          setTimeout(() => {
            item.classList.add('dot-active');
            dot.classList.remove('dot-animate');
          }, 300);
        }
        dotObserver.unobserve(item);
      }
    });
  }, {
    threshold: 0.4,
    rootMargin: '0px 0px -60px 0px'
  });

  timelineItems.forEach(item => dotObserver.observe(item));
}

/* ── Progress Bar Fills (Tech Journey) ─────────────────────── */
function initFounderProgressBars() {
  const progressContainers = document.querySelectorAll('.progress-container');
  if (!progressContainers.length) return;

  const fillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.tech-stage-fill');
        fills.forEach((fill, idx) => {
          const targetWidth = fill.dataset.width || '0%';
          // Stagger the bar fills for visual effect
          setTimeout(() => {
            fill.style.width = targetWidth;
          }, idx * 150 + 300);
        });
        fillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  progressContainers.forEach(el => fillObserver.observe(el));
}

/* ── Scroll Effects ─────────────────────────────────────────── */
function initFounderScrollEffects() {
  // Hero glow parallax (subtle)
  const heroGlow = document.querySelector('.founder-hero-glow');
  if (heroGlow) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const translateY = scrollY * 0.25;
      heroGlow.style.transform = `translateY(${translateY}px)`;
    }, { passive: true });
  }

  // Animate timeline track drawing on scroll
  animateTimelineTrack();

  // Stagger credential cards on viewport entry
  animateCredentialCards();

  // Promise quote reveal with word stagger
  animatePromiseQuotes();
}

/* ── Timeline Track Line Draw ───────────────────────────────── */
function animateTimelineTrack() {
  const track = document.querySelector('.timeline-track');
  if (!track) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Animate the gradient line drawing downward
      track.style.transition = 'none';
      track.style.scaleY = '0';
      track.style.transformOrigin = 'top';
      track.style.transform = 'scaleY(0)';

      requestAnimationFrame(() => {
        track.style.transition = 'transform 1.4s cubic-bezier(0.25, 0.4, 0.25, 1)';
        track.style.transform = 'scaleY(1)';
      });

      observer.disconnect();
    }
  }, { threshold: 0.1 });

  observer.observe(track);
}

/* ── Credential Cards Stagger ───────────────────────────────── */
function animateCredentialCards() {
  const credentialGrids = document.querySelectorAll('.credentials-grid');

  credentialGrids.forEach(grid => {
    const cards = grid.querySelectorAll('.credential-card');
    cards.forEach((card, i) => {
      // Set initial state (will be overridden by scroll reveal)
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      card.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
      card.style.transitionDelay = `${i * 0.1}s`;
    });

    const gridObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        cards.forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
        gridObserver.disconnect();
      }
    }, { threshold: 0.15 });

    gridObserver.observe(grid);
  });
}

/* ── Promise Quotes Reveal ──────────────────────────────────── */
function animatePromiseQuotes() {
  const promiseCard = document.querySelector('.promise-card');
  if (!promiseCard) return;

  const quotes = promiseCard.querySelectorAll('.promise-quote');
  quotes.forEach((q, i) => {
    q.style.opacity = '0';
    q.style.transform = 'translateX(-12px)';
    q.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    q.style.transitionDelay = `${i * 0.25 + 0.1}s`;
  });

  const attr = promiseCard.querySelector('.promise-attribution');
  if (attr) {
    attr.style.opacity = '0';
    attr.style.transition = 'opacity 0.7s ease';
    attr.style.transitionDelay = '0.7s';
  }

  const promiseObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      quotes.forEach(q => {
        q.style.opacity = '1';
        q.style.transform = 'translateX(0)';
      });
      if (attr) attr.style.opacity = '1';
      promiseObserver.disconnect();
    }
  }, { threshold: 0.25 });

  promiseObserver.observe(promiseCard);
}

/* ── Integrity Card Entrance ────────────────────────────────── */
(function initIntegrityCard() {
  const card = document.querySelector('.integrity-card');
  if (!card) return;

  card.style.opacity = '0';
  card.style.transform = 'scale(0.98) translateY(20px)';
  card.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.25, 0.4, 0.25, 1)';

  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      card.style.opacity = '1';
      card.style.transform = 'scale(1) translateY(0)';
      obs.disconnect();
    }
  }, { threshold: 0.2 });

  obs.observe(card);
})();
