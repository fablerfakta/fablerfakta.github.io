// Gamla adressen: avregistrera och skicka vidare till /C-kortet/
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(self.registration.unregister().then(function () {
    return self.clients.matchAll({ type: 'window' });
  }).then(function (cs) {
    cs.forEach(function (c) { c.navigate('https://fablerfakta.github.io/C-kortet/'); });
  }));
});
