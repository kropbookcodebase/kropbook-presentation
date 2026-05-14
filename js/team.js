/**
 * KROPBOOK — TEAM PAGE JS
 * Page 05: team.html
 * - Org chart SVG connector lines
 * - Node stagger animation (top-down)
 * - Card hover micro-effects
 * - Board card tilt
 */

/* ── Wait for DOM ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initOrgChart();
  initOrgNodeAnimations();
  initCardHoverEffects();
  initBoardCardTilt();
  initLegalCardHover();
});

/* ══════════════════════════════════════════════════════════════
   ORG CHART — SVG CONNECTOR LINES
   ══════════════════════════════════════════════════════════ */

function initOrgChart() {
  const svg = document.getElementById('org-svg');
  if (!svg) return;

  // Draw lines once chart scrolls into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Small delay to let CSS positions settle
        requestAnimationFrame(() => {
          setTimeout(() => drawOrgLines(svg), 400);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const chart = document.getElementById('org-chart-visual');
  if (chart) observer.observe(chart);
}

function getNodeCenter(el) {
  const svgEl = document.getElementById('org-svg');
  if (!svgEl || !el) return null;
  const svgRect = svgEl.getBoundingClientRect();
  const nodeRect = el.getBoundingClientRect();
  return {
    x: nodeRect.left - svgRect.left + nodeRect.width / 2,
    y: nodeRect.top - svgRect.top + nodeRect.height / 2,
    top: nodeRect.top - svgRect.top,
    bottom: nodeRect.bottom - svgRect.top,
    left: nodeRect.left - svgRect.left,
    right: nodeRect.right - svgRect.left,
    width: nodeRect.width,
    height: nodeRect.height,
  };
}

function createLine(svg, x1, y1, x2, y2, isGold, delay) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.classList.add('org-connector-line');
  if (isGold) line.classList.add('gold');

  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  line.style.strokeDasharray = length;
  line.style.strokeDashoffset = length;

  svg.appendChild(line);

  setTimeout(() => {
    line.style.transition = 'stroke-dashoffset 0.6s ease-out';
    line.style.strokeDashoffset = '0';
  }, delay);

  return line;
}

function createPath(svg, pathData, isGold, delay) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  path.classList.add('org-connector-line');
  if (isGold) path.classList.add('gold');
  path.style.strokeDasharray = '2000';
  path.style.strokeDashoffset = '2000';

  svg.appendChild(path);

  setTimeout(() => {
    path.style.transition = 'stroke-dashoffset 0.9s ease-out';
    path.style.strokeDashoffset = '0';
  }, delay);

  return path;
}

