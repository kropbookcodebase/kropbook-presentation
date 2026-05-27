/**
 * KROPBOOK — Admin Panel
 * User management and access log.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Guard ─────────────────────────────────────────────────── */
  const currentUser = window.KbCurrentUser;
  if (!currentUser || currentUser.role !== 'admin') {
    window.location.replace('overview.html');
    return;
  }

  /* ── Topbar ─────────────────────────────────────────────────── */
  const topbarUser = document.getElementById('admin-topbar-username');
  if (topbarUser) topbarUser.textContent = currentUser.username;

  /* ── DOM refs — declare ALL before calling any render function */
  const usersTableBody  = document.getElementById('users-tbody');
  const addUserForm     = document.getElementById('add-user-form');
  const addUserMsg      = document.getElementById('add-user-msg');
  const logTableBody    = document.getElementById('log-tbody');
  const clearLogBtn     = document.getElementById('clear-log-btn');
  const registryPre     = document.getElementById('registry-pre');
  const exportRegBtn    = document.getElementById('export-registry-btn');
  const tabs            = document.querySelectorAll('[data-tab]');
  const panels          = document.querySelectorAll('[data-panel]');

  /* ── Tabs ────────────────────────────────────────────────────── */
  function showTab(name) {
    tabs.forEach(t => t.classList.toggle('admin-tab-active', t.dataset.tab === name));
    panels.forEach(p => { p.hidden = p.dataset.panel !== name; });
    if (name === 'users')    renderUsers();
    if (name === 'log')      renderLog();
    if (name === 'registry') renderRegistry();
  }

  tabs.forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));

  /* ── Render user table ──────────────────────────────────────── */
  function renderUsers() {
    const users = KbAuth.getUsers();
    usersTableBody.innerHTML = '';

    if (!users.length) {
      usersTableBody.innerHTML = '<tr><td colspan="5" class="admin-empty">No users yet.</td></tr>';
      return;
    }

    users.forEach(user => {
      const isMe = user.id === currentUser.id;
      const tr   = document.createElement('tr');
      tr.className = isMe ? 'admin-row-me' : '';
      tr.innerHTML =
        '<td class="admin-cell-user">' +
          '<span class="admin-username">' + esc(user.username) + '</span>' +
          (isMe ? ' <span class="admin-you-badge">You</span>' : '') +
        '</td>' +
        '<td><span class="admin-role-badge admin-role-' + user.role + '">' + user.role + '</span></td>' +
        '<td>' + (user.active
          ? '<span class="admin-status-on">Active</span>'
          : '<span class="admin-status-off">Inactive</span>') + '</td>' +
        '<td class="admin-cell-date">' + (user.lastLogin ? fmtDate(user.lastLogin) : '—') + '</td>' +
        '<td class="admin-cell-actions">' + (isMe
          ? '<span class="admin-cell-muted">—</span>'
          : '<button class="admin-btn admin-btn-sm admin-btn-toggle" type="button"' +
              ' data-uid="' + user.id + '" data-active="' + user.active + '">' +
              (user.active ? 'Deactivate' : 'Activate') +
            '</button>' +
            '<button class="admin-btn admin-btn-sm admin-btn-pw" type="button"' +
              ' data-uid="' + user.id + '" data-uname="' + esc(user.username) + '">Reset PW</button>' +
            '<button class="admin-btn admin-btn-sm admin-btn-del" type="button"' +
              ' data-uid="' + user.id + '" data-uname="' + esc(user.username) + '">Delete</button>'
        ) + '</td>';
      usersTableBody.appendChild(tr);
    });

    /* Use event delegation on the tbody — survives re-renders */
    usersTableBody.onclick = null; // detach old handler first
    usersTableBody.addEventListener('click', handleTableClick);
  }

  async function handleTableClick(e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.classList.contains('admin-btn-toggle')) {
      const active = btn.dataset.active === 'true';
      KbAuth.setUserActive(btn.dataset.uid, !active);
      renderUsers();
    }

    if (btn.classList.contains('admin-btn-pw')) {
      const pw = prompt('New password for "' + btn.dataset.uname + '" (min 8 characters):');
      if (!pw) return;
      const res = await KbAuth.changePassword(btn.dataset.uid, pw);
      showMsg(addUserMsg, res.ok ? 'Password updated for ' + btn.dataset.uname + '.' : res.error, res.ok ? 'ok' : 'err');
    }

    if (btn.classList.contains('admin-btn-del')) {
      if (!confirm('Permanently delete user "' + btn.dataset.uname + '"?')) return;
      KbAuth.deleteUser(btn.dataset.uid);
      renderUsers();
    }
  }

  /* ── Add user form ──────────────────────────────────────────── */
  addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('new-username').value.trim();
    const password = document.getElementById('new-password').value;
    const role     = document.getElementById('new-role').value;

    if (!username || !password) {
      showMsg(addUserMsg, 'Username and password are required.', 'err');
      return;
    }

    const submitBtn = addUserForm.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding…';

    const result = await KbAuth.addUser(username, password, role);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Add User';

    if (result.ok) {
      showMsg(addUserMsg, '✓ User "' + result.user.username + '" created successfully.', 'ok');
      addUserForm.reset();
      renderUsers();
    } else {
      showMsg(addUserMsg, result.error, 'err');
    }
  });

  /* ── Access log ─────────────────────────────────────────────── */
  function renderLog() {
    const log = KbAuth.getAccessLog();
    logTableBody.innerHTML = '';

    if (!log.length) {
      logTableBody.innerHTML = '<tr><td colspan="4" class="admin-empty">No access events recorded.</td></tr>';
      return;
    }

    log.slice(0, 200).forEach(entry => {
      const tr = document.createElement('tr');
      tr.innerHTML =
        '<td class="admin-cell-date">' + fmtDate(entry.timestamp) + '</td>' +
        '<td>' + esc(entry.username || entry.userId) + '</td>' +
        '<td><span class="admin-action-badge admin-action-' + (entry.action || '') + '">' +
          esc(entry.action || '—') + '</span></td>' +
        '<td class="admin-cell-muted">' + esc(entry.page || '—') + '</td>';
      logTableBody.appendChild(tr);
    });
  }

  clearLogBtn.addEventListener('click', () => {
    if (!confirm('Clear all access log entries? This cannot be undone.')) return;
    KbAuth.clearAccessLog();
    renderLog();
  });

  /* ── User Registry ──────────────────────────────────────────── */
  function renderRegistry() {
    const users = KbAuth.getUsers().map(u => ({
      id:        u.id,
      username:  u.username,
      role:      u.role,
      active:    u.active,
      createdAt: u.createdAt || null,
      lastLogin: u.lastLogin || null
    }));

    const json = JSON.stringify({ exportedAt: new Date().toISOString(), users }, null, 2);
    registryPre.textContent = json;
  }

  exportRegBtn.addEventListener('click', () => {
    const users = KbAuth.getUsers().map(u => ({
      id:        u.id,
      username:  u.username,
      role:      u.role,
      active:    u.active,
      createdAt: u.createdAt || null,
      lastLogin: u.lastLogin || null
    }));

    const payload = JSON.stringify({ exportedAt: new Date().toISOString(), users }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'kb-user-registry.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  /* ── Logout ─────────────────────────────────────────────────── */
  document.getElementById('admin-logout-btn').addEventListener('click', () => {
    KbAuth.logout();
    window.location.replace('login.html');
  });

  /* ── Helpers ─────────────────────────────────────────────────── */
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fmtDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
             ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (_) { return iso || '—'; }
  }

  function showMsg(el, msg, type) {
    el.textContent = msg;
    el.className = 'admin-form-msg admin-form-msg-' + type;
    el.removeAttribute('hidden');
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => el.setAttribute('hidden', ''), 6000);
  }

  /* ── Initial render (AFTER all vars and functions are ready) ── */
  showTab('users');

});
