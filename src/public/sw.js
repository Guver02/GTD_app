const CACHE_NAME = 'cache-v2';
const urlsToCache = [
    '/icons',
    '/assets',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Cute+Font&family=Quicksand:wght@300;500;700&display=swap',

    'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;700&display=swap',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