function drawOrgLines(svg) {
  svg.innerHTML = ''; // clear previous

  const ceoNode = document.querySelector('[data-org-id="ceo"]');
  const kiranNode = document.querySelector('[data-org-id="kiran"]');
  const kunalNode = document.querySelector('[data-org-id="kunal"]');
  const kanifNode = document.querySelector('[data-org-id="kanif"]');
  const bharatNode = document.querySelector('[data-org-id="bharat"]');

  const tier3Nodes = document.querySelectorAll('.org-tier-3 .org-node');
  const tier4Nodes = document.querySelectorAll('.org-tier-4 .org-node');
  const tier5Nodes = document.querySelectorAll('.org-tier-5 .org-node');

  if (!ceoNode) return;

  const ceo = getNodeCenter(ceoNode);
  const dir2Nodes = [kiranNode, kunalNode, kanifNode, bharatNode].filter(Boolean);
  const dir2Centers = dir2Nodes.map(getNodeCenter).filter(Boolean);

  if (!ceo || dir2Centers.length === 0) return;

  let delay = 100;

  // ── CEO → Tier 2 directors ────────────────────────────────
  // Vertical from CEO bottom
  const ceoBottom = { x: ceo.x, y: ceo.bottom };

  // Midpoint for branch
  const tier2Top = dir2Centers[0].top;
  const midY = ceoBottom.y + (tier2Top - ceoBottom.y) * 0.5;

  // Vertical down from CEO to mid
  createLine(svg, ceoBottom.x, ceoBottom.y, ceoBottom.x, midY, true, delay);
  delay += 120;

  if (dir2Centers.length > 1) {
    // Horizontal bar at midY
    const leftX = Math.min(...dir2Centers.map(d => d.x));
    const rightX = Math.max(...dir2Centers.map(d => d.x));
    createLine(svg, leftX, midY, rightX, midY, false, delay);
    delay += 120;

    // Vertical drops to each director
    dir2Centers.forEach((dir, i) => {
      createLine(svg, dir.x, midY, dir.x, dir.top, false, delay + i * 60);
    });
    delay += dir2Centers.length * 60 + 100;
  } else if (dir2Centers.length === 1) {
    createLine(svg, ceoBottom.x, midY, dir2Centers[0].x, dir2Centers[0].top, false, delay);
    delay += 120;
  }

  // ── Tier 2 → Tier 3 (via collective midpoint) ────────────
  const tier3Centers = Array.from(tier3Nodes).map(getNodeCenter).filter(Boolean);
  if (tier3Centers.length > 0 && dir2Centers.length > 0) {
    // Use the midpoint of all tier-2 bottoms
    const avgDir2Bottom = dir2Centers.reduce((sum, d) => sum + d.bottom, 0) / dir2Centers.length;
    const avgDir2X = dir2Centers.reduce((sum, d) => sum + d.x, 0) / dir2Centers.length;
    const tier3Top = tier3Centers[0].top;
    const mid2Y = avgDir2Bottom + (tier3Top - avgDir2Bottom) * 0.5;

    // Vertical drops from each tier2 down
    dir2Centers.forEach((dir, i) => {
      createLine(svg, dir.x, dir.bottom, dir.x, mid2Y, false, delay + i * 40);
    });
    delay += dir2Centers.length * 40 + 80;

    // Horizontal collection bar
    const t3LeftX = Math.min(...tier3Centers.map(d => d.x));
    const t3RightX = Math.max(...tier3Centers.map(d => d.x));
    const clampedLeft = Math.min(t3LeftX, Math.min(...dir2Centers.map(d => d.x)));
    const clampedRight = Math.max(t3RightX, Math.max(...dir2Centers.map(d => d.x)));
    createLine(svg, clampedLeft, mid2Y, clampedRight, mid2Y, false, delay);
    delay += 100;

    // Vertical drops to tier 3 nodes
    tier3Centers.forEach((t3, i) => {
      createLine(svg, t3.x, mid2Y, t3.x, t3.top, false, delay + i * 50);
    });
    delay += tier3Centers.length * 50 + 100;
  }

  // ── Tier 3 → Tier 4 ──────────────────────────────────────
  const tier4Centers = Array.from(tier4Nodes).map(getNodeCenter).filter(Boolean);
  if (tier4Centers.length > 0 && tier3Centers.length > 0) {
    const avgT3Bottom = tier3Centers.reduce((sum, d) => sum + d.bottom, 0) / tier3Centers.length;
    const tier4Top = tier4Centers[0].top;
    const mid3Y = avgT3Bottom + (tier4Top - avgT3Bottom) * 0.5;

    // Vertical from avg tier3 down
    const avgT3X = tier3Centers.reduce((sum, d) => sum + d.x, 0) / tier3Centers.length;
    createLine(svg, avgT3X, avgT3Bottom, avgT3X, mid3Y, false, delay);
    delay += 80;

    // Horizontal bar
    const t4Left = Math.min(...tier4Centers.map(d => d.x));
    const t4Right = Math.max(...tier4Centers.map(d => d.x));
    createLine(svg, t4Left, mid3Y, t4Right, mid3Y, false, delay);
    delay += 100;

    // Vertical drops to tier 4
    tier4Centers.forEach((t4, i) => {
      createLine(svg, t4.x, mid3Y, t4.x, t4.top, false, delay + i * 50);
    });
    delay += tier4Centers.length * 50 + 100;
  }

  // ── Tier 4 → Tier 5 ──────────────────────────────────────
  const tier5Centers = Array.from(tier5Nodes).map(getNodeCenter).filter(Boolean);
  if (tier5Centers.length > 0 && tier4Centers.length > 0) {
    const avgT4Bottom = tier4Centers.reduce((sum, d) => sum + d.bottom, 0) / tier4Centers.length;
    const tier5Top = tier5Centers[0].top;
    const mid4Y = avgT4Bottom + (tier5Top - avgT4Bottom) * 0.5;

    const avgT4X = tier4Centers.reduce((sum, d) => sum + d.x, 0) / tier4Centers.length;
    createLine(svg, avgT4X, avgT4Bottom, avgT4X, mid4Y, false, delay);
    delay += 80;

    const t5Left = Math.min(...tier5Centers.map(d => d.x));
    const t5Right = Math.max(...tier5Centers.map(d => d.x));
    createLine(svg, t5Left, mid4Y, t5Right, mid4Y, false, delay);
    delay += 80;

    tier5Centers.forEach((t5, i) => {
      createLine(svg, t5.x, mid4Y, t5.x, t5.top, false, delay + i * 60);
    });
  }
}

