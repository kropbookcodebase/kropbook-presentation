/**
 * KROPBOOK — SHARED JS
 * Navbar, Footer injection, Scroll progress, Mobile menu, Modal
 */

/* ── Navbar HTML ───────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: 'Overview', href: 'overview.html' },
  { label: 'Founder', href: 'founder.html' },
  { label: 'Team', href: 'team.html' },
  { label: 'Governance', href: 'governance.html' },
  { label: 'KropBook', href: 'kropbook.html' },
  { label: 'Operations', href: 'business-operations.html' },
  { label: 'Systems', href: 'systems.html' },
  { label: 'Clients', href: 'clients.html' },
  { label: 'Finance', href: 'finance.html' },
  { label: 'Funding', href: 'funding.html' },
  { label: 'Q&A', href: 'strategic-qa.html' },
  { label: 'Credit File', href: 'corporate-profile.html' },
];

function getCurrentPage() {
  const path = window.location.pathname.split('/').pop() || 'overview.html';
  return path;
}

function injectNavbar() {
  const currentPage = getCurrentPage();

  const navLinks = NAV_ITEMS.map((item, i) => {
    const isActive = currentPage === item.href ? 'active' : '';
    const sep = i > 0 ? '<span class="nav-sep">·</span>' : '';
    return `${sep}<a href="${item.href}" class="nav-link ${isActive}">${item.label}<span class="nav-dot"></span></a>`;
  }).join('');

  const html = `
    <!-- Page Blur Overlay -->
    <div class="page-blur-overlay" id="page-blur-overlay"></div>

    <!-- Side Navbar (no hamburger — edge hover only) -->
    <aside class="side-navbar" id="side-navbar" aria-label="Navigation">
      <div class="side-nav-top">
        <img src="../images/kblogo.png" alt="Kropbook" class="side-nav-logo-mark" />
        <span class="side-nav-logo-text">Kropbook</span>
      </div>
      <div class="side-nav-menu">
        ${NAV_ITEMS.map(item => `<a href="${item.href}" class="side-nav-link ${currentPage === item.href ? 'active' : ''}">${item.label}</a>`).join('')}
        <div class="side-nav-sep"></div>
        <a href="financial-statements.html" class="side-nav-link fin-link">Documents ↗</a>
      </div>
    </aside>

    <div class="navbar-wrap" id="navbar">
      <!-- Desktop pill nav -->
      <nav class="navbar">
        <a href="overview.html" class="nav-brand">
          <img src="../images/kblogo.png" alt="Kropbook" />
          <span>Kropbook</span>
        </a>
        ${navLinks}
        <a href="financial-statements.html" class="nav-fin-link">Documents ↗</a>
      </nav>

      <!-- Mobile nav -->
      <div class="navbar-mobile" id="navbar-mobile">
        <a href="overview.html" class="nav-brand nav-brand-mobile">
          <img src="../images/kblogo.png" alt="Kropbook" />
          <span>Kropbook</span>
        </a>
        <button class="hamburger" id="hamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Mobile menu overlay -->
    <div class="mobile-menu" id="mobile-menu">
      ${NAV_ITEMS.map(item => `<a href="${item.href}" class="${currentPage === item.href ? 'active' : ''}">${item.label}</a>`).join('<div class="mobile-sep"></div>')}
      <div class="mobile-sep"></div>
      <a href="financial-statements.html" class="mobile-documents-link">Documents ↗</a>
    </div>
  `;

  const container = document.getElementById('navbar-container');
  if (container) container.innerHTML = html;
  else {
    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.prepend(div);
  }

  setupNavbar();
}

function setupNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // Side Navbar — edge-hover only (no hamburger button)
  const sideNavbar = document.getElementById('side-navbar');
  const pageBlur = document.getElementById('page-blur-overlay');

  if (sideNavbar && pageBlur) {
    // Expand when cursor approaches the left edge of the screen
    document.addEventListener('mousemove', (e) => {
      if (e.clientX < 20) {
        sideNavbar.classList.add('expanded');
        pageBlur.classList.add('active');
      }
    }, { passive: true });

    // Collapse when cursor leaves the navbar (unless returning to the left edge)
    sideNavbar.addEventListener('mouseleave', (e) => {
      if (e.clientX >= 20) {
        sideNavbar.classList.remove('expanded');
        pageBlur.classList.remove('active');
      }
    });
  }

  if (!navbar) return;

  // Hide/show bottom nav on scroll
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (currentY > lastScrollY && currentY > 100) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }
    lastScrollY = currentY;
  }, { passive: true });

  // Mobile hamburger
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }
}

/* ── Footer HTML ───────────────────────────────────────────── */
function injectFooter() {
  const html = `
    <footer class="site-footer">
      <div class="footer-top-line"></div>
      <div class="footer-inner">
        <div class="footer-grid">

          <!-- Column 1: Brand -->
          <div class="footer-brand">
            <div class="footer-logo">
              <img src="../images/kblogo.png" alt="Kropbook Agritech" />
              <div class="footer-logo-text">
                <span class="footer-logo-name">Kropbook</span>
                <span class="footer-logo-sub">Agritech Pvt. Ltd.</span>
              </div>
            </div>
            <p class="footer-desc">
              The Operating System of the Global Food Economy. Building transparent, traceable, and trusted agricultural supply chains from farm to table.
            </p>
            <div class="footer-contact-row">
              <span class="footer-contact-icon">📍</span>
              <span class="footer-contact-text">Vashi, Navi Mumbai, Maharashtra, India</span>
            </div>
            <div class="footer-contact-row">
              <span class="footer-contact-icon">✉</span>
              <span class="footer-contact-text">ceo@kropbook.com</span>
            </div>
          </div>

          <!-- Column 2: Company -->
          <div>
            <p class="footer-col-title">Company</p>
            <ul class="footer-nav-list">
              <li><a href="overview.html">Overview</a></li>
              <li><a href="founder.html">Founder</a></li>
              <li><a href="team.html">Team</a></li>
            </ul>
          </div>

          <!-- Column 3: Platform -->
          <div>
            <p class="footer-col-title">Platform</p>
            <ul class="footer-nav-list">
              <li><a href="kropbook.html">KropBook</a></li>
              <li><a href="business-operations.html">Operations</a></li>
              <li><a href="systems.html">Systems</a></li>
              <li><a href="finance.html">Finance</a></li>
              <li><a href="funding.html">Funding</a></li>
            </ul>
          </div>

          <!-- Column 4: Legal -->
          <div>
            <p class="footer-col-title">Legal</p>
            <ul class="footer-nav-list">
              <li><a href="governance.html">Governance</a></li>
              <li><a href="strategic-qa.html">Q&amp;A</a></li>
              <li><a href="financial-statements.html">Documents ↗</a></li>
            </ul>

          </div>
        </div>

        <!-- Bottom strip -->
        <div class="footer-bottom">
          <p class="footer-copyright">
            &copy; 2025 Kropbook Agritech Private Limited &middot; CIN: U01100PN2018PTC180049
          </p>
          <p class="footer-stamp">Confidential &middot; Not for Public Distribution</p>
        </div>
      </div>
    </footer>
  `;

  const container = document.getElementById('footer-container');
  if (container) container.innerHTML = html;
  else {
    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
  }
}

