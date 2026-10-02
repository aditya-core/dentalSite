/* =========================================================================
   MA Clínica Dental — booking.js
   4-step booking wizard → WhatsApp deep link + Google Sheet sync.
   ========================================================================= */
window.pageInit = function (A) {
  var C = A.C, t = A.t, L = A.L, LS = A.LS, icon = A.icon, esc = A.esc;
  var $ = A.$, $$ = A.$$;

  var TOTAL = 4;
  var state = {
    fullName: '', phone: '', email: '',
    treatment: C.treatments[0].code,
    date: '', slot: '', condition: '',
    source: 'Web', consent: false,
    reference: '', synced: false
  };

  var form = $('#bookingForm');
  if (!form) return;

  /* ---------- build the form ---------- */
  function label(key, opt) {
    return '<label for="f-' + key + '">' + t(key) +
      (opt ? ' <span class="opt">(' + t('optional') + ')</span>' : '') + '</label>';
  }
  function errBox(key) { return '<span class="err" data-err="' + key + '">' + icon('alert', 'ico--sm') + '<span></span></span>'; }

  function treatmentByCode(code) {
    for (var i = 0; i < C.treatments.length; i++) if (C.treatments[i].code === code) return C.treatments[i];
    return C.treatments[0];
  }
  function slotByCode(code) {
    for (var i = 0; i < C.slots.length; i++) if (C.slots[i].code === code) return C.slots[i];
    return null;
  }

  function build() {
    var min = A.todayISO();
    var max = new Date(); max.setFullYear(max.getFullYear() + 1);
    var maxISO = max.toISOString().slice(0, 10);

    form.innerHTML =
      '<div class="steps" id="steps" aria-hidden="true">' +
        '<i></i><i></i><i></i><i></i>' +
      '</div>' +

      /* ---- step 1 ---- */
      '<section class="step is-active" data-step="1">' +
        '<div class="step__head"><h2>' + t('yourData') + '</h2><p>' + t('yourDataP') + '</p></div>' +
        '<div class="field" data-field="fullName">' +
          label('fullName') +
          '<input class="input" id="f-fullName" name="fullName" type="text" autocomplete="name" placeholder="' + (A.lang === 'en' ? 'e.g. Mary Alvarez' : 'Ej. María Álvarez') + '">' +
          errBox('fullName') +
        '</div>' +
        '<div style="height:14px"></div>' +
        '<div class="field" data-field="phone">' +
          label('phoneWa') +
          '<input class="input" id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+34 600 000 000">' +
          '<span class="hint">' + t('phoneHint') + '</span>' +
          errBox('phone') +
        '</div>' +
        '<div style="height:14px"></div>' +
        '<div class="field" data-field="email">' +
          label('emailOpt', true) +
          '<input class="input" id="f-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="' + (A.lang === 'en' ? 'you@example.com' : 'tucorreo@ejemplo.com') + '">' +
          errBox('email') +
        '</div>' +
      '</section>' +

      /* ---- step 2 ---- */
      '<section class="step" data-step="2">' +
        '<div class="step__head"><h2>' + t('whatNeed') + '</h2><p>' + t('whatNeedP') + '</p></div>' +
        '<fieldset style="border:0;padding:0;margin:0">' +
          '<legend class="sr-only">' + t('whatNeed') + '</legend>' +
          '<div class="pills">' +
            C.treatments.map(function (x) {
              return '<label class="pill-opt"><input type="radio" name="treatment" value="' + x.code + '"' +
                (x.code === state.treatment ? ' checked' : '') + '><span>' + esc(LS(x)) + '</span></label>';
            }).join('') +
          '</div>' +
        '</fieldset>' +
      '</section>' +

      /* ---- step 3 ---- */
      '<section class="step" data-step="3">' +
        '<div class="step__head"><h2>' + t('whenQ') + '</h2><p>' + t('whenP') + '</p></div>' +
        '<div class="field" data-field="date">' +
          label('prefDate') +
          '<input class="input" id="f-date" name="date" type="date" min="' + min + '" max="' + maxISO + '" value="' + esc(state.date) + '">' +
          errBox('date') +
        '</div>' +
        '<div style="height:16px"></div>' +
        '<fieldset class="field" data-field="slot" style="border:0;padding:0;margin:0">' +
          '<legend class="legend">' + t('pickSlot') + '</legend>' +
          '<div class="pills">' +
            C.slots.map(function (s) {
              return '<label class="pill-opt"><input type="radio" name="slot" value="' + s.code + '"' +
                (s.code === state.slot ? ' checked' : '') + '><span>' + esc(LS(s)) + '</span></label>';
            }).join('') +
          '</div>' +
          errBox('slot') +
        '</fieldset>' +
      '</section>' +

      /* ---- step 4 ---- */
      '<section class="step" data-step="4">' +
        '<div class="step__head"><h2>' + t('tellUs') + '</h2><p>' + t('tellUsP') + '</p></div>' +
        '<div class="field" data-field="condition">' +
          '<textarea class="input" id="f-condition" name="condition" rows="5" maxlength="1500" placeholder="' + esc(t('conditionPh')) + '">' + esc(state.condition) + '</textarea>' +
          '<div class="counter"><span id="cc">0</span> / 1500</div>' +
          errBox('condition') +
        '</div>' +
        '<div style="height:14px"></div>' +
        '<div class="field" data-field="consent">' +
          '<label class="check"><input type="checkbox" id="f-consent"' + (state.consent ? ' checked' : '') + '>' +
          '<span>' + t('consent') + ' <a href="legal.html#privacidad">' + t('seePrivacy') + '</a></span></label>' +
          errBox('consent') +
        '</div>' +
      '</section>' +

      /* ---- step 5 (review) ---- */
      '<section class="step" data-step="5">' +
        '<div class="step__head"><h2>' + t('review') + '</h2><p>' + t('reviewP') + '</p></div>' +
        '<dl class="summary" id="summary"></dl>' +
        '<div id="postNote" style="margin-top:18px"></div>' +
      '</section>' +

      /* ---- nav ---- */
      '<div class="step__nav">' +
        '<button class="btn btn--outline" type="button" id="backBtn" hidden>' + t('back') + '</button>' +
        '<button class="btn btn--gold" type="button" id="nextBtn">' + t('next') + ' ' + icon('arrow', 'ico--sm') + '</button>' +
      '</div>' +
      '<p class="tiny" style="margin-top:16px;color:var(--muted)">' +
        icon('lock', 'ico--sm') + ' ' +
        (A.lang === 'en'
          ? 'Your details are only used to manage this appointment. Nothing is shared with third parties.'
          : 'Tus datos solo se usan para gestionar esta cita. No se comparten con terceros.') +
      '</p>';

    wire();
    go(1);
  }

  /* ---------- validation ---------- */
  function setErr(field, msg) {
    var box = form.querySelector('[data-field="' + field + '"]');
    if (!box) return;
    box.classList.toggle('is-bad', !!msg);
    if (msg) box.classList.remove('is-good');
    else if (box.querySelector('.input')) box.classList.add('is-good');
    var slot = box.querySelector('.err span:last-child');
    if (slot) slot.textContent = msg || '';
  }

  function validateStep(n) {
    var ok = true;
    if (n === 1) {
      var name = state.fullName.trim();
      var nameOk = name.length >= 3 && /^[\w\sÁÉÍÓÚÜÑáéíóúüñ'’.\-]+$/.test(name);
      setErr('fullName', nameOk ? '' : t('errName')); ok = ok && nameOk;

      var digits = state.phone.replace(/\D/g, '');
      var phoneOk = digits.length >= 9 && digits.length <= 15;
      setErr('phone', phoneOk ? '' : t('errPhone')); ok = ok && phoneOk;

      var emailOk = !state.email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(state.email);
      setErr('email', emailOk ? '' : '');
      ok = ok && emailOk;
    }
    if (n === 3) {
      var dateOk = !!state.date && state.date >= A.todayISO();
      setErr('date', dateOk ? '' : t('errDate')); ok = ok && dateOk;
      var slotOk = !!state.slot;
      setErr('slot', slotOk ? '' : t('errSlot')); ok = ok && slotOk;
    }
    if (n === 4) {
      var condOk = state.condition.trim().length >= 10;
      setErr('condition', condOk ? '' : t('errCondition')); ok = ok && condOk;
      setErr('consent', state.consent ? '' : t('errConsent')); ok = ok && state.consent;
    }
    return ok;
  }

  /* ---------- live updates ---------- */
  function wire() {
    $('#f-fullName').addEventListener('input', function (e) { state.fullName = e.target.value; setErr('fullName', ''); });
    $('#f-phone').addEventListener('input', function (e) { state.phone = e.target.value; setErr('phone', ''); });
    $('#f-email').addEventListener('input', function (e) { state.email = e.target.value; });
    $('#f-date').addEventListener('change', function (e) { state.date = e.target.value; setErr('date', ''); });
    $('#f-condition').addEventListener('input', function (e) {
      state.condition = e.target.value;
      $('#cc').textContent = e.target.value.length;
      setErr('condition', '');
    });
    $('#f-consent').addEventListener('change', function (e) { state.consent = e.target.checked; setErr('consent', ''); });

    $$('input[name="treatment"]').forEach(function (r) {
      r.addEventListener('change', function () { state.treatment = r.value; });
    });
    $$('input[name="slot"]').forEach(function (r) {
      r.addEventListener('change', function () { state.slot = r.value; setErr('slot', ''); });
    });

    $('#cc').textContent = state.condition.length;

    $('#backBtn').addEventListener('click', function () { go(current - 1); });
    /* NB: #nextBtn's handler is (re)assigned inside go() because it swaps between
       onNext and submit on the review step. Do NOT also bind it here — that would
       fire the handler twice and skip a step. */
  }

  /* ---------- step machine ---------- */
  var current = 1;

  function go(n) {
    current = Math.max(1, Math.min(TOTAL + 1, n));
    $$('.step', form).forEach(function (s) {
      s.classList.toggle('is-active', Number(s.dataset.step) === current);
    });
    $$('#steps i').forEach(function (bar, i) {
      bar.classList.toggle('done', i + 1 < current);
      bar.classList.toggle('now', i + 1 === current);
    });
    $('#backBtn').hidden = current === 1;

    var next = $('#nextBtn');
    if (current === TOTAL + 1) {
      next.innerHTML = icon('whatsapp') + ' ' + t('sendWa');
      next.className = 'btn btn--mint btn--block';
      next.onclick = submit;
      renderSummary();
    } else {
      next.innerHTML = t('next') + ' ' + icon('arrow', 'ico--sm');
      next.className = 'btn btn--gold';
      next.onclick = onNext;
    }
    $('#stepLabel').textContent = t('step') + ' ' + Math.min(current, TOTAL) + ' ' + t('of') + ' ' + TOTAL;
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function onNext() {
    if (!validateStep(current)) {
      A.toast(t('fixFields'), 'err');
      var bad = form.querySelector('.is-bad .input');
      if (bad) bad.focus();
      return;
    }
    go(current + 1);
  }

  function renderSummary() {
    var tr = treatmentByCode(state.treatment);
    var sl = slotByCode(state.slot);
    var rows = [
      [t('name'), state.fullName],
      [t('phoneWa'), state.phone],
      [t('emailOpt'), state.email || '—'],
      [t('treatment'), LS(tr)],
      [t('date'), state.date ? A.fmtDate(state.date) : '—'],
      [t('slot'), sl ? LS(sl) : '—'],
      [t('yourCase'), state.condition]
    ];
    $('#summary').innerHTML = rows.map(function (r) {
      return '<div class="summary__row"><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>';
    }).join('');
    $('#postNote').innerHTML =
      '<div class="alert alert--info">' + icon('info', 'ico--sm') +
      '<span>' + (A.lang === 'en'
        ? 'Pressing the button opens WhatsApp with this message already written. You only have to press send.'
        : 'Al pulsar el botón se abre WhatsApp con este mensaje ya escrito. Solo tendrás que pulsar enviar.') +
      '</span></div>';
  }

  /* ---------- WhatsApp message ---------- */
  function reference() {
    var alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var out = '';
    for (var i = 0; i < 6; i++) out += alpha[Math.floor(Math.random() * alpha.length)];
    return 'MA-' + out;
  }

  function waText() {
    var tr = treatmentByCode(state.treatment);
    var sl = slotByCode(state.slot);
    var en = A.lang === 'en';
    return [
      '*' + C.name + '* — ' + (en ? 'New appointment request' : 'Nueva solicitud de cita'),
      '',
      (en ? '🔖 Reference' : '🔖 Referencia') + ': *' + state.reference + '*',
      (en ? '👤 Name' : '👤 Nombre') + ': ' + state.fullName,
      (en ? '📞 Phone' : '📞 Teléfono') + ': ' + state.phone,
      '✉️ Email: ' + (state.email || '—'),
      (en ? '🦷 Treatment' : '🦷 Tratamiento') + ': ' + LS(tr),
      (en ? '📅 Preferred date' : '📅 Fecha preferida') + ': ' + (state.date ? A.fmtDate(state.date) : '—'),
      (en ? '⏰ Time slot' : '⏰ Franja') + ': ' + (sl ? LS(sl) : '—'),
      '',
      (en ? '📝 My situation' : '📝 Mi caso') + ':',
      state.condition,
      '',
      en ? 'Thank you, I look forward to your confirmation.' : 'Gracias, quedo a la espera de confirmación.'
    ].join('\n');
  }

  /* ---------- Google Sheet sync (fire & forget) ---------- */
  function sheetRow() {
    var tr = treatmentByCode(state.treatment);
    var sl = slotByCode(state.slot);
    return {
      Timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      Reference: state.reference,
      Name: state.fullName,
      Phone: state.phone,
      Email: state.email || '-',
      Treatment: LS(tr),
      TreatmentCode: state.treatment,
      Date: state.date,
      Slot: sl ? LS(sl) : '-',
      SlotCode: state.slot,
      Condition: state.condition,
      Source: state.source,
      WhatsAppSent: 'yes',
      Status: 'New'
    };
  }

  function sendToSheet(row) {
    if (!C.sheetUrl) return Promise.resolve({ status: 'not_configured' });
    /* text/plain avoids a CORS pre-flight; the Apps Script reads e.postData.contents */
    return fetch(C.sheetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ headers: Object.keys(row), row: row })
    }).then(function () {
      return { status: 'synced' };
    }).catch(function () {
      return { status: 'failed' };
    });
  }

  function saveLocal(row, syncStatus) {
    var all = A.store('ma-bookings') || [];
    all.push(Object.assign({ _saved: new Date().toISOString(), _sync: syncStatus }, row));
    A.store('ma-bookings', all.slice(-100));
    if (syncStatus !== 'synced') A.store('ma-sheet-queue', all.filter(function (r) { return r._sync !== 'synced'; }));
  }

  function flushQueue() {
    if (!C.sheetUrl) return;
    var queue = A.store('ma-sheet-queue');
    if (!queue || !queue.length) return;
    var pending = queue.slice();
    Promise.all(pending.map(function (row) {
      var clean = Object.assign({}, row);
      delete clean._saved; delete clean._sync;
      return sendToSheet(clean);
    })).then(function () {
      A.store('ma-sheet-queue', []);
    });
  }

  /* ---------- submit ---------- */
  function submit() {
    var next = $('#nextBtn');
    if (!state.reference) state.reference = reference();

    next.disabled = true;
    var text = waText();
    var link = A.waLink(text);
    var row = sheetRow();

    sendToSheet(row).then(function (res) {
      state.synced = res.status === 'synced';
      saveLocal(row, res.status);

      var opened = false;
      if (link) {
        var win = window.open(link, '_blank', 'noopener');
        opened = !!win;
        if (!opened) location.href = link;   /* pop-up blocked → navigate instead */
      }

      showDone(link, text, res.status);
      next.disabled = false;
    });
  }

  function showDone(link, text, syncStatus) {
    var host = $('#bookingHost');
    host.innerHTML =
      '<div class="card rv in center" style="padding:clamp(1.6rem,1rem+2vw,2.6rem)">' +
        '<div class="tick-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg></div>' +
        '<h2 class="h-2" style="margin-bottom:10px">' + t('confirmH') + '</h2>' +
        '<p class="small" style="color:var(--muted);max-width:46ch;margin-inline:auto">' + t('confirmP') + '</p>' +
        '<div style="margin:20px 0"><span class="ref">' + icon('sheet', 'ico--sm') + ' ' + esc(state.reference) + '</span></div>' +
        '<div style="display:grid;gap:11px;max-width:420px;margin-inline:auto">' +
          (link ? '<a class="btn btn--mint btn--lg btn--block" id="waSend" target="_blank" rel="noopener" href="' + link + '">' + icon('whatsapp') + ' ' + t('openWaSend') + '</a>' : '') +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">' +
            '<button class="btn btn--outline btn--sm" type="button" id="copyBtn">' + icon('copy', 'ico--sm') + ' ' + t('copyMsg') + '</button>' +
            '<a class="btn btn--outline btn--sm" href="tel:' + C.phoneHref + '">' + icon('phone', 'ico--sm') + ' ' + t('callInstead') + '</a>' +
          '</div>' +
        '</div>' +
        '<div class="alert alert--info" style="margin-top:22px;text-align:left">' + icon('info', 'ico--sm') +
          '<span>' + t('waHint') + '</span></div>' +
      '</div>' +

      '<div class="card rv in" style="margin-top:var(--g)">' +
        '<div class="flex between items-center" style="gap:12px;flex-wrap:wrap;margin-bottom:14px">' +
          '<h3>' + t('summary') + '</h3>' +
          '<span class="badge ' + (syncStatus === 'synced' ? 'badge--mint' : '') + '">' +
            icon(syncStatus === 'synced' ? 'sheet' : 'info', 'ico--sm') +
            (syncStatus === 'synced' ? t('syncedTo') : t('savedIn')) +
          '</span>' +
        '</div>' +
        '<dl class="summary" id="summary2"></dl>' +
      '</div>' +

      '<div class="g3" style="margin-top:var(--g)">' +
        [['checkCircle', t('ns1'), t('ns1d')], ['calendar', t('ns2'), t('ns2d')], ['emergency', t('ns3'), t('ns3d')]].map(function (b, i) {
          return '<div class="card rv" data-d="' + i + '">' +
            '<span class="chip-ico">' + icon(b[0]) + '</span>' +
            '<h3 style="margin-top:14px">' + esc(b[1]) + '</h3>' +
            '<p class="small" style="color:var(--muted)">' + esc(b[2]) + '</p></div>';
        }).join('') +
      '</div>' +

      '<p class="center" style="margin-top:2rem"><a class="link-more" href="index.html">' + t('backHome') + ' ' + icon('arrow', 'ico--sm') + '</a></p>';

    /* summary copy */
    var tr = treatmentByCode(state.treatment), sl = slotByCode(state.slot);
    $('#summary2').innerHTML = [
      [t('ref'), state.reference],
      [t('name'), state.fullName],
      [t('phoneWa'), state.phone],
      [t('treatment'), LS(tr)],
      [t('date'), state.date ? A.fmtDate(state.date) : '—'],
      [t('slot'), sl ? LS(sl) : '—'],
      [t('yourCase'), state.condition]
    ].map(function (r) {
      return '<div class="summary__row"><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>';
    }).join('');

    $('#copyBtn').addEventListener('click', function () {
      A.copyText(text).then(function () {
        A.toast(t('copied'), 'ok');
        var b = $('#copyBtn');
        b.innerHTML = icon('check', 'ico--sm') + ' ' + t('copied');
      }).catch(function () { A.toast('⚠', 'err'); });
    });

    /* second attempt to open WhatsApp once the user interacts again */
    var opened = false;
    document.addEventListener('visibilitychange', function once() {
      if (!document.hidden && !opened) {
        opened = true;
        document.removeEventListener('visibilitychange', once);
        var wa = $('#waSend');
        if (wa) window.open(wa.href, '_blank', 'noopener');
      }
    });

    window.scrollTo({ top: host.offsetTop - 90, behavior: 'smooth' });
    A.toast(t('confirmH'), 'ok');
  }

  build();
  flushQueue();
};
