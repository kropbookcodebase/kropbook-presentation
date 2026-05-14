/**
 * effects.js — Kropbook Agritech Investor Presentation
 *
 * Visual effects library. Pure vanilla JS, no build tools, no frameworks.
 * THREE.js must be loaded via CDN script tag on pages that use initWaveSphere().
 *
 * Exports (global):
 *   initWaveSphere(canvasId)  — THREE.js animated wave sphere
 *   initInfiniteGrids()       — Mouse-reveal grid backgrounds
 *   initZoomParallax()        — Scroll-driven zoom parallax layers
 *   initHeroShapes()          — Floating entry-animated hero shapes
 */

/* =========================================================================
   1. THREE.JS WAVE SPHERE
   ========================================================================= */

/**
 * Initialises a self-animating wave sphere on the given canvas element.
 *
 * Requirements:
 *   - <canvas id="<canvasId>"> must exist in the DOM.
 *   - THREE.js must be present on the global scope (window.THREE).
 *
 * @param {string} canvasId  id of the target <canvas> element.
 * @returns {Function|undefined}  Cleanup function that stops animation and
 *                                releases WebGL resources, or undefined if
 *                                the canvas / THREE was not found.
 */
function initWaveSphere(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof THREE === 'undefined') return;

  /* ---- Renderer --------------------------------------------------------- */
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function getCanvasSize() {
    return { w: canvas.offsetWidth || window.innerWidth, h: canvas.offsetHeight || window.innerHeight };
  }
  const { w: initW, h: initH } = getCanvasSize();
  renderer.setSize(initW, initH);

  /* ---- Scene & Camera --------------------------------------------------- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, initW / initH, 0.1, 100);
  camera.position.z = 3.5;

  /* ---- Shaders ---------------------------------------------------------- */
  const vertexShader = `
    uniform float uTime;
    uniform float uIntensity;
    varying vec3 vNormal;
    varying vec3 vPosition;

    /* --- Simplex 3D noise (Stefan Gustavson, public domain) --- */
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g  = step(x0.yzx, x0.xyz);
      vec3 l  = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857;
      vec3  ns  = n_ * D.wyz - D.xzx;

      vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(
        dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

      vec4 m = max(0.6 - vec4(
        dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m * m, vec4(
        dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }

    void main() {
      vNormal   = normalize(normalMatrix * normal);
      vPosition = position;

      float noise  = snoise(position * 2.0 + uTime * 0.3);
      vec3  newPos = position + normal * noise * uIntensity * 0.15;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uLightPos;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3  lightDir = normalize(uLightPos - vPosition);
      float diffuse  = max(dot(vNormal, lightDir), 0.0);

      /* Fresnel rim */
      vec3  viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

      vec3  color = mix(uColorA, uColorB, diffuse + fresnel * 0.5);
      float alpha = 0.15 + fresnel * 0.4 + diffuse * 0.2;

      gl_FragColor = vec4(color, alpha);
    }
  `;

  /* ---- Geometry & Material ---------------------------------------------- */
  const geometry = new THREE.IcosahedronGeometry(1.65, 64);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    uniforms: {
      uTime:      { value: 0 },
      uIntensity: { value: 1.0 },
      uColorA:    { value: new THREE.Color('#1B4D3E') },
      uColorB:    { value: new THREE.Color('#C9A227') },
      uLightPos:  { value: new THREE.Vector3(2, 2, 2) }
    }
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  /* ---- Mouse interaction ------------------------------------------------ */
  let mouseX = 0;
  let mouseY = 0;

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth)  * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  /* ---- Scroll-driven position + scale ----------------------------------- */
  let targetPosX  = 0;
  let targetPosY  = 0;
  let targetScale = 1;
  let curPosX     = 0;
  let curPosY     = 0;
  let curScale    = 1;

  function onScroll() {
    const scrollY   = window.scrollY;
    const heroH     = window.innerHeight * 0.9;
    const progress  = Math.min(scrollY / heroH, 1);

    /* Arc: 0-30% → drift right; 30-100% → sweep to the left */
    if (progress <= 0.3) {
      const p = progress / 0.3;
      targetPosX  = p * 0.4;
      targetPosY  = -p * 0.1;
      targetScale = 1 - p * 0.12;
    } else {
      const p = (progress - 0.3) / 0.7;
      targetPosX  = 0.4 - p * 3.0;
      targetPosY  = -0.1 - p * 0.3;
      targetScale = 0.88 - p * 0.65;
    }

    /* Fade canvas as sphere retreats */
    canvas.style.opacity = (0.6 - progress * 0.42).toFixed(3);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Resize handler --------------------------------------------------- */
  function handleResize() {
    const { w, h } = getCanvasSize();
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', handleResize);

  /* ---- Animation loop --------------------------------------------------- */
  let animId;

  function animate() {
    animId = requestAnimationFrame(animate);

    material.uniforms.uTime.value += 0.005;

    /* Smooth-follow scroll targets */
    const ease = 0.05;
    curPosX  += (targetPosX  - curPosX)  * ease;
    curPosY  += (targetPosY  - curPosY)  * ease;
    curScale += (targetScale - curScale) * ease;

    mesh.position.x = curPosX;
    mesh.position.y = curPosY;
    mesh.scale.setScalar(Math.max(curScale, 0.05));

    /* Light follows mouse */
    const lp = material.uniforms.uLightPos.value;
    lp.x += (mouseX * 3 - lp.x) * 0.05;
    lp.y += (mouseY * 3 - lp.y) * 0.05;

    mesh.rotation.y += 0.003;
    mesh.rotation.x += 0.001;

    renderer.render(scene, camera);
  }
  animate();

  /* ---- Cleanup ---------------------------------------------------------- */
  return function cleanup() {
    cancelAnimationFrame(animId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', onScroll);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
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

  /*
   * Wave spheres are NOT initialised here because THREE.js is a large CDN
   * dependency that is only included on slides that actually need the sphere.
   *
   * On those pages, add the following after the THREE.js <script> tag:
   *
   *   <script>
   *     document.addEventListener('DOMContentLoaded', function () {
   *       initWaveSphere('wave-sphere');
   *     });
   *   </script>
   *
   * Or call initWaveSphere('wave-sphere') directly from the page's own JS
   * once THREE is confirmed loaded (e.g. in a THREE script onload callback).
   */
});
