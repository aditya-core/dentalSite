/* =========================================================================
   MA Clínica Dental — updates.js
   Filterable news list + inline reading view (hash deep-link supported).
   ========================================================================= */
window.pageInit = function (A) {
  var C = A.C, t = A.t, L = A.L, LS = A.LS, icon = A.icon, esc = A.esc;
  var $ = A.$, $$ = A.$$;

  var listHost = $('#updatesList');
  var readerHost = $('#updateReader');
  if (!listHost) return;

  var activeCat = 'all';
  var query = '';

  function glyph(cat) {
    return cat === 'tip' ? 'leaf' : cat === 'promo' ? 'sparkle' : cat === 'team' ? 'user' : 'scan';
  }

  function filtered() {
    return C.updates.filter(function (u) {
      var okCat = activeCat === 'all' || u.cat === activeCat;
      var q = query.trim().toLowerCase();
      var okQ = !q || (L(u, 't') + ' ' + L(u, 's') + ' ' + L(u, 'b')).toLowerCase().indexOf(q) > -1;
      return okCat && okQ;
    });
  }

  function counts() {
    var out = { all: C.updates.length };
    C.updates.forEach(function (u) { out[u.cat] = (out[u.cat] || 0) + 1; });
    return out;
  }

  function renderFilters() {
    var host = $('#updateFilters');
    var c = counts();
    var chips = [{ code: 'all', label: t('all') }].concat(
      Object.keys(C.updateCats).map(function (k) { return { code: k, label: LS(C.updateCats[k]) }; })
    );
    host.innerHTML =
      chips.filter(function (x) { return c[x.code]; }).map(function (x) {
        return '<button class="fchip" type="button" data-cat="' + x.code + '" aria-pressed="' + (activeCat === x.code) + '">' +
          esc(x.label) + ' <em>' + c[x.code] + '</em></button>';
      }).join('') +
      '<label class="search">' + icon('search', 'ico--sm') +
        '<input type="search" id="q" value="' + esc(query) + '" placeholder="' + esc(t('searchPh')) + '" aria-label="' + esc(t('searchPh')) + '">' +
      '</label>';

    $$('#updateFilters .fchip').forEach(function (b) {
      b.addEventListener('click', function () {
        activeCat = b.dataset.cat;
        renderFilters();
        renderList();
      });
    });
    var input = $('#q');
    input.addEventListener('input', function () {
      query = input.value;
      renderList();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { input.value = ''; query = ''; renderList(); }
    });
  }

  function renderList() {
    var items = filtered();
    if (!items.length) {
      listHost.innerHTML = '<div class="card empty">' + icon('search', 'ico--xl') +
        '<h3 class="h-3" style="margin-top:14px">' + t('noResults') + '</h3>' +
        '<p class="small" style="color:var(--muted)">' + t('noResultsP') + '</p>' +
        '<button class="btn btn--outline btn--sm" style="margin-top:16px" type="button" id="resetFilters">' + t('all') + '</button></div>';
      var reset = $('#resetFilters');
      if (reset) reset.addEventListener('click', function () {
        activeCat = 'all'; query = ''; renderFilters(); renderList();
      });
      return;
    }

    listHost.innerHTML = '<div class="g3">' + items.map(function (u, i) {
      return '<article class="card post rv" data-d="' + Math.min(i, 3) + '">' +
        '<a href="#' + u.slug + '" style="display:flex;flex-direction:column;height:100%">' +
          '<div class="post__top">' +
            '<span class="badge">' + esc(LS(C.updateCats[u.cat])) + (u.pinned ? ' · ★' : '') + '</span>' +
            '<span class="post__glyph">' + icon(glyph(u.cat), 'ico--xl') + '</span>' +
          '</div>' +
          '<div class="post__body">' +
            '<span class="post__meta"><span>' + A.fmtShort(u.date) + '</span><span>' + u.read + ' ' + t('minRead') + '</span></span>' +
            '<h3>' + esc(L(u, 't')) + '</h3>' +
            '<p>' + esc(L(u, 's')) + '</p>' +
            '<span class="link-more" style="margin-top:6px">' + t('readMore') + ' ' + icon('arrow', 'ico--sm') + '</span>' +
          '</div>' +
        '</a></article>';
    }).join('') + '</div>';

    A.initReveal();
  }

  function findUpdate(slug) {
    for (var i = 0; i < C.updates.length; i++) if (C.updates[i].slug === slug) return C.updates[i];
    return null;
  }

  function renderReader(slug) {
    var u = findUpdate(slug);
    if (!u) { showList(); return; }

    var related = C.updates.filter(function (x) { return x.slug !== u.slug && x.cat === u.cat; }).slice(0, 3);
    var body = L(u, 'b').split('\n').filter(function (p) { return p.trim(); }).map(function (p) {
      return p.indexOf('•') === 0 || /^\d\./.test(p)
        ? '<li>' + esc(p.replace(/^[•\d.]\s*/, '')) + '</li>'
        : '<p>' + esc(p) + '</p>';
    }).join('');

    readerHost.innerHTML =
      '<article>' +
        '<a class="link-more" href="#" id="backList" style="margin-bottom:1.6rem">' +
          icon('arrow', 'ico--sm') + ' ' + t('allUpdates') + '</a>' +
        '<span class="badge badge--mint">' + esc(LS(C.updateCats[u.cat])) + '</span>' +
        '<h1 class="h-1" style="margin:18px 0 14px;max-width:22ch">' + esc(L(u, 't')) + '</h1>' +
        '<div class="flex gap-2 items-center tiny" style="color:var(--muted);letter-spacing:.04em;margin-bottom:2rem">' +
          '<span>' + icon('calendar', 'ico--sm') + ' ' + A.fmtDate(u.date) + '</span>' +
          '<span>' + icon('clock', 'ico--sm') + ' ' + u.read + ' ' + t('minRead') + '</span>' +
        '</div>' +
        '<div class="article" style="max-width:70ch">' + body + '</div>' +
        '<div class="band" style="margin-top:3rem;border-radius:var(--r-4)">' +
          '<div class="band__row">' +
            '<div><h2 class="h-2">' + t('wantUs') + '</h2><p class="small">' + t('wantUsP') + '</p></div>' +
            '<div class="band__cta">' +
              '<a class="btn btn--gold btn--lg" href="booking.html">' + icon('calendar', 'ico--sm') + ' ' + t('book') + '</a>' +
              (C.whatsapp ? '<a class="btn btn--outline btn--lg" target="_blank" rel="noopener" href="' + A.waLink(t('waBook')) + '">' + icon('whatsapp', 'ico--sm') + ' WhatsApp</a>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +
        (related.length ? '<h2 class="h-2" style="margin:3rem 0 1.4rem">' + t('keepReading') + '</h2>' +
          '<div class="g3">' + related.map(function (r) {
            return '<a class="card post" href="#' + r.slug + '">' +
              '<div class="post__top" style="min-height:120px"><span class="badge">' + esc(LS(C.updateCats[r.cat])) + '</span>' +
              '<span class="post__glyph">' + icon(glyph(r.cat), 'ico--lg') + '</span></div>' +
              '<div class="post__body"><span class="post__meta"><span>' + A.fmtShort(r.date) + '</span></span>' +
              '<h3>' + esc(L(r, 't')) + '</h3></div></a>';
          }).join('') + '</div>' : '') +
      '</article>';

    readerHost.hidden = false;
    listHost.hidden = true;
    $('#updateFiltersWrap').hidden = true;
    $('#backList').addEventListener('click', function (e) {
      e.preventDefault();
      history.pushState(null, '', location.pathname);
      showList();
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showList() {
    readerHost.hidden = true;
    readerHost.innerHTML = '';
    listHost.hidden = false;
    $('#updateFiltersWrap').hidden = false;
  }

  function route() {
    var slug = decodeURIComponent(location.hash.replace('#', ''));
    if (slug && findUpdate(slug)) renderReader(slug);
    else showList();
  }

  renderFilters();
  renderList();
  route();
  window.addEventListener('hashchange', route);
};
