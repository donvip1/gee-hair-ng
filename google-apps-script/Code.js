/* Gee Hair NG catalog-only Apps Script backend.
 * Customer enquiries and transactions never pass through this script.
 *
 * Required Script Properties:
 * - SPREADSHEET_ID
 * - DRIVE_FOLDER_ID
 * - SHARED_SECRET
 *
 * Run setupCatalog once, then deploy as a Web App executing as you with
 * access set to Anyone. The catalog intentionally starts empty.
 */

const PRODUCT_SHEET_NAME = "Products";
const PRODUCT_HEADERS = ["id", "slug", "name", "category", "texture", "description", "detailsJson", "image", "imagesJson", "minLength", "maxLength", "lengthStep", "colours", "bundleWeightGrams", "featured", "active", "imagePending", "updatedAt"];
const ALLOWED_CATEGORIES = ["Straight", "Curls", "Waves"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

function doPost(event) {
  try {
    const data = parseRequest(event);
    assertSecret(data.sharedSecret);
    const handlers = {
      healthCheck: healthCheck,
      listProducts: listProducts,
      saveProduct: saveProduct,
      deleteProduct: deleteProduct,
      uploadImage: uploadImage
    };
    if (!handlers[data.action]) throw new Error("Unknown catalog action.");
    return json({ ok: true, ...(handlers[data.action](data) || {}) });
  } catch (error) {
    return json({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function setupCatalog() {
  assertConfiguration();
  const sheet = getProductSheet();
  ensureProductHeaders(sheet);
  sheet.setFrozenRows(1);
  return "Gee Hair NG Products sheet is ready. The live catalog is empty until you add products in the admin dashboard.";
}

function healthCheck() {
  assertConfiguration();
  const sheet = getProductSheet();
  ensureProductHeaders(sheet);
  const folder = getDriveFolder();
  return {
    service: "Gee Hair NG catalog",
    sheetName: sheet.getName(),
    driveFolderName: folder.getName(),
    productCount: rowsAsObjects(sheet).length,
    ready: true
  };
}

function listProducts(data) {
  const sheet = getProductSheet();
  ensureProductHeaders(sheet);
  const products = rowsAsObjects(sheet).map(rowToProduct);
  return { products: data.includeInactive ? products : products.filter(product => product.active) };
}

function saveProduct(data) {
  const product = validateProduct(data.product || {});
  return withScriptLock(function () {
    const sheet = getProductSheet();
    ensureProductHeaders(sheet);
    assertUniqueSlug(sheet, product.slug, product.id);
    const now = new Date().toISOString();
    const id = product.id || `GH-${Utilities.getUuid().slice(0, 8).toUpperCase()}`;
    const saved = { ...product, id: id, updatedAt: now };
    const row = [
      id,
      saved.slug,
      saved.name,
      saved.category,
      saved.texture,
      saved.description,
      JSON.stringify(saved.details),
      saved.image,
      JSON.stringify(saved.images.length ? saved.images : [saved.image]),
      saved.minLength,
      saved.maxLength,
      saved.lengthStep,
      saved.colours,
      saved.bundleWeightGrams,
      saved.featured,
      saved.active,
      saved.imagePending,
      now
    ];
    upsert(sheet, "id", id, row);
    return { product: saved };
  });
}

function deleteProduct(data) {
  const id = clean(data.id, 100);
  if (!id) throw new Error("Product ID is required.");
  return withScriptLock(function () {
    const sheet = getProductSheet();
    ensureProductHeaders(sheet);
    const product = rowsAsObjects(sheet).find(row => String(row.id) === id);
    if (!product) throw new Error("Product not found.");
    sheet.deleteRow(product._row);
    return { deletedId: id };
  });
}

function uploadImage(data) {
  const mimeType = clean(data.mimeType, 100);
  if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) throw new Error("Use a JPEG, PNG or WebP image.");
  const encoded = String(data.base64 || "").split(",").pop();
  if (!encoded) throw new Error("Image data is required.");
  let bytes;
  try {
    bytes = Utilities.base64Decode(encoded);
  } catch (error) {
    throw new Error("The uploaded image data is invalid.");
  }
  if (!bytes.length) throw new Error("The uploaded image is empty.");
  if (bytes.length > MAX_IMAGE_BYTES) throw new Error("Image must be smaller than 3 MB.");
  const fileName = clean(data.fileName || `product-${Date.now()}`, 180).replace(/[\\/]/g, "-");
  const blob = Utilities.newBlob(bytes, mimeType, fileName);
  const file = getDriveFolder().createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return {
    fileId: file.getId(),
    imageUrl: `https://drive.google.com/uc?export=view&id=${file.getId()}`
  };
}

function validateProduct(raw) {
  const minLength = toPositiveInteger(raw.minLength, "Minimum length");
  const maxLength = toPositiveInteger(raw.maxLength, "Maximum length");
  const lengthStep = toPositiveInteger(raw.lengthStep || 2, "Length step");
  const bundleWeightGrams = toPositiveInteger(raw.bundleWeightGrams || 100, "Bundle weight");
  const category = clean(raw.category, 40);
  const product = {
    id: clean(raw.id, 100),
    slug: clean(raw.slug, 120).toLowerCase(),
    name: clean(raw.name, 160),
    category: category,
    texture: clean(raw.texture, 220),
    description: clean(raw.description, 2000),
    details: Array.isArray(raw.details) ? raw.details.map(value => clean(value, 300)).filter(Boolean).slice(0, 12) : [],
    image: clean(raw.image, 2000),
    images: Array.isArray(raw.images) ? raw.images.map(value => clean(value, 2000)).filter(Boolean).slice(0, 8) : [],
    minLength: minLength,
    maxLength: maxLength,
    lengthStep: lengthStep,
    colours: clean(raw.colours || "All colours available", 500),
    bundleWeightGrams: bundleWeightGrams,
    featured: toBoolean(raw.featured),
    active: toBoolean(raw.active),
    imagePending: toBoolean(raw.imagePending)
  };
  if (!product.name) throw new Error("Product name is required.");
  if (!product.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) throw new Error("Use a lowercase slug containing letters, numbers and single hyphens.");
  if (!ALLOWED_CATEGORIES.includes(product.category)) throw new Error("Category must be Straight, Curls or Waves.");
  if (!product.texture) throw new Error("Texture is required.");
  if (!product.description) throw new Error("Description is required.");
  if (!product.image) throw new Error("A product image is required.");
  if (product.maxLength < product.minLength) throw new Error("Maximum length must be greater than or equal to minimum length.");
  if ((product.maxLength - product.minLength) % product.lengthStep !== 0) throw new Error("The length range must divide evenly by the length step.");
  if (!product.images.length) product.images = [product.image];
  return product;
}

function assertUniqueSlug(sheet, slug, currentId) {
  const duplicate = rowsAsObjects(sheet).find(row => String(row.slug).trim().toLowerCase() === slug && String(row.id) !== String(currentId || ""));
  if (duplicate) throw new Error(`Another product already uses the slug "${slug}".`);
}

function assertConfiguration() {
  const properties = PropertiesService.getScriptProperties();
  const missing = ["SPREADSHEET_ID", "DRIVE_FOLDER_ID", "SHARED_SECRET"].filter(name => !properties.getProperty(name));
  if (missing.length) throw new Error(`Missing Script Properties: ${missing.join(", ")}.`);
  getSpreadsheet();
  getDriveFolder();
}

function getSpreadsheet() {
  const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!id) throw new Error("SPREADSHEET_ID is not configured.");
  try {
    return SpreadsheetApp.openById(id);
  } catch (error) {
    throw new Error("SPREADSHEET_ID is invalid or this Apps Script account cannot access the Google Sheet.");
  }
}

function getDriveFolder() {
  const id = PropertiesService.getScriptProperties().getProperty("DRIVE_FOLDER_ID");
  if (!id) throw new Error("DRIVE_FOLDER_ID is not configured.");
  try {
    return DriveApp.getFolderById(id);
  } catch (error) {
    throw new Error("DRIVE_FOLDER_ID is invalid or this Apps Script account cannot access the Drive folder.");
  }
}

function getProductSheet() {
  const spreadsheet = getSpreadsheet();
  return spreadsheet.getSheetByName(PRODUCT_SHEET_NAME) || spreadsheet.insertSheet(PRODUCT_SHEET_NAME);
}

function ensureProductHeaders(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (sheet.getLastRow() === 0 || lastColumn === 0) {
    sheet.getRange(1, 1, 1, PRODUCT_HEADERS.length).setValues([PRODUCT_HEADERS]);
    return;
  }
  const current = sheet.getRange(1, 1, 1, Math.max(lastColumn, PRODUCT_HEADERS.length)).getValues()[0].slice(0, PRODUCT_HEADERS.length);
  if (current.join("|") !== PRODUCT_HEADERS.join("|")) {
    if (sheet.getLastRow() > 1) throw new Error("The Products sheet headers do not match the required schema. Use a new empty Products sheet or restore the documented headers before continuing.");
    sheet.clear();
    sheet.getRange(1, 1, 1, PRODUCT_HEADERS.length).setValues([PRODUCT_HEADERS]);
  }
}

function rowsAsObjects(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).filter(row => row.some(value => value !== "")).map((row, index) => {
    const item = { _row: index + 2 };
    headers.forEach((header, column) => item[header] = row[column]);
    return item;
  });
}

function upsert(sheet, keyName, keyValue, row) {
  ensureProductHeaders(sheet);
  const headers = sheet.getRange(1, 1, 1, PRODUCT_HEADERS.length).getValues()[0];
  const keyColumn = headers.indexOf(keyName);
  if (keyColumn < 0) throw new Error(`The ${keyName} column is missing from the Products sheet.`);
  const values = sheet.getLastRow() > 1 ? sheet.getRange(2, keyColumn + 1, sheet.getLastRow() - 1, 1).getValues() : [];
  const index = values.findIndex(value => String(value[0]) === String(keyValue));
  if (index >= 0) sheet.getRange(index + 2, 1, 1, PRODUCT_HEADERS.length).setValues([row]);
  else sheet.appendRow(row);
}

function rowToProduct(row) {
  const image = String(row.image || "");
  const images = parseArray(row.imagesJson);
  return {
    id: String(row.id || ""),
    slug: String(row.slug || ""),
    name: String(row.name || ""),
    category: String(row.category || ""),
    texture: String(row.texture || ""),
    description: String(row.description || ""),
    details: parseArray(row.detailsJson),
    image: image,
    images: images.length ? images : (image ? [image] : []),
    minLength: Number(row.minLength),
    maxLength: Number(row.maxLength),
    lengthStep: Number(row.lengthStep || 2),
    colours: String(row.colours || "All colours available"),
    bundleWeightGrams: Number(row.bundleWeightGrams || 100),
    featured: toBoolean(row.featured),
    active: toBoolean(row.active),
    imagePending: toBoolean(row.imagePending),
    updatedAt: String(row.updatedAt || "")
  };
}

function withScriptLock(callback) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error("The catalog is busy. Please try again in a few seconds.");
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}

function parseRequest(event) {
  if (!event || !event.postData || !event.postData.contents) throw new Error("Request body is required.");
  try {
    return JSON.parse(event.postData.contents);
  } catch (error) {
    throw new Error("Request body must be valid JSON.");
  }
}

function assertSecret(value) {
  const expected = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET");
  if (!expected) throw new Error("SHARED_SECRET is not configured.");
  if (String(value || "") !== expected) throw new Error("Unauthorized.");
}

function parseArray(value) {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(String(value || "[]"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function toPositiveInteger(value, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) throw new Error(`${label} must be a positive whole number.`);
  return number;
}

function toBoolean(value) {
  return value === true || String(value).toLowerCase() === "true";
}

function clean(value, maxLength) {
  return String(value == null ? "" : value).replace(/[<>]/g, "").trim().slice(0, maxLength || 2000);
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
