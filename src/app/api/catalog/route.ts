import { NextResponse } from "next/server";
import { getPublicCatalog } from "@/lib/catalog-backend";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPublicCatalog());
}
