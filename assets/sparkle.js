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
      var r = 0.84 + Math.random() * 0.14;      // precis innanför glasets kant
      return [59 + Math.cos(a) * 9.5 * r, 43.5 + Math.sin(a) * 11.5 * r];
    }]
  ];
  places.push([2, function () { return along(79.5, 47.5, 66, 64, 1.2); }]);   // pennan, från spetsen och nedåt
  var total = places.reduce(function (s, p) { return s + p[0]; }, 0);
  function pick() {
    var r = Math.random() * total;
    for (var i = 0; i < places.length; i++) { r -= places[i][0]; if (r <= 0) return places[i][1](); }
    return places[0][1]();
  }

  // läs logons genomskinlighet, så att glimtar bara hamnar på själva föremålen
  var alpha = null, AW = 0, AH = 0;
  (function () {
    var src = document.querySelector('.layer-logo');
    var im = new Image();
    im.onload = function () {
      AW = 240; AH = Math.round(240 * im.height / im.width);
      var c = document.createElement('canvas'); c.width = AW; c.height = AH;
      var x = c.getContext('2d'); x.drawImage(im, 0, 0, AW, AH);
      try { alpha = x.getImageData(0, 0, AW, AH).data; } catch (e) { alpha = null; }
    };
    im.src = src.currentSrc || src.src;
  })();
  function onObject(p) {
    if (!alpha) return true;
    var X = Math.round(p[0] / 100 * (AW - 1)), Y = Math.round(p[1] / 100 * (AH - 1));
    if (X < 0 || Y < 0 || X >= AW || Y >= AH) return false;
    return alpha[(Y * AW + X) * 4 + 3] > 235;
  }

  function spawn() {
    if (document.hidden) return;
    var pos = pick(), tries = 0;
    while (!onObject(pos) && tries++ < 20) pos = pick();
    if (!onObject(pos)) return;
    var s = document.createElement('span');
    s.className = 'spark dot';
    var size = 1.8 + Math.random() * 2.4;            // % av logobredden
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
