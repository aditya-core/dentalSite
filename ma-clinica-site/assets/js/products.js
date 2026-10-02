/* =========================================================================
   MA Clínica Dental — products.js
   Category filter + sorting + WhatsApp enquiry per product.
   ========================================================================= */
window.pageInit = function (A) {
  var C = A.C, t = A.t, L = A.L, LS = A.LS, icon = A.icon, esc = A.esc;
  var $ = A.$, $$ = A.$$;

  var host = $('#productGrid');
  if (!host) return;

  var activeCat = 'all';
  var sort = 'relevance';

  function counts() {
    var out = { all: C.products.length };
    C.products.forEach(function (p) { out[p.cat] = (out[p.cat] || 0) + 1; });
    return out;
  }

  function visible() {
    var list = C.products.filter(function (p) { return activeCat === 'all' || p.cat === activeCat; });
    if (sort === 'priceAsc') list = list.slice().sort(function (a, b) { return a.price - b.price; });
    if (sort === 'priceDesc') list = list.slice().sort(function (a, b) { return b.price - a.price; });
    if (sort === 'newest') list = list.slice().reverse();
    return list;
  }

  function renderFilters() {
    var c = counts();
    var chips = [{ code: 'all', label: t('all') }].concat(
      Object.keys(C.productCats).map(function (k) { return { code: k, label: LS(C.productCats[k]) }; })
    );

    $('#productFilters').innerHTML = chips.filter(function (x) { return c[x.code]; }).map(function (x) {
      return '<button class="fchip" type="button" data-cat="' + x.code + '" aria-pressed="' + (activeCat === x.code) + '">' +
        esc(x.label) + ' <em>' + c[x.code] + '</em></button>';
    }).join('');

    $$('#productFilters .fchip').forEach(function (b) {
      b.addEventListener('click', function () {
        activeCat = b.dataset.cat;
        renderFilters();
        render();
      });
    });
  }

  function render() {
    var items = visible();
    $('#productCount').textContent = items.length + ' ' + (items.length === 1 ? t('productCount') : t('productCountPl'));

    if (!items.length) {
      host.innerHTML = '<div class="card empty">' + icon('search', 'ico--xl') +
        '<h3 class="h-3" style="margin-top:14px">' + t('noProducts') + '</h3>' +
        '<button class="btn btn--outline btn--sm" style="margin-top:16px" type="button" id="resetCat">' + t('all') + '</button></div>';
      var reset = $('#resetCat');
      if (reset) reset.addEventListener('click', function () { activeCat = 'all'; renderFilters(); render(); });
      return;
    }

    host.innerHTML = '<div class="g3">' + items.map(function (p, i) {
      var discount = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
      var waText = t('waProductIntro') + L(p, 'n') + t('waProductTail');
      return '<article class="card prod rv" data-d="' + Math.min(i, 3) + '">' +
        '<div class="prod__thumb"><span aria-hidden="true">' + p.emoji + '</span>' +
          (p.badge ? '<span class="badge badge--gold prod__badge">' + esc(p.badge) + '</span>' : '') +
        '</div>' +
        '<div class="prod__body">' +
          '<span class="badge badge--mint" style="align-self:flex-start">' + esc(LS(C.productCats[p.cat])) + '</span>' +
          '<h3>' + esc(L(p, 'n')) + '</h3>' +
          '<p>' + esc(L(p, 'd')) + '</p>' +
          '<div class="price"><b>' + A.money(p.price) + '</b>' +
            (p.old ? '<s>' + A.money(p.old) + '</s><em>-' + discount + '%</em>' : '') +
          '</div>' +
          (C.whatsapp
            ? '<a class="btn btn--outline btn--sm btn--block" style="margin-top:12px" target="_blank" rel="noopener" ' +
              'href="' + A.waLink(waText) + '">' + icon('whatsapp', 'ico--sm') + ' ' + t('askWa') + '</a>'
            : '') +
        '</div></article>';
    }).join('') + '</div>';

    A.initReveal();
  }

  renderFilters();
  render();

  var sortSel = $('#sortSelect');
  if (sortSel) {
    sortSel.innerHTML = ['relevance', 'newest', 'priceAsc', 'priceDesc'].map(function (k) {
      return '<option value="' + k + '">' + t(k) + '</option>';
    }).join('');
    sortSel.addEventListener('change', function () { sort = sortSel.value; render(); });
  }
};
