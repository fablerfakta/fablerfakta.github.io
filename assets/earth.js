// En mörk jordglob som snurrar mycket långsamt bakom logon.
(function () {
  var cv = document.querySelector('.layer-earth');
  if (!cv || !cv.getContext) return;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var N = 420;                       // intern upplösning (skalas upp med CSS)
  var REV_SECONDS = 240;             // ett varv på fyra minuter
  cv.width = N; cv.height = N;
  var ctx = cv.getContext('2d');
  var out = ctx.createImageData(N, N);

  var img = new Image();
  img.onload = function () {
    var tc = document.createElement('canvas');
    var TW = img.width, TH = img.height;
    tc.width = TW; tc.height = TH;
    var tctx = tc.getContext('2d');
    tctx.drawImage(img, 0, 0);
    var tex = tctx.getImageData(0, 0, TW, TH).data;

    // förberäkna longitud, rad i texturen, ljus och kantutjämning per pixel
    var count = 0, idx = [], lonA = [], rowA = [], litA = [], alA = [];
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        var nx = (x + 0.5) / N * 2 - 1, ny = (y + 0.5) / N * 2 - 1;
        var rr = Math.sqrt(nx * nx + ny * ny);
        if (rr > 1.004) continue;
        var nz = Math.sqrt(Math.max(0, 1 - rr * rr));
        var lat = Math.asin(Math.max(-1, Math.min(1, -ny)));
        var lon = Math.atan2(nx, nz);
        idx.push((y * N + x) * 4);
        lonA.push((lon / (2 * Math.PI) + 0.5) * TW);
        rowA.push(Math.min(TH - 1, Math.floor((0.5 - lat / Math.PI) * TH)) * TW);
        litA.push(0.55 + 0.45 * nz * Math.max(0.3, Math.min(1.2, 0.6 - 0.6 * ny)));
        alA.push(Math.max(0, Math.min(1, (1 - rr) * N / 2 / 1.2 + 0.5)) * 255);
        count++;
      }
    }
    var d = out.data;

    function draw(t) {
      var off = (t / 1000 / REV_SECONDS % 1) * TW;
      for (var i = 0; i < count; i++) {
        var u = (lonA[i] + off) | 0; u %= TW;
        var p = (rowA[i] + u) * 4, o = idx[i], l = litA[i];
        d[o] = tex[p] * l; d[o + 1] = tex[p + 1] * l; d[o + 2] = tex[p + 2] * l; d[o + 3] = alA[i];
      }
      ctx.putImageData(out, 0, 0);
    }

    if (still) { draw(0); return; }
    var last = 0;
    (function loop(t) {
      if (t - last > 100) { draw(t); last = t; }   // 10 bilder/s räcker för så långsam rörelse
      requestAnimationFrame(loop);
    })(0);
  };
  img.src = 'assets/img/jord.png?v=2';
})();
