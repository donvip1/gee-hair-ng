import { NextRequest, NextResponse } from "next/server";
import { callCatalogBackend, isCatalogBackendConfigured } from "@/lib/catalog-backend";
import { hasValidAdminSession } from "@/lib/admin-auth";
import { privateResponseHeaders, validateMutationRequest } from "@/lib/request-security";

const MAX_BYTES = 3 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  if (!hasValidAdminSession(request)) return json({ error: "Unauthorized" }, 401);
  const requestError = validateMutationRequest(request, "form");
  if (requestError) return json({ error: requestError }, 415);
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BYTES * 1.45) return json({ error: "Image must be smaller than 3 MB." }, 413);
  if (!isCatalogBackendConfigured) return json({ error: "Connect Google Apps Script and Google Drive before uploading images." }, 503);
  let formData: FormData;
  try { formData = await request.formData(); } catch { return json({ error: "Unable to read the image upload." }, 400); }
  const file = formData.get("file");
  if (!(file instanceof File)) return json({ error: "Choose an image file." }, 400);
  if (!allowedTypes.has(file.type)) return json({ error: "Use a JPEG, PNG or WebP image." }, 400);
  if (!file.size || file.size > MAX_BYTES) return json({ error: "Image must be non-empty and smaller than 3 MB." }, 400);
  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  try {
    const data = await callCatalogBackend<{ imageUrl: string }>("uploadImage", { fileName: file.name.slice(0, 180), mimeType: file.type, base64 });
    return json(data);
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Unable to upload image" }, 502); }
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: privateResponseHeaders });
}
