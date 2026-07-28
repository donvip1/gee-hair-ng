/* Gee Hair NG catalog-only Apps Script backend.
 * Customer enquiries and transactions do not pass through this script.
 * Set SPREADSHEET_ID, DRIVE_FOLDER_ID and SHARED_SECRET in Script Properties,
 * run setupCatalog once, then deploy as a Web App executing as you.
 */

const PRODUCT_HEADERS = ["id", "slug", "name", "category", "texture", "description", "detailsJson", "image", "imagesJson", "minLength", "maxLength", "lengthStep", "colours", "bundleWeightGrams", "featured", "active", "imagePending", "updatedAt"];

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents || "{}");
    assertSecret(data.sharedSecret);
    const handlers = { listProducts, saveProduct, deleteProduct, uploadImage };
    if (!handlers[data.action]) throw new Error("Unknown action.");
    return json({ ok: true, ...(handlers[data.action](data) || {}) });
  } catch (error) {
    return json({ ok: false, error: String(error.message || error) });
  }
}

function setupCatalog() {
  const sheet = getProductSheet();
  if (sheet.getLastRow() === 0) sheet.appendRow(PRODUCT_HEADERS);
  sheet.setFrozenRows(1);
  return "Gee Hair NG Products sheet is ready.";
}

function listProducts(data) {
  const products = rowsAsObjects(getProductSheet()).map(rowToProduct);
  return { products: data.includeInactive ? products : products.filter(product => product.active) };
}

function saveProduct(data) {
  const product = validateProduct(data.product || {});
  const now = new Date().toISOString();
  const id = clean(product.id) || `GH-${Utilities.getUuid().slice(0, 8).toUpperCase()}`;
  const saved = { ...product, id, updatedAt: now };
  const row = [id, saved.slug, saved.name, saved.category, saved.texture, saved.description, JSON.stringify(saved.details || []), saved.image, JSON.stringify(saved.images || [saved.image]), saved.minLength, saved.maxLength, saved.lengthStep, saved.colours, saved.bundleWeightGrams, saved.featured, saved.active, saved.imagePending, now];
  upsert(getProductSheet(), "id", id, row);
  return { product: saved };
}

function deleteProduct(data) {
  const id = clean(data.id);
  if (!id) throw new Error("Product ID is required.");
  const sheet = getProductSheet();
  const product = rowsAsObjects(sheet).find(row => String(row.id) === id);
  if (!product) throw new Error("Product not found.");
  sheet.deleteRow(product._row);
  return { deletedId: id };
}

function uploadImage(data) {
  const folderId = PropertiesService.getScriptProperties().getProperty("DRIVE_FOLDER_ID");
  if (!folderId) throw new Error("DRIVE_FOLDER_ID is not configured.");
  const base64 = String(data.base64 || "").split(",").pop();
  const bytes = Utilities.base64Decode(base64);
  if (bytes.length > 3 * 1024 * 1024) throw new Error("Image must be smaller than 3 MB.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(data.mimeType)) throw new Error("Unsupported image type.");
  const blob = Utilities.newBlob(bytes, data.mimeType, clean(data.fileName || "product-image"));
  const file = DriveApp.getFolderById(folderId).createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { imageUrl: `https://drive.google.com/uc?export=view&id=${file.getId()}` };
}

function validateProduct(raw) {
  const product = {
    id: clean(raw.id), slug: clean(raw.slug), name: clean(raw.name), category: clean(raw.category), texture: clean(raw.texture),
    description: clean(raw.description), details: Array.isArray(raw.details) ? raw.details.map(clean) : [], image: clean(raw.image),
    images: Array.isArray(raw.images) ? raw.images.map(clean).filter(Boolean) : [], minLength: Number(raw.minLength), maxLength: Number(raw.maxLength),
    lengthStep: Number(raw.lengthStep || 2), colours: clean(raw.colours || "All colours available"), bundleWeightGrams: Number(raw.bundleWeightGrams || 100),
    featured: Boolean(raw.featured), active: Boolean(raw.active), imagePending: Boolean(raw.imagePending)
  };
  if (!product.name || !product.slug || !/^[a-z0-9-]+$/.test(product.slug)) throw new Error("Valid name and slug are required.");
  if (!product.image) throw new Error("Product image is required.");
  if (!product.minLength || product.maxLength < product.minLength) throw new Error("Invalid length range.");
  return product;
}

function rowToProduct(row) {
  return { id: String(row.id), slug: String(row.slug), name: String(row.name), category: String(row.category), texture: String(row.texture), description: String(row.description), details: parseArray(row.detailsJson), image: String(row.image), images: parseArray(row.imagesJson), minLength: Number(row.minLength), maxLength: Number(row.maxLength), lengthStep: Number(row.lengthStep || 2), colours: String(row.colours), bundleWeightGrams: Number(row.bundleWeightGrams || 100), featured: toBoolean(row.featured), active: toBoolean(row.active), imagePending: toBoolean(row.imagePending), updatedAt: String(row.updatedAt) };
}
function getProductSheet() { const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID"); if (!id) throw new Error("SPREADSHEET_ID is not configured."); const ss = SpreadsheetApp.openById(id); return ss.getSheetByName("Products") || ss.insertSheet("Products"); }
function rowsAsObjects(sheet) { const values = sheet.getDataRange().getValues(); if (values.length < 2) return []; const headers = values[0]; return values.slice(1).filter(row => row.some(Boolean)).map((row, index) => { const item = { _row: index + 2 }; headers.forEach((header, col) => item[header] = row[col]); return item; }); }
function upsert(sheet, keyName, keyValue, row) { if (sheet.getLastRow() === 0) sheet.appendRow(PRODUCT_HEADERS); const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; const keyCol = headers.indexOf(keyName); const values = sheet.getLastRow() > 1 ? sheet.getRange(2, keyCol + 1, sheet.getLastRow() - 1, 1).getValues() : []; const index = values.findIndex(value => String(value[0]) === String(keyValue)); if (index >= 0) sheet.getRange(index + 2, 1, 1, row.length).setValues([row]); else sheet.appendRow(row); }
function assertSecret(value) { const expected = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET"); if (!expected || value !== expected) throw new Error("Unauthorized."); }
function parseArray(value) { if (Array.isArray(value)) return value; try { const parsed = JSON.parse(String(value || "[]")); return Array.isArray(parsed) ? parsed : []; } catch { return []; } }
function toBoolean(value) { return value === true || String(value).toLowerCase() === "true"; }
function clean(value) { return String(value || "").replace(/[<>]/g, "").trim().slice(0, 2000); }
function json(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
