/**
 * Unit-tests apps-script/Code.gs against an in-memory fake of the Google
 * Apps Script SpreadsheetApp API.  Run:  node tools/test-apps-script.js
 */
const fs = require('fs');
const vm = require('vm');

const ROOT = '/home/user/ma-clinica-site';
let pass = 0, fail = 0;
const ok = (c, l, x) => { c ? (pass++, console.log('  ok   ' + l)) : (fail++, console.log('  FAIL ' + l + (x ? ' — ' + x : ''))); };

/* ---- fake Apps Script environment ---- */
function makeEnv() {
  const rows = [];
  const sheet = {
    rows,
    getLastRow: () => rows.length,
    getRange: (r, c) => {
      const range = {
        setValues: v => { for (let i = 0; i < v.length; i++) rows[r - 1 + i] = v[i].slice(); return range; },
        getValue: () => (rows[r - 1] ? rows[r - 1][c - 1] : ''),
        setFontWeight: () => range, setBackground: () => range, setFontColor: () => range,
        setWrap: () => range, createFilter: () => range,
      };
      return range;
    },
    appendRow: r => rows.push(r),
    setFrozenRows: () => {},
    setColumnWidth: () => {},
  };
  const ss = { getSheetByName: () => null, insertSheet: () => sheet, getSheets: () => [sheet] };
  return {
    sheet,
    sandbox: {
      SpreadsheetApp: { getActiveSpreadsheet: () => ss },
      LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
      ContentService: {
        MimeType: { JSON: 'application/json' },
        createTextOutput: s => ({ setMimeType: () => ({ body: s }) }),
      },
      console,
    },
  };
}

function loadScript(env) {
  const ctx = vm.createContext(env.sandbox);
  vm.runInContext(fs.readFileSync(ROOT + '/apps-script/Code.gs', 'utf8'), ctx, { filename: 'Code.gs' });
  return ctx;
}

/* ---- tests ---- */
console.log('\n▸ Apps Script endpoint');

{ /* health check */
  const { sandbox } = makeEnv();
  const ctx = loadScript({ sandbox });
  const out = JSON.parse(ctx.doGet().body);
  ok(out.ok === true, 'doGet health check returns ok:true');
  ok(Array.isArray(out.headers) && out.headers.length === 14, 'exposes the 14 column headers', out.headers && out.headers.length);
}

{ /* first submission creates the header row, then the data row */
  const env = makeEnv();
  const ctx = loadScript(env);
  const payload = {
    row: {
      Reference: 'MA-AB12CD', Name: 'Lucía Fernández', Phone: '612345678', Email: 'lucia@example.com',
      Treatment: 'Dolor o urgencia', TreatmentCode: 'dolor', Date: '2026-10-10', Slot: 'Mañana (10:00 – 14:00)',
      SlotCode: 'manana', Condition: 'Me duele la muela inferior derecha.', Source: 'web', WhatsAppSent: 'yes', Status: 'new',
    },
  };
  const res = JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify(payload), type: 'text/plain' } }).body);
  ok(res.ok === true, 'doPost accepts a text/plain JSON body (no CORS preflight)', JSON.stringify(res));
  ok(res.row === 2, 'appended as sheet row 2 (row 1 = headers)', res.row);
  ok(res.reference === 'MA-AB12CD', 'echoes the reference back', res.reference);
  ok(env.sheet.rows[0][0] === 'Timestamp' && env.sheet.rows[0][1] === 'Reference', 'header row auto-created');
  ok(env.sheet.rows[1][1] === 'MA-AB12CD', 'reference indexed in column B', env.sheet.rows[1][1]);
  ok(env.sheet.rows[1][2] === 'Lucía Fernández', 'name stored', env.sheet.rows[1][2]);
  ok(env.sheet.rows[1][10] === 'Me duele la muela inferior derecha.', 'condition stored in column K', env.sheet.rows[1][10]);
  ok(env.sheet.rows[1].length === 14, 'row has all 14 columns', env.sheet.rows[1].length);
}

{ /* second submission appends below, header not duplicated */
  const env = makeEnv();
  const ctx = loadScript(env);
  const post = o => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify({ row: o }), type: 'text/plain' } }).body);
  post({ Reference: 'MA-AAAAAA', Name: 'Uno' });
  post({ Reference: 'MA-BBBBBB', Name: 'Dos' });
  ok(env.sheet.rows.length === 3, 'two submissions → header + 2 rows', env.sheet.rows.length);
  ok(env.sheet.rows.filter(r => r[0] === 'Timestamp').length === 1, 'header written once');
  ok(env.sheet.rows[2][2] === 'Dos', 'second booking stored in order');
}

{ /* malformed / hostile input */
  const env = makeEnv();
  const ctx = loadScript(env);
  const r1 = JSON.parse(ctx.doPost({ postData: { contents: 'not json at all' } }).body);
  ok(r1.ok === false, 'garbage body rejected', JSON.stringify(r1));
  const r2 = JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify({ row: { Phone: '600' } }) } }).body);
  ok(r2.ok === false && /Name/.test(r2.error), 'missing Name rejected', JSON.stringify(r2));
  const r3 = JSON.parse(ctx.doPost({}).body);
  ok(r3.ok === false, 'empty POST body rejected without throwing', JSON.stringify(r3));
  const long = 'x'.repeat(5000);
  const r4 = JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify({ row: { Name: 'Ana', Condition: long } }) } }).body);
  ok(r4.ok === true, 'oversized condition accepted');
  ok(env.sheet.rows[1][10].length === 1000, 'values truncated to 1000 chars', env.sheet.rows[1][10].length);
}

{ /* flat payload (no .row wrapper) also works */
  const env = makeEnv();
  const ctx = loadScript(env);
  const r = JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify({ Name: 'Flat', Reference: 'MA-FLAT01' }) } }).body);
  ok(r.ok === true, 'flat payload accepted', JSON.stringify(r));
  ok(env.sheet.rows[1][2] === 'Flat', 'flat payload stored');
}

{ /* missing spreadsheet → clear error, no crash */
  const env = makeEnv();
  env.sandbox.SpreadsheetApp.getActiveSpreadsheet = () => null;
  const ctx = loadScript(env);
  const r = JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify({ row: { Name: 'X' } }) } }).body);
  ok(r.ok === false && /spreadsheet/i.test(r.error), 'unbound script reports a readable error', JSON.stringify(r));
}

console.log('\n' + '─'.repeat(52));
console.log(`  ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
