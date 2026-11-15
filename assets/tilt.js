// Logon flyter och följer med när man vrider på mobilen (parallax).
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var tilt = document.querySelector('.tilt');
  var bg = document.querySelector('.layer-bg');
  var front = document.querySelector('.layer-front');
  if (!tilt || !bg) return;

  var MAX = 5;           // max förflyttning för logon i px
  var tx = 0, ty = 0;    // mål
  var x = 0, y = 0;      // nuvarande
  var base = null;       // hur telefonen hölls när sidan öppnades

  var lastG = null, lastB = null;
  function onOrient(e) {
    if (e.beta == null || e.gamma == null) return;
    // när mobilen hålls nästan lodrätt kan sensorn plötsligt slå om (t.ex. +80 -> -80).
    // sådana hopp ignoreras så att bilden inte rycker.
    if (lastG !== null && (Math.abs(e.gamma - lastG) > 35 || Math.abs(e.beta - lastB) > 35)) {
      lastG = e.gamma; lastB = e.beta; return;
    }
    lastG = e.gamma; lastB = e.beta;
    if (!base) base = { b: e.beta, g: e.gamma };
    var g = Math.max(-25, Math.min(25, e.gamma - base.g)) / 25;
    var b = Math.max(-25, Math.min(25, e.beta - base.b)) / 25;
    tx = g * MAX; ty = b * MAX * 1.3;
  }

  function loop() {
    x += (tx - x) * 0.06; y += (ty - y) * 0.06;
    tilt.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0)';
    if (front) front.style.transform = 'translate3d(' + (x * 0.6).toFixed(2) + 'px,' + (y * 0.6).toFixed(2) + 'px,0)';
    // himlen, jorden och texten står still
    requestAnimationFrame(loop);
  }

  function start() {
    window.addEventListener('deviceorientation', onOrient);
    requestAnimationFrame(loop);
  }

  start();
  // iPhone (och vissa andra) kräver ett tryck på skärmen för att tillåta rörelsesensorn
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
    var ask = function () {
      DeviceOrientationEvent.requestPermission().catch(function () {});
      window.removeEventListener('touchend', ask);
    };
    window.addEventListener('touchend', ask);
  }

  // på dator: följ musen lite i stället
  window.addEventListener('mousemove', function (e) {
    tx = (e.clientX / innerWidth - 0.5) * 2 * MAX;
    ty = (e.clientY / innerHeight - 0.5) * 2 * MAX;
  });
})();
