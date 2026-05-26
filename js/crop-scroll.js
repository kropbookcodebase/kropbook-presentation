(function () {
  'use strict';

  var STAGE_COUNT = 5;
  var CANVAS_W = 260;
  var CANVAS_H = 420;

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function drawSeed(ctx, progress, cropColor) {
    var t = easeInOut(Math.min(progress / 0.2, 1));
    var x = CANVAS_W / 2;
    var startY = 20;
    var endY = CANVAS_H * 0.72;
    var y = lerp(startY, endY, t);
    ctx.save();
    ctx.fillStyle = '#8B6914';
    ctx.beginPath();
    ctx.ellipse(x, y, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // soil line
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(0, CANVAS_H * 0.72, CANVAS_W, 8);
    ctx.fillStyle = '#8B5E3C';
    ctx.fillRect(0, CANVAS_H * 0.728, CANVAS_W, CANVAS_H * 0.28);
    ctx.restore();
  }

  function drawRain(ctx, progress, cropColor) {
    var t = (progress - 0.2) / 0.2;
    t = Math.max(0, Math.min(t, 1));
    // soil
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(0, CANVAS_H * 0.72, CANVAS_W, 8);
    ctx.fillStyle = '#8B5E3C';
    ctx.fillRect(0, CANVAS_H * 0.728, CANVAS_W, CANVAS_H * 0.28);
    // seed buried
    ctx.fillStyle = 'rgba(139,105,20,0.4)';
    ctx.beginPath();
    ctx.ellipse(CANVAS_W / 2, CANVAS_H * 0.73, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // rain drops
    ctx.strokeStyle = 'rgba(100,180,255,0.7)';
    ctx.lineWidth = 1.5;
    var drops = 14;
    for (var i = 0; i < drops; i++) {
      var dx = (i * 37 + 20) % CANVAS_W;
      var dy = ((i * 53 + t * 200) % (CANVAS_H * 0.7));
      var len = 10 + (i % 3) * 4;
      ctx.beginPath();
      ctx.moveTo(dx, dy);
      ctx.lineTo(dx - 2, dy + len);
      ctx.stroke();
    }
  }

  function drawSprout(ctx, progress, cropColor) {
    var t = (progress - 0.4) / 0.2;
    t = easeInOut(Math.max(0, Math.min(t, 1)));
    // soil
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(0, CANVAS_H * 0.72, CANVAS_W, 8);
    ctx.fillStyle = '#8B5E3C';
    ctx.fillRect(0, CANVAS_H * 0.728, CANVAS_W, CANVAS_H * 0.28);
    // stem
    var stemTop = lerp(CANVAS_H * 0.72, CANVAS_H * 0.55, t);
    ctx.strokeStyle = '#2d7a2d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(CANVAS_W / 2, CANVAS_H * 0.72);
    ctx.lineTo(CANVAS_W / 2, stemTop);
    ctx.stroke();
    // tiny leaves
    if (t > 0.5) {
      var lt = (t - 0.5) * 2;
      ctx.fillStyle = '#3a9c3a';
      ctx.beginPath();
      ctx.ellipse(CANVAS_W / 2 - 12 * lt, stemTop + 5, 10 * lt, 6 * lt, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(CANVAS_W / 2 + 12 * lt, stemTop + 5, 10 * lt, 6 * lt, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawGrowth(ctx, progress, cropColor) {
    var t = (progress - 0.6) / 0.2;
    t = easeInOut(Math.max(0, Math.min(t, 1)));
    // soil
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(0, CANVAS_H * 0.72, CANVAS_W, 8);
    ctx.fillStyle = '#8B5E3C';
    ctx.fillRect(0, CANVAS_H * 0.728, CANVAS_W, CANVAS_H * 0.28);
    // stem
    var stemTop = lerp(CANVAS_H * 0.55, CANVAS_H * 0.25, t);
    ctx.strokeStyle = '#2d7a2d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(CANVAS_W / 2, CANVAS_H * 0.72);
    ctx.lineTo(CANVAS_W / 2, stemTop);
    ctx.stroke();
    // leaves along stem
    var leafCount = Math.floor(t * 3) + 1;
    ctx.fillStyle = '#3a9c3a';
    for (var i = 0; i < leafCount; i++) {
      var lY = CANVAS_H * 0.72 - (i + 1) * (CANVAS_H * 0.47 * t / (leafCount + 1));
      var side = i % 2 === 0 ? -1 : 1;
      ctx.beginPath();
      ctx.ellipse(CANVAS_W / 2 + side * 22, lY, 18, 8, side * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    // sun rays
    if (t > 0.3) {
      var sunT = (t - 0.3) / 0.7;
      ctx.strokeStyle = 'rgba(201,162,39,' + (sunT * 0.6) + ')';
      ctx.lineWidth = 1.5;
      for (var r = 0; r < 8; r++) {
        var angle = (r / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(30 + Math.cos(angle) * 18, 30 + Math.sin(angle) * 18);
        ctx.lineTo(30 + Math.cos(angle) * (28 + sunT * 14), 30 + Math.sin(angle) * (28 + sunT * 14));
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255,220,60,' + (sunT * 0.9) + ')';
      ctx.beginPath();
      ctx.arc(30, 30, 14 * sunT, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawHarvest(ctx, progress, cropColor, isBanyan) {
    var t = (progress - 0.8) / 0.2;
    t = easeInOut(Math.max(0, Math.min(t, 1)));
    // soil
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(0, CANVAS_H * 0.72, CANVAS_W, 8);
    ctx.fillStyle = '#8B5E3C';
    ctx.fillRect(0, CANVAS_H * 0.728, CANVAS_W, CANVAS_H * 0.28);
    // golden glow bg
    var grd = ctx.createRadialGradient(CANVAS_W / 2, CANVAS_H * 0.4, 10, CANVAS_W / 2, CANVAS_H * 0.4, 120 * t);
    grd.addColorStop(0, 'rgba(201,162,39,0.18)');
    grd.addColorStop(1, 'rgba(201,162,39,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H * 0.72);

    if (isBanyan) {
      // Banyan tree: wide canopy + aerial roots
      ctx.strokeStyle = '#5a3e28';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(CANVAS_W / 2, CANVAS_H * 0.72);
      ctx.lineTo(CANVAS_W / 2, CANVAS_H * 0.35);
      ctx.stroke();
      // canopy
      ctx.fillStyle = '#2d6b2d';
      ctx.beginPath();
      ctx.ellipse(CANVAS_W / 2, CANVAS_H * 0.28, lerp(0, 80, t), lerp(0, 45, t), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3a8a3a';
      ctx.beginPath();
      ctx.ellipse(CANVAS_W / 2 - 30 * t, CANVAS_H * 0.33, lerp(0, 45, t), lerp(0, 28, t), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(CANVAS_W / 2 + 30 * t, CANVAS_H * 0.33, lerp(0, 45, t), lerp(0, 28, t), 0, 0, Math.PI * 2);
      ctx.fill();
      // aerial roots
      if (t > 0.5) {
        var rt = (t - 0.5) * 2;
        ctx.strokeStyle = '#8B6914';
        ctx.lineWidth = 2;
        var rootPositions = [-55, -25, 25, 55];
        rootPositions.forEach(function(rx) {
          ctx.beginPath();
          ctx.moveTo(CANVAS_W / 2 + rx * rt, CANVAS_H * 0.38);
          ctx.lineTo(CANVAS_W / 2 + rx * rt * 0.8, CANVAS_H * (0.38 + 0.3 * rt));
          ctx.stroke();
        });
      }
    } else {
      // Regular harvest: full stalk with grain head
      ctx.strokeStyle = '#4a8c2a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(CANVAS_W / 2, CANVAS_H * 0.72);
      ctx.lineTo(CANVAS_W / 2, CANVAS_H * 0.22);
      ctx.stroke();
      // grain head
      var grainColor = cropColor || '#c9a227';
      ctx.fillStyle = grainColor;
      ctx.beginPath();
      ctx.ellipse(CANVAS_W / 2, CANVAS_H * 0.18, 14 * t, 28 * t, 0, 0, Math.PI * 2);
      ctx.fill();
      // leaves
      ctx.fillStyle = '#4a8c2a';
      for (var i = 0; i < 3; i++) {
        var lY = CANVAS_H * 0.55 - i * CANVAS_H * 0.1;
        var side = i % 2 === 0 ? -1 : 1;
        ctx.beginPath();
        ctx.ellipse(CANVAS_W / 2 + side * 24 * t, lY, 20 * t, 8 * t, side * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // sun
    ctx.fillStyle = 'rgba(255,220,60,0.85)';
    ctx.beginPath();
    ctx.arc(30, 30, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  function renderFrame(ctx, progress, cropType) {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    var isBanyan = cropType === 'banyan';
    var cropColor = cropType === 'tomato' ? '#e03030' : '#c9a227';

    // sky gradient
    var sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H * 0.72);
    if (progress < 0.4) {
      sky.addColorStop(0, '#1a2a3a');
      sky.addColorStop(1, '#2a3a4a');
    } else if (progress < 0.6) {
      sky.addColorStop(0, '#2a3a4a');
      sky.addColorStop(1, '#3a5a4a');
    } else {
      sky.addColorStop(0, '#c8e8f0');
      sky.addColorStop(1, '#a8d8b0');
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H * 0.72);

    if (progress <= 0.2) {
      drawSeed(ctx, progress, cropColor);
    } else if (progress <= 0.4) {
      drawSeed(ctx, 0.2, cropColor);
      drawRain(ctx, progress, cropColor);
    } else if (progress <= 0.6) {
      drawSprout(ctx, progress, cropColor);
    } else if (progress <= 0.8) {
      drawGrowth(ctx, progress, cropColor);
    } else {
      drawGrowth(ctx, 0.8, cropColor);
      drawHarvest(ctx, progress, cropColor, isBanyan);
    }
  }

  function initCropAnchor(anchor) {
    var cropType = anchor.getAttribute('data-crop') || 'wheat';
    var wrapper = document.createElement('div');
    wrapper.className = 'crop-scroll-panel';
    var canvas = document.createElement('canvas');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    canvas.className = 'crop-scroll-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    wrapper.appendChild(canvas);
    anchor.appendChild(wrapper);

    var ctx = canvas.getContext('2d');
    renderFrame(ctx, 0, cropType);

    var scrollZoneHeight = Math.max(anchor.offsetHeight, 600);

    function update() {
      var rect = anchor.getBoundingClientRect();
      var total = scrollZoneHeight;
      var passed = -rect.top;
      var progress = Math.max(0, Math.min(passed / total, 1));
      renderFrame(ctx, progress, cropType);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var anchors = document.querySelectorAll('.crop-scroll-anchor');
    anchors.forEach(initCropAnchor);
  });
})();
