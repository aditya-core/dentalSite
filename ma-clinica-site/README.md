# MA Clínica Dental — static site

Pure **HTML + CSS + JavaScript**. No build step, no framework, no server required.
Open `index.html` in a browser, or host the folder anywhere (Netlify, Vercel, GitHub Pages, S3, any static host).

```
index.html     → landing page (long scroll: services, technology, reviews, products, news, FAQ, location)
updates.html   → filterable news + inline reading view (deep links: updates.html#slug)
products.html  → filterable + sortable catalogue with per-product WhatsApp enquiry
contact.html   → contact details, hours, map, validated contact form
booking.html   → 4-step booking wizard → WhatsApp deep link + Google Sheet
legal.html     → privacy + legal notice
404.html       → not-found page
apps-script/   → Code.gs — Google Sheets endpoint for the bookings
tools/         → test suite (jsdom) — see "Tests" below
assets/        → css / js / img
```

---

## Run it locally

```bash
cd ma-clinica-site
python3 -m http.server 8080
# → http://localhost:8080
```

Any static file server works (`npx serve`, `php -S`, nginx, …).

---

## Configure the clinic (one file)

Everything lives in **`assets/js/data.js`** — phone, WhatsApp number, address, map,
services, products, news, FAQs, reviews and the Google Sheet endpoint.

```js
window.CLINIC = {
  whatsapp: '34600000000',   // ← digits only, international, no + or spaces
  phone:    '+34 910 000 000',
  email:    'hola@maclinicadental.com',
  sheetUrl: '',              // ← Apps Script /exec URL (see below)
  ...
}
```

---

## Language switch (ES ⇄ EN)

The **EN / ES** pill in the header (and the Español / English pair in the mobile drawer)
stores the choice in `localStorage` and reloads the page in that language.

* Interface copy → the `T` dictionary at the top of `assets/js/app.js` (`['Español', 'English']` pairs).
* Clinic content → every item in `data.js` carries `{ es: {...}, en: {...} }`.
* To add a string: add one `key: ['es', 'en']` entry. To translate content: fill the `en` object.

---

## Booking flow

`booking.html` runs a 4-step wizard with live validation:

1. **Your details** — name, phone/WhatsApp, email (optional)
2. **What you need** — treatment pills
3. **When** — date picker (blocks past dates) + time-slot pills
4. **Your case** — description with character counter + consent checkbox
5. **Review** → *Send on WhatsApp*

On submit it:

* generates a reference like `MA-4XK92T`,
* builds the WhatsApp message (reference, name, phone, email, treatment, date, slot, case)
  **in the language the visitor is using**,
* opens `https://wa.me/<number>?text=…` (falls back to navigating there if the pop-up is blocked),
* shows a confirmation screen with *Copy message* and *Call instead*,
* saves the booking in `localStorage` under `ma-bookings`,
* posts the row to the Google Sheet and retries anything left in `ma-sheet-queue` on the next visit.

---

## Connect the Google Sheet (2 minutes)

1. Create the Google Sheet that will receive the appointments.
2. **Extensions → Apps Script**, paste the whole content of
   [`apps-script/Code.gs`](apps-script/Code.gs), save.
3. **Deploy → New deployment → Web app** · *Execute as:* **Me** · *Who has access:* **Anyone**.
4. Copy the URL ending in `/exec`.
5. Put it in `assets/js/data.js` → `sheetUrl`.

Columns (fixed order, header created automatically):

`Timestamp · Reference · Name · Phone · Email · Treatment · TreatmentCode · Date · Slot ·
SlotCode · Condition · Source · WhatsAppSent · Status`

> The browser sends the JSON as `text/plain` with `mode: 'no-cors'`, so there is no CORS
> pre-flight and the request always goes through. Because the response is opaque, the site
> cannot read a success reply — it assumes success and, if the network call throws, the row
> stays in `ma-sheet-queue` and is retried automatically on the next page load.
> If `sheetUrl` is empty, bookings are only kept in the browser.

---

## Design system

| | |
| --- | --- |
| Palette | deep forest ink `#0a1512`, warm cream `#f7f3ea`, teal `#0e6b5e`, mint `#7ce7c4`, gold `#d9a441` |
| Type | Fraunces (display serif) + Manrope (UI sans), loaded from Google Fonts with a full system-font fallback stack |
| Files | `assets/css/base.css` (tokens, reset, type) · `components.css` (buttons, nav, cards, forms, footer) · `pages.css` (layouts, wizard, breakpoints) |
| JS | `data.js` (content) · `app.js` (chrome, i18n, icons, scroll FX) · one page script per template |

**Motion & interaction**: scroll-progress bar, sticky translucent header, animated mesh gradients,
film-grain overlay, staggered reveal on scroll, animated stat counters, hover-lift cards,
marquee ticker, rotating "24 h urgencias" badge, scroll-snap testimonial rail,
animated success tick — all disabled under `prefers-reduced-motion`.

**Responsive**: mobile-first with breakpoints at 620 / 900 / 1080 px. Below 1080 px the nav
collapses into a full-screen drawer and the CTA becomes an icon button so the header never
overflows. 44 px+ tap targets, native date picker, `inputmode`/`autocomplete` hints,
`aria-current` / `aria-expanded` / `aria-pressed`, skip link, visible focus rings.

**No network needed for layout**: only Google Fonts is external; if it is blocked the
serif/sans system stacks take over and everything still looks right.

---

## Tests

Nothing is required to run the site, but there is a test suite that boots every page in a
headless DOM and drives the real flows:

```bash
npm install jsdom     # once
npm test              # 159 checks
```

* `tools/test-site.js` — renders all 7 pages in **both** languages, asserts no JS errors and no
  `undefined` leaking into the markup, checks the ES/EN toggle persists and changes the copy,
  then walks the booking wizard click-by-click (validation blocks → treatment → date/slot →
  consent → review) and asserts the generated WhatsApp URL, the `MA-XXXXXX` reference and the
  stored row. Also covers update filters + the hash reader, product sorting, the contact form
  and the nav/footer wiring.
* `tools/test-apps-script.js` — runs `apps-script/Code.gs` against an in-memory fake of the
  Sheets API: header auto-creation, `text/plain` payloads, malformed input, 1000-char
  truncation and the unbound-script error path.

---

## Accessibility & SEO

* Semantic landmarks, one `h1` per page, `lang` set from the active language
* `Dentist` JSON-LD on the home page (name, address, phone, opening hours)
* Descriptive `title` / `meta description` per page and per language
* Inline SVG icons (`aria-hidden`), decorative images excluded from the a11y tree
