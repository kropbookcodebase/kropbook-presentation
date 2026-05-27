/**
 * KROPBOOK — Login Page
 * Handles form submission, rate-limit display, post-login redirect,
 * mouse-grid reveal, and gooey text morphing.
 */

/* ── Mouse-follow grid reveal ──────────────────────────────────── */
(function () {
  const reveal = document.getElementById('login-grid-reveal');
  if (!reveal) return;
  document.addEventListener('mousemove', function (e) {
    reveal.style.setProperty('--mx', e.clientX + 'px');
    reveal.style.setProperty('--my', e.clientY + 'px');
    reveal.classList.add('active');
  });
})();

/* ── Gooey text morphing ───────────────────────────────────────── */
(function () {
  const texts = [
    'Secure Access',
    'Master Credit File',
    'Verified Portal',
    'Agritech Platform',
  ];
  const text1 = document.getElementById('morph-text-a');
  const text2 = document.getElementById('morph-text-b');
  const inner = document.getElementById('login-morph-inner');
  if (!text1 || !text2 || !inner) return;

  inner.style.filter = 'url(#gooey-morph)';

  const MORPH_TIME    = 1.1;
  const COOLDOWN_TIME = 2.2;

  let textIndex = texts.length - 1;
  let then      = performance.now();
  let morph     = 0;
  let cooldown  = COOLDOWN_TIME;

  text1.textContent = texts[textIndex % texts.length];
  text2.textContent = texts[(textIndex + 1) % texts.length];
  text1.style.opacity = '0';
  text2.style.opacity = '1';

  function setMorph(fraction) {
    text2.style.filter  = 'blur(' + Math.min(8 / fraction - 8, 100) + 'px)';
    text2.style.opacity = Math.pow(fraction, 0.4);
    var f1 = 1 - fraction;
    text1.style.filter  = 'blur(' + Math.min(8 / f1 - 8, 100) + 'px)';
    text1.style.opacity = Math.pow(f1, 0.4);
  }

  function doCooldown() {
    morph = 0;
    text2.style.filter  = '';
    text2.style.opacity = '1';
    text1.style.filter  = '';
    text1.style.opacity = '0';
  }

  function tick(now) {
    requestAnimationFrame(tick);
    var dt = (now - then) / 1000;
    then = now;
    var wasInCooldown = cooldown > 0;
    cooldown -= dt;

    if (cooldown <= 0) {
      if (wasInCooldown) {
        textIndex = (textIndex + 1) % texts.length;
        text1.textContent = texts[textIndex % texts.length];
        text2.textContent = texts[(textIndex + 1) % texts.length];
      }
      morph -= cooldown;
      cooldown = 0;
      var fraction = morph / MORPH_TIME;
      if (fraction > 1) {
        cooldown = COOLDOWN_TIME;
        fraction = 1;
      }
      setMorph(fraction);
    } else {
      doCooldown();
    }
  }
  requestAnimationFrame(tick);
})();

document.addEventListener('DOMContentLoaded', async () => {

  // Init default admin on very first visit
  await KbAuth.ensureInitialised();

  // Already logged in — skip login
  if (KbAuth.isLoggedIn()) {
    const params = new URLSearchParams(window.location.search);
    const ret = params.get('return');
    window.location.replace(sanitiseReturn(ret) || 'overview.html');
    return;
  }

  const form      = document.getElementById('login-form');
  const errorEl   = document.getElementById('login-error');
  const submitBtn = document.getElementById('login-submit');
  const userInput = document.getElementById('login-username');
  const passInput = document.getElementById('login-password');
  const toggleBtn = document.getElementById('login-toggle-pass');

  // Password toggle
  if (toggleBtn && passInput) {
    toggleBtn.addEventListener('click', () => {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      toggleBtn.setAttribute('aria-label', isPass ? 'Hide password' : 'Show password');
      toggleBtn.innerHTML = isPass ? eyeOffIcon() : eyeIcon();
    });
  }

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = userInput.value.trim();
    const password = passInput.value;

    if (!username || !password) {
      setError('Please enter your username and password.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in…';
    clearError();

    const result = await KbAuth.login(username, password);

    if (result.ok) {
      const params = new URLSearchParams(window.location.search);
      const ret = params.get('return');
      window.location.replace(sanitiseReturn(ret) || 'overview.html');
    } else {
      setError(result.error);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
      passInput.value = '';
      passInput.focus();
    }
  });

  function setError(msg) {
    errorEl.textContent = msg;
    errorEl.removeAttribute('hidden');
    showBabuRao();
  }

  function clearError() {
    errorEl.textContent = '';
    errorEl.setAttribute('hidden', '');
  }

  /* Babu Rao spring-up on wrong password */
  function showBabuRao() {
    var wrap = document.getElementById('babu-wrap');
    if (!wrap) return;

    /* Reset any running animation cleanly */
    wrap.classList.remove('babu-in', 'babu-out');
    void wrap.offsetWidth; /* force reflow to restart animation */
    wrap.classList.add('babu-in');

    clearTimeout(wrap._exitTimer);
    clearTimeout(wrap._resetTimer);

    wrap._exitTimer = setTimeout(function () {
      wrap.classList.remove('babu-in');
      wrap.classList.add('babu-out');
      wrap._resetTimer = setTimeout(function () {
        wrap.classList.remove('babu-out');
      }, 500);
    }, 3400);
  }

  // Prevent open redirect — only allow same-origin returns
  function sanitiseReturn(url) {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      if (parsed.origin !== window.location.origin) return null;
      return url;
    } catch (_) {
      // relative url — safe
      if (url.startsWith('/') || url.startsWith('.')) return url;
      return null;
    }
  }

  function eyeIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  }

  function eyeOffIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
  }

});