/* ── Scroll Progress Bar ───────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ── PDF Modal ─────────────────────────────────────────────── */
function openPdfModal(filePath, title) {
  const overlay = document.getElementById('pdf-modal');
  if (!overlay) return;
  const iframe = overlay.querySelector('#pdf-iframe');
  const titleEl = overlay.querySelector('#pdf-modal-title');
  const downloadBtn = overlay.querySelector('#pdf-download');
  if (iframe) iframe.src = filePath;
  if (titleEl) titleEl.textContent = title;
  if (downloadBtn) { downloadBtn.href = filePath; downloadBtn.setAttribute('download', title || 'document'); }
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePdfModal() {
  const overlay = document.getElementById('pdf-modal');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  const iframe = overlay.querySelector('#pdf-iframe');
  if (iframe) iframe.src = '';
}

function injectPdfModal() {
  const html = `
    <div class="modal-overlay" id="pdf-modal" role="dialog" aria-modal="true">
      <div class="modal-box">
        <div class="modal-header">
          <h4 id="pdf-modal-title">Document</h4>
          <button class="modal-close-btn" id="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-toolbar">
          <a id="pdf-download" download class="btn btn-secondary pdf-download-link">⬇ Download</a>
          <span class="pdf-modal-spacer"></span>
          <span class="page-info">PDF Viewer</span>
        </div>
        <div class="modal-body">
          <iframe id="pdf-iframe" title="PDF Document"></iframe>
        </div>
      </div>
    </div>
  `;
  const div = document.createElement('div');
  div.innerHTML = html;
  document.body.appendChild(div.firstElementChild);

  document.getElementById('modal-close').addEventListener('click', closePdfModal);
  document.getElementById('pdf-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('pdf-modal')) closePdfModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePdfModal();
  });
}

function initDocumentTriggers() {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-pdf-path]');
    if (!trigger) return;
    event.preventDefault();
    openPdfModal(trigger.dataset.pdfPath, trigger.dataset.pdfTitle || 'Document');
  });
}

function initLocalScrollTargets() {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-scroll-target]');
    if (!trigger) return;
    const target = document.getElementById(trigger.dataset.scrollTarget);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ── Init all shared ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectNavbar();
  injectFooter();
  initScrollProgress();
  injectPdfModal();
  initDocumentTriggers();
  initLocalScrollTargets();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../service-worker.js').catch(() => {});
  }
});
