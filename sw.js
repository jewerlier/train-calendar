self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('workouts-v1').then(cache => cache.addAll([
      '/',
      '/index.html',
      '/manifest.webmanifest',
    ]))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});