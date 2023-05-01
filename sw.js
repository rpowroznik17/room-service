var cacheName = 'hello-pwa';
var filesToCache = [
  './',
  './index.html',
  './404.html',
  './sos.html',
  './src/main.js',
  './src/App.vue',
  './src/router/index.js',
  './src/views/CreateOffer.vue',
  './src/views/Home.vue',
  './src/views/Login.vue',
  './src/views/Menu.vue',
  './src/views/OfferDetails.vue',
  './src/views/Offers.vue',
  './src/views/Register.vue'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});