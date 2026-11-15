// Små magiska glimtar som tänds och slocknar runt boken och fjädern.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var host = document.querySelector('.sparkles');
  if (!host) return;

  // platser i procent av logobilden
  function along(x1, y1, x2, y2, jitter) {          // längs en linje (fjädern)
    var t = Math.random(), j = (Math.random() - 0.5) * 2 * jitter;
    var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
    return [x1 + dx * t - dy / len * j, y1 + dy * t + dx / len * j];
  }
  var places = [
    // fjädern, från spetsen och ner mot boken
    [3, function () {
      var P = [[25, 27.4], [35.9, 34.2], [42.9, 43.2], [46.8, 54], [48.7, 62]];
      var k = Math.floor(Math.random() * (P.length - 1));
      return along(P[k][0], P[k][1], P[k + 1][0], P[k + 1][1], 3);
    }],
    // vänstra boksidan
    [3, function () { return [21 + Math.random() * 24, 42 + Math.random() * 20]; }],
    // längs glödlampans runda glas
    [2, function () {
      var a = Math.PI * (0.95 + Math.random() * 1.1);   // övre halvan av rundningen
      var r = 1.02 + Math.random() * 0.12;
      return [59 + Math.cos(a) * 9.5 * r, 43.5 + Math.sin(a) * 11.5 * r];
    }]
  ];
  var total = places.reduce(function (s, p) { return s + p[0]; }, 0);
  function pick() {
    var r = Math.random() * total;
    for (var i = 0; i < places.length; i++) { r -= places[i][0]; if (r <= 0) return places[i][1](); }
    return places[0][1]();
  }

  function spawn() {
    if (document.hidden) return;
    var pos = pick();
    var s = document.createElement('span');
    s.className = 'spark' + (Math.random() < 0.25 ? ' dot' : '');
    var size = 2.2 + Math.random() * 2.8;            // % av logobredden
    s.style.left = pos[0] + '%';
    s.style.top = pos[1] + '%';
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
