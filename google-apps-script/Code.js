/* Gee Hair NG Google Apps Script backend.
 * Paste the compiled JavaScript into Apps Script, set Script Properties, run setupStore once,
 * then deploy as a Web App executing as you with access set to Anyone.
 */

const SHEETS = ["Products", "Users", "Otps", "Wishlists", "Orders", "Settings"];

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents || "{}");
    assertSecret(data.sharedSecret);
    const handlers = {
      requestOtp: requestOtp,
      verifyOtp: verifyOtp,
      createOrder: createOrder,
      trackOrder: trackOrder,
      listProducts: listProducts,
      saveProduct: saveProduct,
      updateOrder: updateOrder,
      uploadImage: uploadImage,
      getSettings: getSettings,
      saveSettings: saveSettings
    };
    if (!handlers[data.action]) throw new Error("Unknown action");
    return json({ ok: true, ...(handlers[data.action](data) || {}) });
  } catch (error) {
    return json({ ok: false, error: String(error.message || error) });
  }
}

function setupStore() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!spreadsheetId) throw new Error("Set SPREADSHEET_ID in Script Properties first.");
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const headers = {
    Products: ["id", "slug", "name", "category", "texture", "description", "imagesJson", "basePrice", "variantsJson", "featured", "status", "updatedAt"],
    Users: ["id", "email", "name", "phone", "createdAt", "lastLoginAt"],
    Otps: ["email", "codeHash", "expiresAt", "attempts", "lastSentAt"],
    Wishlists: ["userEmail", "productId", "createdAt"],
    Orders: ["reference", "email", "phone", "customerName", "address", "itemsJson", "total", "status", "notes", "createdAt", "updatedAt"],
    Settings: ["key", "value", "updatedAt"]
  };
  SHEETS.forEach(function(name) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    if (sheet.getLastRow() === 0) sheet.appendRow(headers[name]);
    sheet.setFrozenRows(1);
  });
  return "Store sheets are ready.";
}

function requestOtp(data) {
  const email = cleanEmail(data.email);
  const sheet = getSheet("Otps");
  const rows = rowsAsObjects(sheet);
  const existing = rows.find(function(row) { return row.email === email; });
  const now = Date.now();
  if (existing && now - Number(existing.lastSentAt) < 60000) throw new Error("Please wait before requesting another code.");
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const salt = PropertiesService.getScriptProperties().getProperty("OTP_SALT") || "change-this-salt";
  const record = [email, sha256(code + salt), now + 10 * 60000, 0, now];
  upsert(sheet, "email", email, record);
  MailApp.sendEmail({ to: email, subject: "Your Gee Hair NG sign-in code", htmlBody: `<div style="font-family:Arial;padding:24px"><h2>Gee Hair NG</h2><p>Your one-time sign-in code is:</p><p style="font-size:32px;letter-spacing:8px;font-weight:bold">${code}</p><p>This code expires in 10 minutes.</p></div>` });
  return { message: "Code sent" };
}

function verifyOtp(data) {
  const email = cleanEmail(data.email); const code = String(data.code || "");
  const sheet = getSheet("Otps"); const rows = rowsAsObjects(sheet);
  const record = rows.find(function(row) { return row.email === email; });
  if (!record || Number(record.expiresAt) < Date.now() || Number(record.attempts) >= 5) throw new Error("Code expired or unavailable.");
  const salt = PropertiesService.getScriptProperties().getProperty("OTP_SALT") || "change-this-salt";
  if (sha256(code + salt) !== record.codeHash) {
    sheet.getRange(record._row, 4).setValue(Number(record.attempts) + 1);
    throw new Error("Invalid code.");
  }
  sheet.deleteRow(record._row);
  const userSheet = getSheet("Users");
  const existing = rowsAsObjects(userSheet).find(function(row) { return row.email === email; });
  const now = new Date().toISOString();
  upsert(userSheet, "email", email, [existing ? existing.id : Utilities.getUuid(), email, existing ? existing.name : "", existing ? existing.phone : "", existing ? existing.createdAt : now, now]);
  return { user: { email: email } };
}

