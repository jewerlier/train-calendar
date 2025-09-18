self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('workouts-v2').then(cache => cache.addAll([
      '/',
      '/index.html',
      '/manifest.webmanifest',
      '/icon-192.png',
      '/icon-512.png',
      '/favicon.ico'
    ]))
  );
  self.skipWaiting(); // Заставляет новый SW активироваться сразу
});

self.addEventListener('activate', e => {
  const cacheWhitelist = ['workouts-v2'];
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Удаляет старые кэши
          }
        })
      );
    }).then(() => self.clients.claim()) // Активирует SW для всех клиентов
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});