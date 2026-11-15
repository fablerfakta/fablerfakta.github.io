// Små magiska glimtar som tänds och slocknar runt boken och fjädern.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var host = document.querySelector('.sparkles');
  if (!host) return;

  // områden i procent av logobilden: [vänster, topp, bredd, höjd, vikt]
  var zones = [
    [18, 22, 30, 16, 3],   // runt fjäderns topp och ovanför boken
    [11, 38, 11, 22, 2],   // vänster om boken
    [21, 42, 26, 20, 3],   // över bokens sidor
    [36, 30, 12, 26, 2],   // längs fjädern
    [64, 44, 14, 14, 1]    // bokens högra sida bakom pennan
  ];
  var total = zones.reduce(function (s, z) { return s + z[4]; }, 0);

  function pick() {
    var r = Math.random() * total;
    for (var i = 0; i < zones.length; i++) { r -= zones[i][4]; if (r <= 0) return zones[i]; }
    return zones[0];
  }

  function spawn() {
    if (document.hidden) return;
    var z = pick();
    var s = document.createElement('span');
    s.className = 'spark' + (Math.random() < 0.25 ? ' dot' : '');
    var size = 2.2 + Math.random() * 2.8;            // % av logobredden
    s.style.left = (z[0] + Math.random() * z[2]) + '%';
    s.style.top = (z[1] + Math.random() * z[3]) + '%';
    s.style.width = size + '%';
    s.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
    s.style.setProperty('--rot', (Math.random() * 40 - 20) + 'deg');
    s.addEventListener('animationend', function () { s.remove(); });
    host.appendChild(s);
  }

  (function tick() {
    if (host.childElementCount < 4) spawn();
    setTimeout(tick, 700 + Math.random() * 1100);
  })();
})();