function createOrder(data) {
  if (!data.reference || !data.email || !data.phone || !Array.isArray(data.items) || !data.items.length) throw new Error("Incomplete order.");
  const sheet = getSheet("Orders");
  if (rowsAsObjects(sheet).some(function(row) { return row.reference === data.reference; })) throw new Error("Order already exists.");
  const now = new Date().toISOString();
  sheet.appendRow([data.reference, cleanEmail(data.email), clean(data.phone), clean(data.name), clean(data.address), JSON.stringify(data.items), Number(data.total || 0), "Received", clean(data.notes || ""), now, now]);
  return { order: { reference: data.reference, status: "Received" } };
}

function trackOrder(data) {
  const ref = clean(data.reference).toUpperCase(); const contact = clean(data.contact).toLowerCase();
  const order = rowsAsObjects(getSheet("Orders")).find(function(row) { return row.reference === ref && (String(row.email).toLowerCase() === contact || String(row.phone).replace(/\D/g, "") === contact.replace(/\D/g, "")); });
  if (!order) throw new Error("Order not found.");
  return { order: { reference: order.reference, status: order.status, createdAt: order.createdAt } };
}

function listProducts() { return { products: rowsAsObjects(getSheet("Products")).map(stripRow) }; }
function saveProduct(data) {
  const p = data.product; if (!p || !p.id || !p.name) throw new Error("Invalid product.");
  upsert(getSheet("Products"), "id", p.id, [p.id, p.slug, p.name, p.category, p.texture, p.description, JSON.stringify(p.images || []), Number(p.basePrice), JSON.stringify(p.variants || []), Boolean(p.featured), p.status || "active", new Date().toISOString()]);
  return { product: p };
}
function updateOrder(data) {
  const sheet = getSheet("Orders"); const order = rowsAsObjects(sheet).find(function(row) { return row.reference === data.reference; });
  if (!order) throw new Error("Order not found.");
  sheet.getRange(order._row, 8).setValue(clean(data.status)); sheet.getRange(order._row, 11).setValue(new Date().toISOString());
  return { order: { reference: order.reference, status: data.status } };
}
function uploadImage(data) {
  const folderId = PropertiesService.getScriptProperties().getProperty("DRIVE_FOLDER_ID");
  if (!folderId) throw new Error("DRIVE_FOLDER_ID is not configured.");
  const bytes = Utilities.base64Decode(String(data.base64 || "").split(",").pop());
  if (bytes.length > 3 * 1024 * 1024) throw new Error("Image must be under 3 MB.");
  const blob = Utilities.newBlob(bytes, data.mimeType || "image/jpeg", clean(data.fileName || "product.jpg"));
  const file = DriveApp.getFolderById(folderId).createFile(blob); file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { imageUrl: `https://drive.google.com/uc?export=view&id=${file.getId()}` };
}
function getSettings() { const values = {}; rowsAsObjects(getSheet("Settings")).forEach(function(row) { values[row.key] = row.value; }); return { settings: values }; }
function saveSettings(data) { Object.keys(data.settings || {}).forEach(function(key) { upsert(getSheet("Settings"), "key", key, [key, clean(data.settings[key]), new Date().toISOString()]); }); return { settings: data.settings }; }

function assertSecret(value) { const expected = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET"); if (!expected || value !== expected) throw new Error("Unauthorized"); }
function getSheet(name) { const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID"); return SpreadsheetApp.openById(id).getSheetByName(name); }
function rowsAsObjects(sheet) { const values = sheet.getDataRange().getValues(); if (values.length < 2) return []; const headers = values[0]; return values.slice(1).map(function(row, index) { const item = { _row: index + 2 }; headers.forEach(function(header, col) { item[header] = row[col]; }); return item; }); }
function upsert(sheet, keyName, keyValue, row) { const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; const keyCol = headers.indexOf(keyName); const values = sheet.getLastRow() > 1 ? sheet.getRange(2, keyCol + 1, sheet.getLastRow() - 1, 1).getValues() : []; const index = values.findIndex(function(value) { return String(value[0]) === String(keyValue); }); if (index >= 0) sheet.getRange(index + 2, 1, 1, row.length).setValues([row]); else sheet.appendRow(row); }
function stripRow(row) { const result = {}; Object.keys(row).forEach(function(key) { if (key !== "_row") result[key] = row[key]; }); return result; }
function clean(value) { return String(value || "").replace(/[<>]/g, "").trim().slice(0, 1000); }
function cleanEmail(value) { const email = clean(value).toLowerCase(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Invalid email."); return email; }
function sha256(value) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value).map(function(byte) { return (byte + 256).toString(16).slice(-2); }).join(""); }
function json(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
