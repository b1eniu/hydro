const CACHE_NAME = 'hydro-v1.2';
const assets = ['./', './index.html', './js/main.js', './js/config.js', './js/api.js', './js/chart.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(assets)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});