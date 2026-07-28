# Gee Hair NG — WhatsApp Commerce Web App

**Beauty delivered, Confidence unleashed.**

A mobile-first Next.js, React and TypeScript catalog for Gee Hair NG. Customers browse verified products, choose inches, colour and number of 100g bundles, request complimentary first-time wigging, and send the complete selection directly to the official WhatsApp number.

## What is real in this release

- Five actual product entries: Bone Straight, Pixie Curls, Bouncy Curls, Deep Waves and Jerry Curls.
- Four authentic client product photographs; Jerry Curls has a clearly labelled branded placeholder until its photograph is supplied.
- Verified business details:
  - WhatsApp: `+234 805 558 9586`
  - Email: `geeofficialng@gmail.com`
  - Facebook page name: `Hair Addict`
- 100% virgin hair, 100g per bundle, all colours available.
- Complimentary wigging for first-time customers.
- Price on request; Gee confirms price, availability, delivery and payment on WhatsApp.

There are no fake customer accounts, order tracking records, checkout transactions, orders, sales statistics, reviews or inventory values in the app.

## Run locally

Use Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Preview without the admin backend

The storefront works immediately with the verified fallback catalog in `src/lib/products.ts`. Google Apps Script is not involved in any customer transaction. If the admin backend has not been connected, `/admin/products` opens in read-only preview mode and explains what must be configured.

Set an admin password before using `/admin`:

```env
ADMIN_PASSWORD=replace-with-a-strong-password
SESSION_SECRET=replace-with-a-different-long-random-secret
```

## Enable owner product management

The owner dashboard can add, edit and delete products and upload images. Google Sheets stores product data and Google Drive stores uploaded images.

1. Create a Google Sheet and copy its ID from the URL.
2. Create a Google Drive folder for product photos and copy its folder ID.
3. Create a project at [script.google.com](https://script.google.com).
4. Paste `google-apps-script/Code.js` into the Apps Script editor and copy the settings from `google-apps-script/appsscript.json` into the manifest.
5. Add these **Script Properties**:
   - `SPREADSHEET_ID`: Google Sheet ID
   - `DRIVE_FOLDER_ID`: Google Drive folder ID
   - `SHARED_SECRET`: a long random value; use the same value in Vercel
6. Run `setupCatalog` once and approve Sheet and Drive permissions. It creates the Products tab and headers.
7. Deploy as a **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Copy the `/exec` URL and add these server-only values to Vercel:

```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
APPS_SCRIPT_SHARED_SECRET=the-same-long-random-value
```

The shared secret is used only between Vercel route handlers and Apps Script. It is never exposed to browsers. The admin session is checked on the page and on every product or upload API request.

## Deploy on Vercel

1. Import `https://github.com/donvip1/gee-hair-ng` into Vercel.
2. Set `ADMIN_PASSWORD` and `SESSION_SECRET` for the preview deployment.
3. Deploy. The customer catalog and WhatsApp ordering work without Apps Script.
4. Add the Apps Script variables later when the owner dashboard should become writable.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```
