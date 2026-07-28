# Gee Hair NG — Next.js Commerce Web App

A mobile-first luxury hair storefront and installable web app built with Next.js, React, and TypeScript. It includes a searchable catalog, product variants, persistent cart and wishlist, WhatsApp checkout, email-code account UI, order tracking, admin dashboard, PWA support, and a Google Apps Script backend package.

## Run locally

Use Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The app can run in preview mode without the backend. Product data is currently seeded in `src/lib/products.ts`; the shown names and prices are samples because the supplied WhatsApp screenshots did not contain a real catalog or prices.

## Google Sheets + Apps Script backend

1. Create a Google Sheet for the store and copy its ID from the URL.
2. Create a Google Drive folder for product photos and copy its folder ID.
3. Open [script.google.com](https://script.google.com), create a project, and add the files from `google-apps-script/`:
   - paste `Code.js` into the script editor;
   - copy the settings from `appsscript.json` into the project manifest.
4. In **Project Settings → Script Properties**, add:
   - `SPREADSHEET_ID`: the Google Sheet ID;
   - `DRIVE_FOLDER_ID`: the Google Drive folder ID;
   - `SHARED_SECRET`: a long random value that will also be stored in Vercel;
   - `OTP_SALT`: another long random value used to hash one-time codes.
5. In the Apps Script editor, run `setupStore` once and approve the requested Sheet, Drive, and email permissions. It creates the `Products`, `Users`, `Otps`, `Wishlists`, `Orders`, and `Settings` tabs.
6. Choose **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Copy the `/exec` deployment URL.
8. Set `GOOGLE_APPS_SCRIPT_URL` and the matching `APPS_SCRIPT_SHARED_SECRET` in `.env.local` and in Vercel.

Apps Script `MailApp` has daily sending quotas. Email OTP login is suitable for a small first release; monitor the quota as the store grows.

## Admin dashboard

Set these private server environment variables:

- `ADMIN_PASSWORD`: strong password used at `/admin/login`;
- `SESSION_SECRET`: separate random secret used to sign admin cookies.

The dashboard routes are protected by a signed, secure, HTTP-only cookie. Five failed login attempts from one IP are paused for 15 minutes. For a larger team, replace password login with Google Workspace identity/allowlisting.

## Deploy free on Vercel

1. Push this folder to a GitHub repository.
2. Sign in to Vercel and choose **Add New → Project**.
3. Import the repository. Vercel detects Next.js automatically.
4. Add the four environment variables from `.env.example` under **Project Settings → Environment Variables**.
5. Deploy. No custom build command is required.
6. After deployment, install the app from the browser’s **Add to Home Screen / Install App** option.

## Important production notes

- Replace sample Unsplash photography with the client’s licensed product photography before launch.
- Replace the sample catalog and prices in `src/lib/products.ts`, or finish wiring the admin product actions to `listProducts`/`saveProduct` in Apps Script.
- The backend endpoints already support orders, tracking, OTPs, products, settings, order status changes, and Drive uploads. The customer order and tracking flows call the backend proxy today; remaining admin buttons are intentionally presented as UI until the owner’s Sheet and Drive IDs are connected.
- Checkout creates an order reference and opens WhatsApp with a complete order summary. It does not collect online payment.
- Use the exact client details verified from the screenshots: Gee Hair NG, +234 803 558 9586, Karsana in the Federal Capital Territory, 07:00–23:00 daily, and `ochijegoodness9@gmail.com`.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm start
```
