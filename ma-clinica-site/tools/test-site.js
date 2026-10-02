/**
 * End-to-end checks for the static site. Runs every page in jsdom, drives the
 * booking wizard, the filters and the language switch, and asserts real output.
 *   node tools/test-site.js        (needs: npm i jsdom, server on :8090)
 */
const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');
const vm = require('vm');

const ROOT = '/home/user/ma-clinica-site';
const ORIGIN = 'http://127.0.0.1:8090/';

let pass = 0, fail = 0;
const failures = [];
function ok(cond, label, extra) {
  if (cond) { pass++; console.log('  ok   ' + label); }
  else { fail++; failures.push(label + (extra ? ' — ' + extra : '')); console.log('  FAIL ' + label + (extra ? ' — ' + extra : '')); }
}
function section(name) { console.log('\n▸ ' + name); }

function load(file, opts = {}) {
  /* Strip <script> tags, then run them ourselves in document order. Local files
     are read from disk; anything remote (Google Fonts, OSM iframe) is skipped. */
  const html = fs.readFileSync(ROOT + '/' + file, 'utf8');
  const scripts = [];
  const cleaned = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (m, attrs, body) => {
    if (/\btype\s*=\s*["'](?!text\/javascript)/i.test(attrs)) return '';   /* JSON-LD etc. */
    const src = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(attrs);
    scripts.push(src ? { src: src[1], code: null } : { src: null, code: body });
    return '';
  });

  const errs = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errs.push('jsdomError: ' + (e.message || e)));
  vc.on('error', (...a) => errs.push('console.error: ' + a.join(' ')));

  const dom = new JSDOM(cleaned, {
    runScripts: 'dangerously',
    url: ORIGIN + file + (opts.hash || ''),
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(w) {
      w.localStorage.setItem('ma-lang', opts.lang || 'es');
      w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
      w.matchMedia = q => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
      w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = function () {};
      w.open = () => null;
      w.__errs = errs;
      w.addEventListener('error', e => errs.push(String(e.message || e.error)));
      w.addEventListener('unhandledrejection', e => errs.push('rejection: ' + e.reason));
    },
  });

  const w = dom.window;
  const ctx = dom.getInternalVMContext();
  for (const sc of scripts) {
    if (sc.src) {
      if (!/^[.\/]/.test(sc.src) && !/^assets\//.test(sc.src)) continue;   /* skip remote */
      const p = ROOT + '/' + sc.src.replace(/^\.\//, '');
      if (!fs.existsSync(p)) { errs.push('missing script ' + sc.src); continue; }
      try { vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: sc.src }); }
      catch (e) { errs.push(sc.src + ': ' + e.message); }
    } else if (sc.code && sc.code.trim()) {
      try { vm.runInContext(sc.code, ctx, { filename: file + ' (inline)' }); }
      catch (e) { errs.push('inline: ' + e.message); }
    }
  }
  return dom;
}
const settle = (w, ms = 150) => new Promise(r => setTimeout(r, ms));
const $ = (w, s) => w.document.querySelector(s);
const $$ = (w, s) => Array.from(w.document.querySelectorAll(s));
const txt = (w, s) => ($(w, s) ? $(w, s).textContent.replace(/\s+/g, ' ').trim() : null);

