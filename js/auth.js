/**
 * KROPBOOK — Auth Library
 * Handles login, logout, user management, and session tokens.
 * Client-side only — uses localStorage + SubtleCrypto (built-in).
 */

var KbAuth = (function () {
  'use strict';

  var STORE       = 'kb_auth';
  var SESSION     = 'kb_session';
  var SALT        = 'kb_kropbook_2025_pepper';
  var SESSION_TTL = 8 * 60 * 60 * 1000;  // 8 h
  var MAX_TRIES   = 5;
  var LOCKOUT_MS  = 15 * 60 * 1000;       // 15 min

  // ── Persistence ───────────────────────────────────────────────

  function getStore() {
    try {
      var raw = localStorage.getItem(STORE);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  function saveStore(store) {
    try { localStorage.setItem(STORE, JSON.stringify(store)); } catch (_) {}
  }

  function blank() {
    return { users: [], sessions: [], loginAttempts: {}, accessLog: [] };
  }

  // ── Crypto ────────────────────────────────────────────────────

  async function hashPassword(password) {
    var enc  = new TextEncoder();
    var data = enc.encode(password + SALT);
    var buf  = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf))
      .map(function (b) { return b.toString(16).padStart(2, '0'); })
      .join('');
  }

  function generateToken() {
    var arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  // ── First-run init ────────────────────────────────────────────

  async function ensureInitialised() {
    var store = getStore();
    if (store && store.users && store.users.length > 0) return;
    store = store || blank();
    var hash = await hashPassword('Kropbook@2025');
    store.users = [{
      id:           'usr_admin_default',
      username:     'admin',
      passwordHash: hash,
      role:         'admin',
      createdAt:    new Date().toISOString(),
      lastLogin:    null,
      active:       true
    }];
    saveStore(store);
  }

  // ── Session helpers ───────────────────────────────────────────

  function getSession() {
    try {
      var token = sessionStorage.getItem(SESSION);
      if (!token) return null;
      var store = getStore();
      if (!store) return null;
      var now = Date.now();
      var found = (store.sessions || []).find(function (s) {
        return s.token === token && s.expiresAt > now;
      });
      return found || null;
    } catch (_) { return null; }
  }

  function getCurrentUser() {
    var sess = getSession();
    if (!sess) return null;
    var store = getStore();
    if (!store) return null;
    return (store.users || []).find(function (u) {
      return u.id === sess.userId && u.active;
    }) || null;
  }

  function isLoggedIn() {
    return getCurrentUser() !== null;
  }

  function logout() {
    try {
      var token = sessionStorage.getItem(SESSION);
      if (token) {
        var store = getStore();
        if (store) {
          store.sessions = (store.sessions || []).filter(function (s) { return s.token !== token; });
          saveStore(store);
        }
      }
    } catch (_) {}
    sessionStorage.removeItem(SESSION);
  }

  // ── Login ─────────────────────────────────────────────────────

  async function login(username, password) {
    var store = getStore();
    if (!store) return { ok: false, error: 'System not initialised — refresh the page.' };

    var attempts = (store.loginAttempts || {})[username] || { count: 0, lockedUntil: 0 };
    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
      var mins = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
      return { ok: false, error: 'Account locked. Try again in ' + mins + ' minute(s).' };
    }

    var user = (store.users || []).find(function (u) { return u.username === username && u.active; });
    var hash = await hashPassword(password);

    if (!user || hash !== user.passwordHash) {
      var newCount    = (attempts.count || 0) + 1;
      var lockedUntil = newCount >= MAX_TRIES ? Date.now() + LOCKOUT_MS : 0;
      store.loginAttempts = store.loginAttempts || {};
      store.loginAttempts[username] = { count: newCount, lockedUntil: lockedUntil };
      saveStore(store);
      if (lockedUntil) return { ok: false, error: 'Too many failed attempts. Account locked for 15 minutes.' };
      var remaining = MAX_TRIES - newCount;
      return { ok: false, error: 'Invalid credentials. ' + remaining + ' attempt(s) remaining.' };
    }

    // Success — reset attempts
    store.loginAttempts = store.loginAttempts || {};
    store.loginAttempts[username] = { count: 0, lockedUntil: 0 };

    // Create session, prune expired ones
    var token = generateToken();
    var now   = Date.now();
    store.sessions = (store.sessions || []).filter(function (s) { return s.expiresAt > now; });
    store.sessions.push({ token: token, userId: user.id, createdAt: now, expiresAt: now + SESSION_TTL });

    // Record last login
    user.lastLogin = new Date().toISOString();

    // Access log
    store.accessLog = store.accessLog || [];
    store.accessLog.unshift({
      userId:    user.id,
      username:  user.username,
      action:    'login',
      timestamp: new Date().toISOString()
    });
    if (store.accessLog.length > 500) store.accessLog = store.accessLog.slice(0, 500);

    saveStore(store);
    sessionStorage.setItem(SESSION, token);
    return { ok: true, user: user };
  }

  // ── User management (admin only) ──────────────────────────────

  async function addUser(username, password, role) {
    var store = getStore();
    if (!store) return { ok: false, error: 'Store unavailable.' };
    username = username.trim().toLowerCase();
    if (!username || username.length < 3) return { ok: false, error: 'Username must be at least 3 characters.' };
    if (!password || password.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' };
    if ((store.users || []).find(function (u) { return u.username === username; })) {
      return { ok: false, error: 'Username already exists.' };
    }
    var hash = await hashPassword(password);
    var newUser = {
      id:           'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      username:     username,
      passwordHash: hash,
      role:         role === 'admin' ? 'admin' : 'viewer',
      createdAt:    new Date().toISOString(),
      lastLogin:    null,
      active:       true
    };
    store.users = store.users || [];
    store.users.push(newUser);
    saveStore(store);
    return { ok: true, user: newUser };
  }

  async function changePassword(userId, newPassword) {
    if (!newPassword || newPassword.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' };
    var store = getStore();
    if (!store) return { ok: false, error: 'Store unavailable.' };
    var user = (store.users || []).find(function (u) { return u.id === userId; });
    if (!user) return { ok: false, error: 'User not found.' };
    user.passwordHash = await hashPassword(newPassword);
    saveStore(store);
    return { ok: true };
  }

  function setUserActive(userId, active) {
    var store = getStore();
    if (!store) return { ok: false };
    var user = (store.users || []).find(function (u) { return u.id === userId; });
    if (!user) return { ok: false };
    user.active = active;
    if (!active) {
      store.sessions = (store.sessions || []).filter(function (s) { return s.userId !== userId; });
    }
    saveStore(store);
    return { ok: true };
  }

  function deleteUser(userId) {
    var store = getStore();
    if (!store) return { ok: false };
    store.users    = (store.users    || []).filter(function (u) { return u.id !== userId; });
    store.sessions = (store.sessions || []).filter(function (s) { return s.userId !== userId; });
    saveStore(store);
    return { ok: true };
  }

  function getUsers() {
    var store = getStore();
    return (store && store.users) ? store.users.slice() : [];
  }

  function getAccessLog() {
    var store = getStore();
    return (store && store.accessLog) ? store.accessLog.slice() : [];
  }

  function clearAccessLog() {
    var store = getStore();
    if (!store) return;
    store.accessLog = [];
    saveStore(store);
  }

  // ── Public API ────────────────────────────────────────────────

  return {
    ensureInitialised: ensureInitialised,
    hashPassword:      hashPassword,
    getSession:        getSession,
    getCurrentUser:    getCurrentUser,
    isLoggedIn:        isLoggedIn,
    login:             login,
    logout:            logout,
    addUser:           addUser,
    changePassword:    changePassword,
    setUserActive:     setUserActive,
    deleteUser:        deleteUser,
    getUsers:          getUsers,
    getAccessLog:      getAccessLog,
    clearAccessLog:    clearAccessLog
  };

}());

window.KbAuth = KbAuth;
