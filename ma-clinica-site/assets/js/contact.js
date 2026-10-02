/* =========================================================================
   MA Clínica Dental — contact.js
   Client-side validated contact form → WhatsApp / mailto hand-off.
   ========================================================================= */
window.pageInit = function (A) {
  var C = A.C, t = A.t, L = A.L, LS = A.LS, icon = A.icon, esc = A.esc;
  var $ = A.$, $$ = A.$$;

  /* ---------- info blocks ---------- */
  var hours = $('#hoursTable');
  if (hours) hours.innerHTML = A.hoursRows();

  var faqHost = $('#contactFaq');
  if (faqHost) {
    faqHost.innerHTML = C.faqs.slice(0, 5).map(function (f, i) {
      return '<details class="acc__item rv"' + (i === 0 ? ' open' : '') + '>' +
        '<summary class="acc__q"><span>' + esc(L(f, 'q')) + '</span>' +
        '<span class="pm">' + icon('plus', 'ico--sm') + '</span></summary>' +
        '<div class="acc__a"><p>' + esc(L(f, 'a')) + '</p></div></details>';
    }).join('');
  }

  var map = $('#map');
  if (map) {
    map.innerHTML = '<iframe title="' + esc(C.name) + '" loading="lazy" src="' + C.mapEmbed + '"></iframe>' +
      '<div class="map__fallback">' + icon('pin', 'ico--lg') +
      '<p style="margin-top:10px"><strong>' + esc(C.name) + '</strong><br>' + esc(C.street) + '</p>' +
      '<a class="btn btn--outline btn--sm" style="margin-top:12px" target="_blank" rel="noopener" href="' + A.mapsHref() + '">' +
      t('viewMap') + '</a></div>';
  }

  /* ---------- form ---------- */
  var form = $('#contactForm');
  if (!form) return;

  var data = { name: '', email: '', phone: '', subject: '', message: '' };

  function setErr(field, msg) {
    var box = form.querySelector('[data-field="' + field + '"]');
    if (!box) return;
    box.classList.toggle('is-bad', !!msg);
    if (!msg) box.classList.add('is-good');
    var slot = box.querySelector('.err span:last-child');
    if (slot) slot.textContent = msg || '';
  }

  ['name', 'email', 'phone', 'subject', 'message'].forEach(function (k) {
    var el = form.querySelector('[name="' + k + '"]');
    el.addEventListener('input', function () { data[k] = el.value; setErr(k, ''); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var ok = true;
    if (data.name.trim().length < 3) { setErr('name', t('errNameShort')); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) { setErr('email', t('errEmail')); ok = false; }
    if (data.subject.trim().length < 3) { setErr('subject', t('errSubject')); ok = false; }
    if (data.message.trim().length < 10) { setErr('message', t('errMsg')); ok = false; }

    if (!ok) {
      A.toast(t('errFill'), 'err');
      var bad = form.querySelector('.is-bad .input');
      if (bad) bad.focus();
      return;
    }

    var body = [
      (A.lang === 'en' ? 'Name' : 'Nombre') + ': ' + data.name,
      'Email: ' + data.email,
      (A.lang === 'en' ? 'Phone' : 'Teléfono') + ': ' + (data.phone || '—'),
      (A.lang === 'en' ? 'Subject' : 'Asunto') + ': ' + data.subject,
      '',
      (A.lang === 'en' ? 'Message' : 'Mensaje') + ':',
      data.message
    ].join('\n');

    var wa = A.waLink(body);
    var mail = 'mailto:' + C.email + '?subject=' + encodeURIComponent(data.subject) + '&body=' + encodeURIComponent(body);

    $('#contactResult').innerHTML =
      '<div class="alert alert--ok">' + icon('checkCircle', 'ico--sm') +
        '<div><strong>' + t('msgReady') + '</strong><br>' + t('msgReadyP') + '</div></div>' +
      '<div style="display:grid;gap:10px;margin-bottom:1.6rem">' +
        (wa ? '<a class="btn btn--mint btn--block" target="_blank" rel="noopener" href="' + wa + '">' + icon('whatsapp') + ' ' + t('sendWa') + '</a>' : '') +
        '<a class="btn btn--outline btn--block" href="' + mail + '">' + icon('mail') + ' ' + t('sendByEmail') + '</a>' +
      '</div>';

    $('#contactResult').scrollIntoView({ behavior: 'smooth', block: 'center' });
    A.toast(t('msgReady'), 'ok');

    /* keep a local copy so nothing is lost without a backend */
    var all = A.store('ma-messages') || [];
    all.push(Object.assign({ _at: new Date().toISOString() }, data));
    A.store('ma-messages', all.slice(-50));
  });

  A.initReveal();
};
