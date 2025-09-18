self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('workouts-v6').then(cache => {
      console.log('Caching files');
      return cache.addAll([
        './',
        './index.html',
        './manifest.webmanifest',
        './icon-192.png',
        './icon-512.png',
        'https://cdn.tailwindcss.com',
        './favicon.ico'
      ]).catch(err => console.error('Cache addAll error:', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('Service Worker activating');
  const cacheWhitelist = ['workouts-v6'];
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker claiming clients');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', e => {
  console.log('Fetch:', e.request.url);
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) {
        console.log('Serving from cache:', e.request.url);
        return response;
      }
      return fetch(e.request).catch(err => {
        console.error('Fetch error:', err);
        return caches.match('./index.html');
      });
    })
  );
});