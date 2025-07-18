const CACHE_NAME = 'cache-v11';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/bundle.js',
    '/variables.css',
    '/assets/undraw_reminder.svg',
    '/assets/undraw-meet-the-team.svg',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Cute+Font&family=Quicksand:wght@300;500;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;700&display=swap',
];

const isDevMode = self.location.hostname === 'localhost';


self.addEventListener('install', event => {
  if (isDevMode) {
    return;
  }
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

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
  if (isDevMode) {
    return;
  }

  const url = new URL(event.request.url);

  if (url.pathname.includes('.hot-update.')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
