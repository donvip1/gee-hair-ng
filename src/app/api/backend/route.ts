import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const token = process.env.APPS_SCRIPT_SHARED_SECRET;
  if (!url || !token) return NextResponse.json({ error: "Backend not configured" }, { status: 503 });
  const payload = await request.json();
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...payload, sharedSecret: token }),
    cache: "no-store"
  });
  const text = await response.text();
  try { return NextResponse.json(JSON.parse(text), { status: response.ok ? 200 : 502 }); }
  catch { return NextResponse.json({ error: "Invalid backend response" }, { status: 502 }); }
}
