// Fabler & Fakta Studio – gör sidan installerbar. Ingen cache: allt hämtas från nätet som vanligt.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function () {});
