import { ImageResponse } from "next/og";
import { business } from "@/lib/business";

export const runtime = "edge";
export const alt = `${business.name} — ${business.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#4f171c", color: "#fff8ef", padding: "80px", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: "760px" }}><span style={{ fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: "#e6a486" }}>Premium human hair · Abuja</span><strong style={{ fontFamily: "Georgia", fontSize: 92, lineHeight: .95, marginTop: 30 }}>{business.name}</strong><span style={{ fontFamily: "Georgia", fontSize: 48, fontStyle: "italic", color: "#e6a486", marginTop: 28 }}>{business.tagline}</span></div>
      <div style={{ width: 250, height: 250, borderRadius: 999, border: "3px solid #e6a486", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia", fontSize: 150 }}>G</div>
    </div>,
    size
  );
}
