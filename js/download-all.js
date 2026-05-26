document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-download-all');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Building ZIP…';

    // Collect all PDF links from the docs section
    const links = Array.from(document.querySelectorAll('#documents .docs-list a[href]'))
      .map(a => ({ href: a.getAttribute('href'), name: a.textContent.trim() }));

    const files = [];
    let done = 0;
    for (const link of links) {
      try {
        const resp = await fetch(link.href);
        if (!resp.ok) continue;
        const buf = await resp.arrayBuffer();
        // Sanitize filename: keep only safe chars
        const safeName = link.name.replace(/[^a-zA-Z0-9 _\-\.()]/g, '_').trim() + '.pdf';
        files.push({ name: safeName, data: new Uint8Array(buf) });
      } catch (e) { /* skip unreachable */ }
      done++;
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${done}/${links.length} files…`;
    }

    if (files.length === 0) {
      btn.innerHTML = originalText;
      btn.disabled = false;
      alert('No files could be fetched. Make sure this page is served from a web server.');
      return;
    }

    const zipBytes = buildZip(files);
    const blob = new Blob([zipBytes], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Kropbook_Master_Credit_File.zip';
    a.click();
    URL.revokeObjectURL(url);

    btn.innerHTML = originalText;
    btn.disabled = false;
  });
});
