/* =========================================================================
   MA Clínica Dental — home.js
   Renders every home-page block from CLINIC data.
   ========================================================================= */
window.pageInit = function (A) {
  var C = A.C, t = A.t, L = A.L, LS = A.LS, icon = A.icon, esc = A.esc;
  var $ = A.$;

  /* ---------- marquee ---------- */
  var mq = $('#marquee');
  if (mq) {
    var words = ['mq', 'mq2', 'mq3', 'mq4', 'mq5', 'mq6', 'mq7', 'mq8'].map(function (k) { return t(k); });
    var run = words.map(function (w) { return '<span>' + esc(w) + ' <i>✦</i></span>'; }).join('');
    mq.innerHTML = '<div class="marquee__track">' + run + run + '</div>';
  }

  /* ---------- stats ---------- */
  var stats = $('#stats');
  if (stats) {
    var years = new Date().getFullYear() - C.since;
    stats.innerHTML = [
      { n: years, s: '', l: t('st1') },
      { n: 12000, s: '+', l: t('st2') },
      { n: 4.9, s: '', l: t('st3'), dec: 1 },
      { n: C.services.length, s: '', l: t('st4') }
    ].map(function (s) {
      return '<div class="stat rv"><b><span data-count="' + (s.dec ? s.n.toFixed(1) : s.n) + '">0</span>' +
        (s.s ? '<i>' + s.s + '</i>' : '') + '</b><span>' + s.l + '</span></div>';
    }).join('');
  }

  /* ---------- services ---------- */
  var svc = $('#services');
  if (svc) {
    svc.innerHTML = C.services.map(function (s, i) {
      var price = s.priceFrom
        ? '<b>' + esc(A.money(s.priceFrom)) + '</b>' + t('from')
        : '<b>' + t('free') + '</b>';
      return '<article class="svc rv" data-d="' + Math.min(i, 3) + '">' +
        '<span class="svc__n">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<div class="svc__body"><h3>' + esc(L(s, 'name')) + '</h3><p>' + esc(L(s, 'desc')) + '</p></div>' +
        '<div class="svc__meta">' + price + '<span>' + esc(L(s.duration)) + '</span></div>' +
      '</article>';
    }).join('');
  }

  /* ---------- technology ---------- */
  var tech = $('#tech');
  if (tech) {
    tech.innerHTML = C.tech.map(function (x, i) {
      return '<div class="card rv" data-d="' + Math.min(i, 3) + '" style="display:flex;gap:14px;align-items:flex-start">' +
        '<span class="chip-ico">' + icon(x.icon) + '</span>' +
        '<div><h3 style="font-size:var(--fs-3);margin-bottom:4px">' + esc(L(x, 't')) + '</h3>' +
        '<p class="small" style="color:var(--muted)">' + esc(L(x, 'd')) + '</p></div></div>';
    }).join('');
  }

  /* ---------- testimonials rail ---------- */
  var rail = $('#rail');
  if (rail) {
    rail.innerHTML = C.testimonials.map(function (r) {
      return '<article class="card quote rv">' +
        '<span class="quote__mark">' + icon('quote', 'ico--lg') + '</span>' +
        '<p>“' + esc(L(r, 'q')) + '”</p>' +
        '<div class="quote__who">' +
          '<span class="avatar">' + esc(r.initials) + '</span>' +
          '<span><b>' + esc(r.name) + '</b><span>' + esc(L(r, 't')) + '</span></span>' +
          '<span class="stars" style="margin-left:auto" aria-label="' + r.rating + '/5">' +
            Array(r.rating).fill(icon('star', 'ico--sm')).join('') +
          '</span>' +
        '</div></article>';
    }).join('');
  }

  /* ---------- products teaser ---------- */
  var prods = $('#homeProducts');
  if (prods) {
    prods.innerHTML = C.products.slice(0, 3).map(function (p, i) {
      return '<article class="card prod rv" data-d="' + i + '">' +
        '<div class="prod__thumb"><span aria-hidden="true">' + p.emoji + '</span>' +
          (p.badge ? '<span class="badge badge--gold prod__badge">' + esc(p.badge) + '</span>' : '') +
        '</div>' +
        '<div class="prod__body">' +
          '<h3>' + esc(L(p, 'n')) + '</h3><p>' + esc(L(p, 'd')) + '</p>' +
          '<div class="price"><b>' + A.money(p.price) + '</b>' +
            (p.old ? '<s>' + A.money(p.old) + '</s><em>-' + Math.round((1 - p.price / p.old) * 100) + '%</em>' : '') +
          '</div></div></article>';
    }).join('');
  }

  /* ---------- updates teaser ---------- */
  var ups = $('#homeUpdates');
  if (ups) {
    ups.innerHTML = C.updates.slice(0, 3).map(function (u, i) {
      return '<article class="card post rv" data-d="' + i + '">' +
        '<div class="post__top">' +
          '<span class="badge">' + esc(LS(C.updateCats[u.cat])) + '</span>' +
          '<span class="post__glyph">' + icon(u.cat === 'tip' ? 'leaf' : u.cat === 'promo' ? 'sparkle' : 'scan', 'ico--xl') + '</span>' +
        '</div>' +
        '<div class="post__body">' +
          '<span class="post__meta"><span>' + A.fmtShort(u.date) + '</span><span>' + u.read + ' ' + t('minRead') + '</span></span>' +
          '<h3>' + esc(L(u, 't')) + '</h3><p>' + esc(L(u, 's')) + '</p>' +
          '<a class="link-more" href="updates.html#' + u.slug + '" style="margin-top:6px">' + t('readMore') + ' ' + icon('arrow', 'ico--sm') + '</a>' +
        '</div></article>';
    }).join('');
  }

  /* ---------- faq ---------- */
  var faq = $('#faq');
  if (faq) {
    faq.innerHTML = C.faqs.map(function (f, i) {
      return '<details class="acc__item rv"' + (i === 0 ? ' open' : '') + '>' +
        '<summary class="acc__q"><span>' + esc(L(f, 'q')) + '</span>' +
        '<span class="pm">' + icon('plus', 'ico--sm') + '</span></summary>' +
        '<div class="acc__a"><p>' + esc(L(f, 'a')) + '</p></div></details>';
    }).join('');
  }

  /* ---------- hours + map ---------- */
  var hours = $('#hoursTable');
  if (hours) hours.innerHTML = A.hoursRows();

  var map = $('#map');
  if (map) {
    map.innerHTML = '<iframe title="' + esc(C.name) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
      'src="' + C.mapEmbed + '"></iframe>' +
      '<div class="map__fallback">' + icon('pin', 'ico--lg') +
      '<p style="margin-top:10px"><strong>' + esc(C.name) + '</strong><br>' + esc(C.street) + '<br>' + esc(C.city) + '</p>' +
      '<a class="btn btn--outline btn--sm" style="margin-top:12px" target="_blank" rel="noopener" href="' + A.mapsHref() + '">' +
      t('viewMap') + '</a></div>';
  }

  /* ---------- where paragraph with city ---------- */
  var whereP = $('#whereP');
  if (whereP) whereP.textContent = t('whereP', { city: C.cityShort });

  A.initReveal();
  A.initCounters();
};
