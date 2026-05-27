/**
 * KROPBOOK — Auth Gate
 * Synchronous page-guard. Placed in <head> so unauthenticated users
 * are redirected before any page content renders.
 * No external dependencies — fully self-contained.
 */
(function () {
  'use strict';

  var STORE   = 'kb_auth';
  var SESSION = 'kb_session';
  var path    = window.location.pathname;

  // Login page never needs a gate
  if (path.indexOf('login.html') !== -1) return;

  function bounce() {
    sessionStorage.removeItem(SESSION);
    var ret = encodeURIComponent(window.location.href);
    window.location.replace('login.html?return=' + ret);
  }

  // Fast synchronous token check
  var token;
  try { token = sessionStorage.getItem(SESSION); } catch (e) { bounce(); return; }
  if (!token) { bounce(); return; }

  var raw;
  try { raw = localStorage.getItem(STORE); } catch (e) { bounce(); return; }
  if (!raw) { bounce(); return; }

  var store;
  try { store = JSON.parse(raw); } catch (e) { bounce(); return; }

  var now  = Date.now();
  var sess = null;
  var sessions = store.sessions || [];
  for (var i = 0; i < sessions.length; i++) {
    if (sessions[i].token === token && sessions[i].expiresAt > now) {
      sess = sessions[i]; break;
    }
  }
  if (!sess) { bounce(); return; }

  var user = null;
  var users = store.users || [];
  for (var j = 0; j < users.length; j++) {
    if (users[j].id === sess.userId && users[j].active) {
      user = users[j]; break;
    }
  }
  if (!user) { bounce(); return; }

  // Admin panel is admin-only
  if (path.indexOf('admin.html') !== -1 && user.role !== 'admin') {
    window.location.replace('overview.html');
    return;
  }

  // Expose current user for page scripts
  window.KbCurrentUser = user;

  // Inject auth bar after DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.createElement('div');
    bar.className = 'kb-auth-bar';
    bar.setAttribute('role', 'status');
    bar.setAttribute('aria-label', 'Logged in as ' + user.username);

    bar.innerHTML =
      '<span class="kb-auth-bar-user">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
        user.username +
        (user.role === 'admin' ? ' <em class="kb-auth-role">admin</em>' : '') +
      '</span>' +
      (user.role === 'admin'
        ? '<a href="admin.html" class="kb-auth-bar-link">Admin Panel</a>'
        : '') +
      '<button class="kb-auth-bar-btn" id="kb-signout-btn" type="button">Sign Out</button>';

    document.body.appendChild(bar);

    document.getElementById('kb-signout-btn').addEventListener('click', function () {
      try {
        var t = sessionStorage.getItem(SESSION);
        if (t) {
          var r = localStorage.getItem(STORE);
          if (r) {
            var s = JSON.parse(r);
            s.sessions = (s.sessions || []).filter(function (x) { return x.token !== t; });
            localStorage.setItem(STORE, JSON.stringify(s));
          }
          sessionStorage.removeItem(SESSION);
        }
      } catch (err) {}
      window.location.replace('login.html');
    });
  });

}());
