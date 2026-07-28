import { NextRequest, NextResponse } from "next/server";
import { callCatalogBackend, isCatalogBackendConfigured } from "@/lib/catalog-backend";
import { hasValidAdminSession } from "@/lib/admin-auth";

const MAX_BYTES = 3 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  if (!hasValidAdminSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isCatalogBackendConfigured) return NextResponse.json({ error: "Connect Google Apps Script and Google Drive before uploading images." }, { status: 503 });
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "Use a JPEG, PNG or WebP image." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be smaller than 3 MB." }, { status: 400 });
  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  try {
    const data = await callCatalogBackend<{ imageUrl: string }>("uploadImage", { fileName: file.name, mimeType: file.type, base64 });
    return NextResponse.json(data);
  } catch (cause) { return NextResponse.json({ error: cause instanceof Error ? cause.message : "Unable to upload image" }, { status: 502 }); }
}
