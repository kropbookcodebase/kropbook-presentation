const CACHE_NAME = 'kropbook-v1';
const PRECACHE_URLS = [
  '../html/overview.html',
  '../html/finance.html',
  '../html/funding.html',
  '../html/corporate-profile.html',
  '../html/team.html',
  '../html/founder.html',
  '../html/kropbook.html',
  '../css/global.css',
  '../css/navbar.css',
  '../js/shared.js',
  '../js/animations.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // Skip cross-origin
  if (url.origin !== self.location.origin) return;
  // Skip PDF files - too large to cache efficiently
  if (url.pathname.endsWith('.pdf')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request).then(response => {
          if (response && response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    )
  );
});