async function main() {
  /* ── 1. every page renders in both languages ─────────────── */
  section('Page render (ES + EN)');
  const files = ['index.html', 'updates.html', 'products.html', 'booking.html', 'contact.html', 'legal.html', '404.html'];
  const bodies = {};
  for (const lang of ['es', 'en']) {
    for (const f of files) {
      const dom = load(f, { lang });
      const w = dom.window;
      await settle(w, 250);
      const errs = w.__errs.filter(e => !/openstreetmap|createObjectURL/.test(e));
      const text = w.document.body.textContent.replace(/\s+/g, ' ').trim();
      ok(errs.length === 0, `[${lang}] ${f} no JS errors`, errs.join(' | '));
      ok(w.document.getElementById('hdr') !== null, `[${lang}] ${f} header mounted`);
      ok(w.document.querySelector('.foot') !== null, `[${lang}] ${f} footer mounted`);
      ok(!/\bundefined\b|\[object Object\]/.test(text), `[${lang}] ${f} no undefined in text`);
      if (!bodies[f]) bodies[f] = {};
      bodies[f][lang] = text;
      dom.window.close();
    }
  }

  /* ── 2. language switch actually changes copy ────────────── */
  section('Language toggle');
  for (const f of files) {
    const a = bodies[f].es, b = bodies[f].en;
    ok(a !== b, `${f} ES/EN output differs`, a.slice(0, 60));
  }
  const domIdx = load('index.html', { lang: 'en' });
  await settle(domIdx.window, 250);
  ok(txt(domIdx.window, '#hdr .lang b') === 'ES', 'EN header offers ES toggle', txt(domIdx.window, '#hdr .lang b'));
  ok($$(domIdx.window, '#drawer .drawer__lang button[data-lang]').length === 2, 'drawer has 2 language buttons', $$(domIdx.window,'#drawer [data-lang]').length);

  /* the single menu button must flip the language and persist it */
  const domEs = load('index.html', { lang: 'es' });
  const wes = domEs.window;
  await settle(wes, 250);
  ok(wes.App.lang === 'es', 'defaults to Spanish');
  wes.location.reload = () => {};                       /* jsdom cannot navigate */
  $(wes, '#langBtn').click();
  ok(wes.localStorage.getItem('ma-lang') === 'en', 'header button switches ES → EN and persists', wes.localStorage.getItem('ma-lang'));
  wes.localStorage.setItem('ma-lang', 'es');
  $$(wes, '#drawer button[data-lang="en"]')[0].click();
  ok(wes.localStorage.getItem('ma-lang') === 'en', 'drawer English button works');
  ok($(wes, '#drawer button[data-lang="en"]').getAttribute('aria-pressed') !== null, 'drawer language buttons expose aria-pressed');
  ok($$(wes, '#drawer button[data-lang]').length === 2, 'exactly two languages offered');
  domEs.window.close();
  domIdx.window.close();

  /* ── 3. home content blocks populated from data.js ───────── */
  section('Home content');
  const dh = load('index.html');
  const wh = dh.window;
  await settle(wh, 250);
  const C = wh.CLINIC;
  ok(C && C.services.length === 8, 'data.js exposes 8 services', C && C.services.length);
  ok($$(wh, '#services .svc').length === C.services.length, 'all services rendered', $$(wh, '#services .svc').length);
  ok($$(wh, '#tech .tech-card, #tech .card').length === C.tech.length, 'tech cards rendered', $$(wh, '#tech .tech-card, #tech .card').length);
  ok($$(wh, '#faq .acc__item').length === C.faqs.length, 'FAQ items rendered', $$(wh, '#faq .acc__item').length);
  ok($$(wh, '#rail .quote').length === C.testimonials.length, 'testimonials rendered', $$(wh, '#rail .quote').length);
  ok($$(wh, '#marquee .marquee__item, #marquee span').length > 0, 'marquee populated');
  ok($$(wh, '#hoursTable tr').length === C.hours.length, 'hours rows rendered', $$(wh, '#hoursTable tr').length);
  ok(wh.App.mapsHref().includes(encodeURIComponent(C.mapQuery)), 'mapsHref built from mapQuery');
  ok(/Dentist/.test(wh.document.head.innerHTML), 'JSON-LD Dentist schema present');
  dh.window.close();

  /* ── 4. updates: filters, search, hash reader ────────────── */
  section('Updates page');
  const du = load('updates.html');
  const wu = du.window;
  await settle(wu, 250);
  const CU = wu.CLINIC;
  ok($$(wu, '#updatesList .post').length === CU.updates.length, 'all updates listed', $$(wu, '#updatesList .post').length);
  const firstCat = Object.keys(CU.updateCats)[0];
  const chip = $$(wu, '#updateFilters .fchip').find(b => b.dataset.cat === firstCat);
  if (chip) { chip.click(); await settle(wu);
    const expected = CU.updates.filter(u => u.cat === firstCat).length;
    ok($$(wu, '#updatesList .post').length === expected, `filter "${firstCat}" narrows list`, $$(wu, '#updatesList .post').length + ' vs ' + expected);
  } else ok(false, 'category chip present for ' + firstCat);
  const slug = CU.updates[0].slug;
  du.window.location.hash = slug;
  await settle(wu, 250);
  ok(wu.document.querySelector('#updateReader') && txt(wu, '#updateReader').length > 200, 'hash opens inline reader', (txt(wu, '#updateReader') || '').length);
  du.window.close();

  /* ── 5. products: filter + sort ──────────────────────────── */
  section('Products page');
  const dp = load('products.html');
  const wp = dp.window;
  await settle(wp, 250);
  const CP = wp.CLINIC;
  ok($$(wp, '#productGrid .prod').length === CP.products.length, 'all products rendered', $$(wp, '#productGrid .prod').length);
  const sel = wp.document.getElementById('sortSelect');
  ok(!!sel, 'sort select present');
  if (sel) {
    sel.value = 'priceDesc';
    sel.dispatchEvent(new wp.Event('change', { bubbles: true }));
    await settle(wp);
    const prices = $$(wp, '#productGrid .prod .price b').map(b => {
      const m = b.textContent.match(/([\d.,]+)/); return m ? parseFloat(m[1].replace(/\./g, '').replace(',', '.')) : 0;
    }).filter(n => n > 0);
    const sorted = prices.every((v, i) => i === 0 || prices[i - 1] >= v);
    ok(sorted, 'sort by price descending orders cards', prices.slice(0, 4).join(','));
  }
  const waLink = $$(wp, '#productGrid a[href*="wa.me"]').length;
  ok(waLink === CP.products.length, 'every product has a WhatsApp enquiry link', waLink);
  dp.window.close();

  /* ── 6. booking wizard, step by step ─────────────────────── */
  section('Booking wizard (full 4 steps)');
  const db = load('booking.html');
  const wb = db.window;
  await settle(wb, 250);
  ok(!!wb.document.getElementById('bookingForm'), 'wizard mounted');

  const setVal = (sel, v) => { const el = $(wb, sel); if (!el) return false; el.value = v; el.dispatchEvent(new wb.Event('input', { bubbles: true })); el.dispatchEvent(new wb.Event('change', { bubbles: true })); return true; };
  const clickNext = () => { const b = $(wb, '#nextBtn'); if (b) { b.click(); return true; } return false; };

  /* step 1: submit empty must be blocked */
  clickNext(); await settle(wb);
  ok($$(wb, '.is-bad').length > 0, 'empty step 1 shows validation errors', $$(wb, '.is-bad').length);
  ok($$(wb, '.step.is-active').length === 1, 'stays on step 1 when invalid');

  setVal('#f-fullName', 'Lucía Fernández');
  setVal('#f-phone', '612345678');
  setVal('#f-email', 'lucia@example.com');
  clickNext(); await settle(wb);
  ok($$(wb, '.step')[1].classList.contains('is-active'), 'step 1 valid → advances to step 2');

  const pill1 = $$(wb, '.step.is-active input[name="treatment"]')[0];
  ok($$(wb, '.step.is-active input[name="treatment"]').length === wb.CLINIC.treatments.length, 'treatment options present', $$(wb,'.step.is-active input[name="treatment"]').length);
  if (pill1) { pill1.checked = true; pill1.dispatchEvent(new wb.Event('change', { bubbles: true })); }
  clickNext(); await settle(wb);
  ok($$(wb, '.step')[2].classList.contains('is-active'), 'step 2 → step 3');

  const dateInput = $$(wb, '.step.is-active input[type="date"]')[0];
  ok(!!dateInput, 'date input present on step 3');
  if (dateInput) {
    ok(!!dateInput.min, 'date input blocks past dates (min set)', dateInput.min);
    dateInput.value = dateInput.min || wb.App.todayISO();
    dateInput.dispatchEvent(new wb.Event('change', { bubbles: true }));
  }
  const slot = $$(wb, '.step.is-active input[name="slot"]')[1];
  ok($$(wb, '.step.is-active input[name="slot"]').length === wb.CLINIC.slots.length, 'time slot options present', $$(wb,'.step.is-active input[name="slot"]').length);
  if (slot) { slot.checked = true; slot.dispatchEvent(new wb.Event('change', { bubbles: true })); }
  clickNext(); await settle(wb);
  ok($$(wb, '.step')[3].classList.contains('is-active'), 'step 3 → step 4');

  setVal('#f-condition', 'Me duele la muela inferior derecha desde hace tres días.');
  const consent = wb.document.getElementById('f-consent');
  ok(!!consent, 'consent checkbox present');
  clickNext(); await settle(wb);
  ok($$(wb, '.is-bad').length > 0, 'consent required before review', $$(wb,'.is-bad').length);
  if (consent) { consent.checked = true; consent.dispatchEvent(new wb.Event('change', { bubbles: true })); }
  clickNext(); await settle(wb);

  /* final submit → reference + whatsapp + localStorage */
  const sendBtn = $(wb, '#nextBtn');
  ok(/whatsapp/i.test(sendBtn.textContent), 'review step turns Next into a WhatsApp submit', sendBtn.textContent.trim());
  sendBtn.click();
  await settle(wb, 500);            /* submit awaits the sheet POST promise */

  const doneLink = $$(wb, '#bookingHost a[href*="wa.me"]')[0];
  ok(!!doneLink, 'confirmation exposes the WhatsApp link');
  const href = doneLink ? doneLink.getAttribute('href') : '';
  if (href) {
    ok(href.startsWith('https://wa.me/34600000000?text='), 'wa.me number from data.js', href.slice(0, 40));
    const decoded = decodeURIComponent(href.split('text=')[1] || '');
    ok(/Lucía Fernández/.test(decoded), 'name in WhatsApp message');
    ok(/612345678/.test(decoded), 'phone in WhatsApp message');
    ok(/lucia@example\.com/.test(decoded), 'email in WhatsApp message');
    ok(/muela inferior derecha/.test(decoded), 'condition in WhatsApp message');
    ok(/MA-[A-Z2-9]{6}/.test(decoded), 'reference in WhatsApp message', (decoded.match(/MA-[A-Z2-9]{6}/) || [''])[0]);
    ok(/Tratamiento|tratamiento/.test(decoded), 'treatment in WhatsApp message');
  }
  const stored = JSON.parse(wb.localStorage.getItem('ma-bookings') || '[]');
  ok(stored.length === 1, 'booking saved to localStorage', stored.length);
  ok(stored[0] && /^MA-[A-Z2-9]{6}$/.test(stored[0].Reference), 'reference format MA-XXXXXX', stored[0] && stored[0].Reference);
  ok(stored[0] && (stored[0].Condition || '').length > 10, 'condition stored', stored[0] && stored[0].Condition);
  ok(stored[0] && stored[0].Name === 'Lucía Fernández', 'name stored', stored[0] && stored[0].Name);
  ok(stored[0] && /^\d{4}-\d{2}-\d{2}$/.test(stored[0].Date), 'date stored as ISO', stored[0] && stored[0].Date);
  ok(stored[0] && stored[0].SlotCode && stored[0].TreatmentCode, 'codes stored for sheet indexing');
  ok($$(wb, '#bookingHost .ref, #bookingHost .tick-wrap, #bookingHost .alert--ok').length > 0, 'confirmation screen shown');
  ok($$(wb, 'a[href*="tel:"], button#copyMsg, #copyMsg').length > 0, 'call / copy fallback offered');
  db.window.close();

  /* ── 7. booking in English produces English WhatsApp text ── */
  section('Booking in English');
  const de = load('booking.html', { lang: 'en' });
  const we = de.window;
  await settle(we, 250);
  const setV = (s, v) => { const el = $(we, s); if (el) { el.value = v; el.dispatchEvent(new we.Event('input', { bubbles: true })); el.dispatchEvent(new we.Event('change', { bubbles: true })); } };
  const next = () => { const b = $(we, '#nextBtn'); if (b) b.click(); };
  setV('#f-fullName', 'John Smith'); setV('#f-phone', '699888777');
  next(); await settle(we);
  const p1 = $$(we, '.step.is-active input[name="treatment"]')[0]; if (p1) { p1.checked = true; p1.dispatchEvent(new we.Event('change', { bubbles: true })); }
  next(); await settle(we);
  const d2 = $$(we, '.step.is-active input[type="date"]')[0];
  if (d2) { d2.value = d2.min || we.App.todayISO(); d2.dispatchEvent(new we.Event('change', { bubbles: true })); }
  const s2 = $$(we, '.step.is-active input[name="slot"]')[1]; if (s2) { s2.checked = true; s2.dispatchEvent(new we.Event('change', { bubbles: true })); }
  next(); await settle(we);
  setV('#f-condition', 'I chipped a front tooth playing football.');
  const c2 = $$(we, '.step.is-active input[type="checkbox"]')[0];
  if (c2) { c2.checked = true; c2.dispatchEvent(new we.Event('change', { bubbles: true })); }
  next(); await settle(we);
  const sendEn = $(we, '#nextBtn');
  ok(/whatsapp/i.test(sendEn.textContent), 'EN review step offers WhatsApp submit', sendEn.textContent.trim());
  sendEn.click();
  await settle(we, 500);
  const doneEn = $$(we, '#bookingHost a[href*="wa.me"]')[0];
  const decEn = doneEn ? decodeURIComponent((doneEn.getAttribute('href').split('text=')[1]) || '') : '';
  ok(/New appointment request|Reference/.test(decEn), 'English WhatsApp template used', decEn.split('\n')[0]);
  ok(/John Smith/.test(decEn), 'English booking carries the name');
  ok(/MA-[A-Z2-9]{6}/.test(decEn), 'English booking carries a reference');
  de.window.close();

  /* ── 8. contact form ─────────────────────────────────────── */
  section('Contact form');
  const dc = load('contact.html');
  const wc = dc.window;
  await settle(wc, 250);
  ok(!!wc.document.getElementById('contactForm'), 'contact form mounted');
  const cbtn = $$(wc, '#contactForm button[type="submit"]')[0];
  ok(!!cbtn, 'submit button present');
  if (cbtn) { cbtn.click(); await settle(wc); }
  ok($$(wc, '.is-bad, .err').length > 0, 'empty contact form blocked', $$(wc, '.is-bad, .err').length);
  const cset = (sel, v) => { const el = $(wc, sel); if (el) { el.value = v; el.dispatchEvent(new wc.Event('input', { bubbles: true })); } };
  cset('#c-name', 'Marta Ruiz');
  cset('#c-email', 'marta@example.com');
  cset('#c-phone', '611222333');
  cset('#c-subject', 'Implantes');
  cset('#c-message', 'Quiero información sobre implantes dentales, por favor.');
  cbtn.click(); await settle(wc, 250);
  const msgs = JSON.parse(wc.localStorage.getItem('ma-messages') || '[]');
  ok(msgs.length === 1, 'message stored in localStorage', msgs.length);
  ok(msgs[0] && msgs[0].name === 'Marta Ruiz', 'name stored', msgs[0] && msgs[0].name);
  ok(msgs[0] && /implantes/i.test(msgs[0].message), 'message body stored', msgs[0] && msgs[0].message);
  const waC = $$(wc, '#contactResult a[href*="wa.me"]')[0];
  ok(!!waC, 'WhatsApp hand-off link produced');
  if (waC) {
    const dec = decodeURIComponent(waC.getAttribute('href'));
    ok(/^https:\/\/wa\.me\/34600000000\?text=/.test(waC.getAttribute('href')), 'contact WhatsApp uses clinic number');
    ok(/Marta Ruiz/.test(dec), 'name in contact message');
    ok(/implantes/i.test(dec), 'message text in WhatsApp body');
  }
  ok(!!$(wc, '#contactResult a[href^="mailto:"]'), 'email fallback offered');
  ok($(wc, '#contactResult .alert--ok') !== null, 'success notice shown');
  dc.window.close();

  /* ── 9. nav + footer wiring ──────────────────────────────── */
  section('Navigation & footer');
  const dn = load('index.html');
  const wn = dn.window;
  await settle(wn, 250);
  const navs = $$(wn, '#hdr .nav a').map(a => a.getAttribute('href'));
  ok(JSON.stringify(navs) === JSON.stringify(['index.html', 'updates.html', 'products.html', 'contact.html']), 'nav = Home/Updates/Products/Contact', navs.join(','));
  ok($$(wn, '#hdr .nav a[aria-current="page"]').length === 1, 'current page marked in nav');
  ok(!!$('#' === '' ? wn : wn, '#hdr .hdr__book'), 'header Book button present');
  ok(!!$(wn, '#burger'), 'burger present for mobile');
  const footLinks = $$(wn, '.foot a').map(a => a.getAttribute('href')).filter(Boolean);
  ok(footLinks.some(h => h === 'booking.html'), 'footer links to booking');
  ok(footLinks.some(h => /legal\.html/.test(h)), 'footer links to legal');
  ok(!!$(wn, '.fab-stack'), 'floating action buttons present');
  dn.window.close();

  /* ── summary ─────────────────────────────────────────────── */
  console.log('\n' + '─'.repeat(56));
  console.log(`  ${pass} passed, ${fail} failed`);
  if (fail) { console.log('\nFailures:'); failures.forEach(f => console.log('  • ' + f)); }
  process.exit(fail ? 1 : 0);
}
main().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