/* ══════════════════════════════════════════════════════════════
   ORG NODE STAGGER ANIMATIONS (top-down)
   ══════════════════════════════════════════════════════════ */

function initOrgNodeAnimations() {
  // The .anim-hidden on each node is handled by animations.js IntersectionObserver.
  // Here we add extra top-down stagger for the org chart tiers.
  const tiers = document.querySelectorAll('.org-tier');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const tier = entry.target;
        const nodes = tier.querySelectorAll('.org-node');
        nodes.forEach((node, i) => {
          setTimeout(() => {
            node.style.opacity = '1';
            node.style.transform = 'translateY(0)';
          }, i * 80);
        });
        observer.unobserve(tier);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  tiers.forEach(tier => {
    const nodes = tier.querySelectorAll('.org-node');
    nodes.forEach(node => {
      // Only add initial hidden state if not already handled
      if (!node.classList.contains('anim-hidden')) {
        node.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      }
    });
    observer.observe(tier);
  });
}

/* ══════════════════════════════════════════════════════════════
   CARD HOVER EFFECTS
   ══════════════════════════════════════════════════════════ */

function initCardHoverEffects() {
  // Ops cards: avatar color shift
  document.querySelectorAll('.ops-card').forEach(card => {
    const avatar = card.querySelector('.ops-avatar');
    if (!avatar) return;

    card.addEventListener('mouseenter', () => {
      avatar.style.background = 'rgba(201,162,39,0.12)';
      avatar.style.color = '#C9A227';
    });
    card.addEventListener('mouseleave', () => {
      avatar.style.background = '';
      avatar.style.color = '';
    });
  });

  // Legal cards: icon transition
  document.querySelectorAll('.legal-card').forEach(card => {
    const icon = card.querySelector('.legal-icon-wrap');
    if (!icon) return;

    card.addEventListener('mouseenter', () => {
      icon.style.background = 'rgba(201,162,39,0.1)';
      icon.style.color = '#C9A227';
    });
    card.addEventListener('mouseleave', () => {
      icon.style.background = '';
      icon.style.color = '';
    });
  });

  // Org nodes: highlight on hover
  document.querySelectorAll('.org-node').forEach(node => {
    node.addEventListener('mouseenter', () => {
      node.style.zIndex = '10';
    });
    node.addEventListener('mouseleave', () => {
      node.style.zIndex = '';
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   BOARD CARD 3D TILT
   ══════════════════════════════════════════════════════════ */

function initBoardCardTilt() {
  document.querySelectorAll('.board-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((y - centerY) / centerY) * -4;
      const rotY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, border-color 0.3s, box-shadow 0.3s';
      setTimeout(() => {
        card.style.transition = '';
      }, 400);
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   LEGAL CARD HOVER — name highlight
   ══════════════════════════════════════════════════════════ */

function initLegalCardHover() {
  document.querySelectorAll('.legal-card').forEach(card => {
    const name = card.querySelector('.legal-card-name');
    if (!name) return;

    card.addEventListener('mouseenter', () => {
      name.style.color = 'var(--brand-green)';
    });
    card.addEventListener('mouseleave', () => {
      name.style.color = '';
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   WINDOW RESIZE — Redraw SVG lines
   ══════════════════════════════════════════════════════════ */

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const svg = document.getElementById('org-svg');
    if (svg) drawOrgLines(svg);
  }, 250);
});
