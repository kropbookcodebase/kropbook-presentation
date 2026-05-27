/**
 * KROPBOOK — Download All as ZIP
 * Fetches every document linked in the #documents section,
 * preserving the folder structure, and downloads a single ZIP.
 */

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-download-all');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    const originalHTML = btn.innerHTML;
    setLabel('Building ZIP…');

    // Collect every <a href> inside the docs lists
    const anchors = Array.from(
      document.querySelectorAll('#documents .docs-list a[href], #documents .docs-list-compact a[href]')
    );

    if (anchors.length === 0) {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      alert('No document links found.');
      return;
    }

    const files = [];
    let done = 0;

    for (const anchor of anchors) {
      const href = anchor.getAttribute('href');
      if (!href) { done++; continue; }

      try {
        const resp = await fetch(href);
        if (!resp.ok) { done++; continue; }
        const buf = await resp.arrayBuffer();
        const zipPath = getZipPath(href);
        files.push({ name: zipPath, data: new Uint8Array(buf) });
      } catch (_) {
        // unreachable file — skip silently
      }

      done++;
      setLabel(done + ' / ' + anchors.length + ' files…');
    }

    if (files.length === 0) {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      alert('No files could be fetched.\nMake sure this page is served from a local web server (not opened as a file:// URL).');
      return;
    }

    setLabel('Packaging…');
    const zipBytes = buildZip(files);
    const blob = new Blob([zipBytes], { type: 'application/zip' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'Kropbook_Master_Credit_File.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    btn.innerHTML = originalHTML;
    btn.disabled  = false;
  });

  // ── Helpers ───────────────────────────────────────────────────

  function setLabel(text) {
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
      '<polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ' +
      text;
  }

  /**
   * Extract the path inside the Master Credit File folder from an href.
   * Preserves sub-folder structure so the ZIP mirrors the original layout.
   * e.g. "../KROPBOOK_...%20Master%20Credit%20File/01_CORP.../cert.pdf"
   *   → "01_CORP.../cert.pdf"
   */
  function getZipPath(href) {
    const decoded = decodeURIComponent(href);
    const marker  = 'Master Credit File/';
    const idx     = decoded.indexOf(marker);
    if (idx !== -1) return decoded.substring(idx + marker.length);
    // Fallback: just the filename
    const parts = decoded.split('/');
    return parts[parts.length - 1] || 'document';
  }

});
