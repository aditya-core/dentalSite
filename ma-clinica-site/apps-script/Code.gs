/**
 * MA Clínica Dental — Google Sheets endpoint (static-site version)
 * ----------------------------------------------------------------
 * The site posts appointments straight from the browser, so this script must
 * work with a simple cross-origin POST. The browser sends the JSON with
 * Content-Type: text/plain and mode: no-cors, which avoids a CORS pre-flight;
 * the payload is still readable here through e.postData.contents.
 *
 * SETUP (2 minutes)
 *  1. Create (or open) the Google Sheet that will store the appointments.
 *  2. Extensions → Apps Script.
 *  3. Delete the sample code, paste this whole file, save.
 *  4. Deploy → New deployment → Web app
 *       - Execute as:     Me
 *       - Who has access: Anyone
 *  5. Authorise, then copy the URL that ends in /exec.
 *  6. Open assets/js/data.js and set:
 *         sheetUrl: 'https://script.google.com/macros/s/XXXX/exec'
 *
 *  The header row is created automatically on the first submission.
 *  Rows are indexed by the Reference column (the code shown to the patient).
 */

var TAB_NAME = 'Citas';   // leave empty to use the first sheet

var HEADERS = [
  'Timestamp', 'Reference', 'Name', 'Phone', 'Email',
  'Treatment', 'TreatmentCode', 'Date', 'Slot', 'SlotCode',
  'Condition', 'Source', 'WhatsAppSent', 'Status'
];

/** Health check: open the /exec URL in a browser. */
function doGet() {
  return json({ ok: true, service: 'MA Clinica Dental appointments', headers: HEADERS });
}

/** Receives one appointment and appends it. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    var payload = parsePayload(e);
    var row = payload.row || payload;
    if (!row.Name) return json({ ok: false, error: 'Missing Name' });

    var sheet = getSheet();
    ensureHeaders(sheet);

    sheet.appendRow(HEADERS.map(function (key) {
      var v = row[key];
      return v === undefined || v === null ? '' : String(v).slice(0, 1000);
    }));

    formatSheet(sheet);
    return json({ ok: true, result: 'success', row: sheet.getLastRow(), reference: row.Reference || '' });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

/* ------------------------------------------------------------------ */

function parsePayload(e) {
  var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '';
  if (!raw) return {};
  try { return JSON.parse(raw); } catch (err) {
    if (e && e.parameter && e.parameter.data) {
      try { return JSON.parse(e.parameter.data); } catch (err2) {}
    }
    return {};
  }
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('This script must be bound to a spreadsheet.');
  var sheet = TAB_NAME ? ss.getSheetByName(TAB_NAME) : null;
  if (!sheet) sheet = TAB_NAME ? ss.insertSheet(TAB_NAME) : ss.getSheets()[0];
  return sheet;
}

function ensureHeaders(sheet) {
  var first = sheet.getLastRow() === 0 ? '' : String(sheet.getRange(1, 1).getValue()).trim();
  if (first !== HEADERS[0]) {
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setValues([HEADERS])
      .setFontWeight('bold')
      .setBackground('#0e6b5e')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
}

function formatSheet(sheet) {
  var widths = [150, 110, 160, 130, 180, 150, 110, 100, 160, 110, 320, 110, 110, 100];
  widths.forEach(function (w, i) {
    try { sheet.setColumnWidth(i + 1, w); } catch (ignored) {}
  });
  var last = sheet.getLastRow();
  if (last > 1) sheet.getRange(2, 11, last - 1, 1).setWrap(true);
  try { sheet.getRange(1, 1, last, HEADERS.length).createFilter(); } catch (ignored) {}
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
