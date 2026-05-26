(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var wrap = document.getElementById('earth-wrap');
    if (!wrap) return;

    var lastRaf = 0;
    var ticking = false;

    function applyScroll() {
      ticking = false;
      var scrollY = window.scrollY;
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) return;

      var progress = Math.min(scrollY / docH, 1);

      /* Slide right + slight scale down as page scrolls */
      var xShift = progress * 55; /* vw units */
      var scale  = 1 - progress * 0.18;
      var opacity = Math.max(0, 1 - progress * 2.0);

      wrap.style.transform =
        'translateY(-50%) translateX(' + xShift + 'vw) scale(' + scale + ')';
      wrap.style.opacity = opacity;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(applyScroll);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    applyScroll(); /* run once on load */
  });
})();
