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

The owner dashboard can add, edit, hide and delete products and upload images. Google Sheets stores product data and Google Drive stores uploaded images. Customer orders still go directly to WhatsApp; Apps Script is catalog-only.

> Important: when the live Apps Script backend connects successfully, the storefront uses the Google Sheet instead of the bundled preview catalog. The Sheet intentionally starts empty, so add the first product from `/admin/products` after completing setup.

### A. Create the Google resources

1. Sign in to the Google account that will own the catalog.
2. Create a new Google Sheet. A blank spreadsheet is fine.
3. Copy the Sheet ID from its URL:
   ```text
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```
4. Create a Google Drive folder for Gee Hair NG product images.
5. Open the folder and copy its folder ID from the URL:
   ```text
   https://drive.google.com/drive/folders/DRIVE_FOLDER_ID
   ```

### B. Create and configure Apps Script

1. Open [script.google.com](https://script.google.com) and create a new project.
2. Replace the default editor code with the complete contents of `google-apps-script/Code.js`.
3. Open **Project Settings**, enable **Show `appsscript.json` manifest file in editor**, then replace the manifest with `google-apps-script/appsscript.json`.
4. In **Project Settings → Script Properties**, add exactly:

   | Property | Value |
   | --- | --- |
   | `SPREADSHEET_ID` | The Google Sheet ID copied above |
   | `DRIVE_FOLDER_ID` | The Drive folder ID copied above |
   | `SHARED_SECRET` | A long random value used only by Apps Script and Vercel |

5. In the Apps Script editor, select `setupCatalog` from the function dropdown and click **Run**.
6. Approve the requested Google Sheets and Drive permissions.
7. Confirm that the Google Sheet now has a `Products` tab with a frozen header row. It should have no product rows yet.

### C. Deploy Apps Script as a Web App

1. Click **Deploy → New deployment**.
2. Select **Web app**.
3. Configure:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Deploy and authorize if Google asks again.
5. Copy the Web App URL ending in `/exec`. Do not use the `/dev` test URL.
6. When `Code.js` changes later, use **Deploy → Manage deployments → Edit → New version → Deploy**. Saving the script alone does not update the existing production Web App deployment.

### D. Add all four Vercel environment variables

In the Gee Hair NG Vercel project, open **Settings → Environment Variables** and add:

```env
ADMIN_PASSWORD=your-private-owner-password
SESSION_SECRET=a-different-long-random-session-secret
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
APPS_SCRIPT_SHARED_SECRET=the-exact-SHARED_SECRET-from-Apps-Script
```

Rules:

- `APPS_SCRIPT_SHARED_SECRET` must exactly match the Apps Script `SHARED_SECRET` property.
- `SESSION_SECRET` should be different from `ADMIN_PASSWORD` and at least 32 random characters.
- Apply the variables to **Production**. Apply them to **Preview** too if branch/preview deployments need a working admin CMS.
- Never prefix these variables with `NEXT_PUBLIC_`; they must remain server-only.
- After adding or changing variables, redeploy the latest Vercel deployment. Existing deployments do not receive new environment values automatically.

### E. Verify the live CMS

1. Open `/admin/login` on the deployed Vercel site and log in with `ADMIN_PASSWORD`.
2. Open `/admin/products`.
3. The connection panel should say **Catalog connected** and identify the `Products` Sheet and Drive folder.
4. A new setup shows **Your live catalog is empty**. Click **Add first product**.
5. Add a product, upload a JPEG/PNG/WebP image under 3 MB, and save.
6. Verify it appears on `/shop` and its product page opens.
7. Test edit, hide/show and delete.
8. Verify the product CTA still opens WhatsApp at `+234 805 558 9586` with the configured order details.

### Troubleshooting

- **Setup required / Preview mode:** `GOOGLE_APPS_SCRIPT_URL` or `APPS_SCRIPT_SHARED_SECRET` is missing from that Vercel environment, or the deployment was not rebuilt afterward.
- **Unauthorized:** The Vercel `APPS_SCRIPT_SHARED_SECRET` does not exactly match Apps Script `SHARED_SECRET`.
- **Invalid backend response:** Check that the URL ends in `/exec`, access is set to **Anyone**, and the newest Apps Script version was deployed.
- **Missing Script Properties:** Add all three properties in Apps Script Project Settings, then run `setupCatalog` again.
- **Cannot access Sheet or folder:** The IDs are wrong or the Google account executing the Web App does not own/have access to them.
- **Image upload fails:** Use JPEG, PNG or WebP smaller than 3 MB and confirm the Drive folder ID is correct.
- **Login works but Add product is disabled:** The admin password/session is working, but the catalog backend health check is not ready. Read the connection message on `/admin/products`.

The optional command `npx plugins add vercel/vercel-plugin` installs guidance for supported AI coding tools. It does not deploy the web app or enable this catalog backend, so it is not required for Gee Hair NG.

## Deploy on Vercel

1. Import `https://github.com/donvip1/gee-hair-ng` into Vercel.
2. Add `ADMIN_PASSWORD`, `SESSION_SECRET`, `GOOGLE_APPS_SCRIPT_URL` and `APPS_SCRIPT_SHARED_SECRET` as described above.
3. Deploy or redeploy after the environment variables have been saved.
4. Verify `/admin/login`, `/admin/products`, `/shop` and a complete WhatsApp product request on the deployed URL.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```
