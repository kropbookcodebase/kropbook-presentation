/**
 * effects.js — Kropbook Agritech Investor Presentation
 *
 * Visual effects library. Pure vanilla JS, no build tools, no frameworks.
 *
 * Exports (global):
 *   initWaveSphere(canvasId)  — Canvas animated wave sphere
 *   initInfiniteGrids()       — Mouse-reveal grid backgrounds
 *   initZoomParallax()        — Scroll-driven zoom parallax layers
 *   initHeroShapes()          — Floating entry-animated hero shapes
 */

/* =========================================================================
   1. CANVAS WAVE SPHERE
   ========================================================================= */

/**
 * Initialises a self-animating wave sphere on the given canvas element using
 * only the browser canvas API.
 *
 * @param {string} canvasId id of the target <canvas> element.
 * @returns {Function|undefined} Cleanup function that stops animation.
 */
function initWaveSphere(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  let mouseX = 0;
  let mouseY = 0;
  let width = 0;
  let height = 0;
  let targetPosX = 0;
  let targetPosY = 0;
  let targetScale = 1;
  let curPosX = 0;
  let curPosY = 0;
  let curScale = 1;
  let animId;

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onScroll() {
    const scrollY = window.scrollY;
    const heroH = window.innerHeight * 0.9;
    const progress = Math.min(scrollY / heroH, 1);

    if (progress <= 0.3) {
      const p = progress / 0.3;
      targetPosX = p * 0.4;
      targetPosY = -p * 0.1;
      targetScale = 1 - p * 0.12;
    } else {
      const p = (progress - 0.3) / 0.7;
      targetPosX = 0.4 - p * 3.0;
      targetPosY = -0.1 - p * 0.3;
      targetScale = 0.88 - p * 0.65;
    }

    canvas.style.opacity = (0.6 - progress * 0.42).toFixed(3);
  }

  function handleResize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth || window.innerWidth;
    height = canvas.offsetHeight || window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function drawSphere(time) {
    const cx = width * 0.52 + curPosX * width * 0.24;
    const cy = height * 0.44 + curPosY * height * 0.24;
    const radius = Math.min(width, height) * 0.24 * Math.max(curScale, 0.05);
    const bands = 18;

    ctx.clearRect(0, 0, width, height);

    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.8);
    halo.addColorStop(0, 'rgba(201,162,39,0.22)');
    halo.addColorStop(0.42, 'rgba(27,77,62,0.14)');
    halo.addColorStop(1, 'rgba(27,77,62,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.8, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < bands; i += 1) {
      const p = i / (bands - 1);
      const y = cy + (p - 0.5) * radius * 1.65;
      const bandRadius = Math.sqrt(Math.max(0, 1 - Math.pow((p - 0.5) * 2, 2))) * radius;
      const wave = Math.sin(time * 0.0018 + i * 0.75 + mouseX * 0.9) * radius * 0.06;

      ctx.beginPath();
      for (let step = 0; step <= 80; step += 1) {
        const t = (step / 80) * Math.PI * 2;
        const x = cx + Math.cos(t) * bandRadius + Math.sin(t * 3 + time * 0.0012) * radius * 0.025;
        const yy = y + Math.sin(t) * radius * 0.08 + wave;
        if (step === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.closePath();
      ctx.strokeStyle = i % 3 === 0 ? 'rgba(201,162,39,0.36)' : 'rgba(27,77,62,0.28)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const rim = ctx.createRadialGradient(
      cx + mouseX * radius * 0.25,
      cy - mouseY * radius * 0.25,
      radius * 0.1,
      cx,
      cy,
      radius
    );
    rim.addColorStop(0, 'rgba(255,255,255,0.34)');
    rim.addColorStop(0.38, 'rgba(201,162,39,0.16)');
    rim.addColorStop(1, 'rgba(27,77,62,0.04)');
    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function animate(time) {
    const ease = 0.05;
    curPosX += (targetPosX - curPosX) * ease;
    curPosY += (targetPosY - curPosY) * ease;
    curScale += (targetScale - curScale) * ease;
    drawSphere(time);
    animId = requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', handleResize);

  handleResize();
  onScroll();
  animId = requestAnimationFrame(animate);

  return function cleanup() {
    cancelAnimationFrame(animId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', onScroll);
  };
}


/* =========================================================================
   2. INFINITE GRID WITH MOUSE REVEAL
   ========================================================================= */

/**
 * Activates mouse-reveal radial spotlight on every .section-grid-reveal
 * element via CSS custom properties --mx / --my.
 *
 * For elements that additionally carry the class .section-grid-animated,
 * a continuous background-position drift is also applied to give the
 * impression of an infinite scrolling grid.
 *
 * Expected CSS (defined in your stylesheet):
 *
 *   .section-grid-reveal {
 *     --mx: 50%;
 *     --my: 50%;
 *     background-image: radial-gradient(
 *       circle at var(--mx) var(--my),
 *       rgba(201,162,39,.08) 0%, transparent 55%
 *     ),
 *     repeating-linear-gradient(0deg, transparent, transparent 39px,
 *       rgba(201,162,39,.06) 40px),
 *     repeating-linear-gradient(90deg, transparent, transparent 39px,
 *       rgba(201,162,39,.06) 40px);
 *   }
 */
function initInfiniteGrids() {
  document.querySelectorAll('.section-grid-reveal').forEach(function (section) {

    /* -- Mouse-reveal ------------------------------------------------------ */
    section.addEventListener('mousemove', function (e) {
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      section.style.setProperty('--mx', x + '%');
      section.style.setProperty('--my', y + '%');
    });

    /* -- Animated grid drift (opt-in) -------------------------------------- */
    if (section.classList.contains('section-grid-animated')) {
      let offset = 0;

      (function animateGrid() {
        offset += 0.1;
        section.style.backgroundPosition = offset * 0.5 + 'px ' + offset * 0.3 + 'px';
        requestAnimationFrame(animateGrid);
      }());
    }
  });
}


/* =========================================================================
   3. ZOOM PARALLAX
   ========================================================================= */

/**
 * Scroll-driven zoom parallax effect.
 *
 * Markup pattern:
 *
 *   <div class="zoom-parallax-container">
 *     <div class="zoom-parallax-layer"> ... </div>
 *     <div class="zoom-parallax-layer"> ... </div>
 *     <!-- … more layers … -->
 *   </div>
 *
 * Each layer is scaled from 1× (top of viewport) up to its maxScale
 * (layer exits viewport bottom), giving the illusion of the scene
 * rushing towards the viewer as the user scrolls through.
 *
 * Max-scale sequence per layer index: [1, 4, 5, 6, 5, 6, 8, 9]
 * (repeats cyclically for more than 8 layers).
 */
function initZoomParallax() {
  const containers = document.querySelectorAll('.zoom-parallax-container');
  if (!containers.length) return;

  /* Track which containers are in the viewport to skip off-screen work */
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target._zpActive = entry.isIntersecting;
    });
  }, { threshold: 0 });

  containers.forEach(function (c) { observer.observe(c); });

  const MAX_SCALES = [1, 4, 5, 6, 5, 6, 8, 9];

  function updateParallax() {
    containers.forEach(function (container) {
      if (!container._zpActive) return;

      const rect     = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;

      /* progress: 0 = container top just hit viewport top,
                   1 = container bottom just hit viewport bottom */
      const progress = scrollable > 0
        ? Math.max(0, Math.min(1, -rect.top / scrollable))
        : 0;

      container.querySelectorAll('.zoom-parallax-layer').forEach(function (layer, i) {
        const maxScale = MAX_SCALES[i % MAX_SCALES.length];
        const scale    = 1 + (maxScale - 1) * progress;
        layer.style.transform = 'scale(' + scale + ')';
      });
    });

    requestAnimationFrame(updateParallax);
  }

  requestAnimationFrame(updateParallax);
}


