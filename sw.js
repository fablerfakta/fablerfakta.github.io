// Fabler & Fakta Studio – gör sidan installerbar som app.
// Nät först; startsidan sparas så att appen kan öppnas även utan nät.
var CACHE = 'ff-v2';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(['./']); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (n) { return n !== CACHE; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function (svar) {
    if (e.request.mode === 'navigate' && svar.ok) {
      var kopia = svar.clone();
      caches.open(CACHE).then(function (c) { c.put('./', kopia); });
    }
    return svar;
  }).catch(function () {
    return caches.match(e.request).then(function (m) { return m || caches.match('./'); });
  }));
});