/* =========================================================================
   4. FLOATING HERO SHAPES
   ========================================================================= */

/**
 * Staggered entry animation followed by an infinite floating loop for
 * decorative shapes inside .hero-shapes containers.
 *
 * Markup pattern:
 *
 *   <div class="hero-shapes">
 *     <div class="hero-shape"
 *          data-rotate="12"
 *          data-opacity="0.10"> … </div>
 *     <!-- … more shapes … -->
 *   </div>
 *
 * data-rotate  (number, degrees)  — final resting rotation angle.
 * data-opacity (number, 0–1)      — final resting opacity.
 *
 * Animation timeline per shape (index i):
 *   t = (i × 200) + 300 ms  — entry transition begins
 *   t = (i × 200) + 2700 ms — floating loop begins (after entry settles)
 */
function initHeroShapes() {
  document.querySelectorAll('.hero-shapes').forEach(function (container) {
    const shapes = container.querySelectorAll('.hero-shape');

    shapes.forEach(function (shape, i) {
      const rotate  = parseFloat(shape.dataset.rotate  || '0');
      const opacity = shape.dataset.opacity || '0.12';

      /* --- Initial hidden state ------------------------------------------ */
      shape.style.opacity   = '0';
      shape.style.transform = 'rotate(' + (rotate - 15) + 'deg) translateY(-50px)';

      /* --- Entry animation ------------------------------------------------ */
      const entryDelay = (i * 200) + 300;
      setTimeout(function () {
        shape.style.transition = [
          'opacity 1.2s ease',
          'transform 2.4s cubic-bezier(0.23, 0.86, 0.39, 0.96)'
        ].join(', ');
        shape.style.opacity   = opacity;
        shape.style.transform = 'rotate(' + rotate + 'deg) translateY(0)';
      }, entryDelay);

      /* --- Floating loop (starts after entry settles) -------------------- */
      const floatDelay = (i * 200) + 2700;
      setTimeout(function () {
        let y   = 0;
        let dir = 1;

        /* Remove the transition so the float is smooth without fighting CSS */
        shape.style.transition = 'opacity 1.2s ease';

        (function float() {
          y += dir * 0.05;
          if (Math.abs(y) > 15) dir *= -1;
          shape.style.marginTop = y + 'px';
          requestAnimationFrame(float);
        }());
      }, floatDelay);
    });
  });
}


/* =========================================================================
   5. INITIALISE ALL EFFECTS ON DOM READY
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* Grid reveal on all qualifying sections */
  initInfiniteGrids();

  /* Scroll-zoom parallax layers */
  initZoomParallax();

  /* Hero shape entry + float animations */
  initHeroShapes();
  /* Wave spheres are initialised from page-specific JS only on pages that need that canvas effect. */
});
